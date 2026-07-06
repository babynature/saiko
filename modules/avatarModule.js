// modules/avatarModule.js — Paper-doll avatar renderer (Phase A)
// Layers stack: shadow → base → bottom → top → hair → face(emotion)
// Art lives in charector/avatar/*.png (tile 64x96, display 128x192).
//
// Double-outline fix: _buildBodyLayer() uses destination-out to erase
// base pixels wherever clothing pixels exist, then draws clothing on top.
// This ensures only one outline layer is visible at any garment boundary.

(function () {
  const TW = 64, TH = 96, SCALE = 2;
  const BASE_PATH = 'charector/avatar/';

  const FACE = { neutral: 0, happy: 1, hungry: 2, tired: 3, stressed: 4, yum: 5, sad: 6, sleep: 7, angry: 8 };

  const MOOD = {
    idle:      { face: 'neutral',  anim: 'idle'  },
    happy:     { face: 'happy',    anim: 'cheer' },
    hungry:    { face: 'hungry',   anim: 'shake' },
    starving:  { face: 'sad',      anim: 'shakeHard' },
    tired:     { face: 'tired',    anim: 'sway'  },
    exhausted: { face: 'sleep',    anim: 'sway'  },
    stressed:  { face: 'stressed', anim: 'jitter' },
  };

  const IMG_KEYS = ['shadow', 'base', 'bottom', 'top', 'hair',
    'face_0','face_1','face_2','face_3','face_4','face_5','face_6','face_7','face_8'];

  class AvatarModule {
    constructor() {
      this.img = {};
      this.ready = false;
      this.canvas = null;
      this.ctx = null;
      this._raf = null;
      this.worn = { top: true, bottom: true, hair: true };
      this.faceIdx = 0;
      this.anim = 'idle';
      this.animStart = 0;
      this.onceCb = null;
      this._bodyCanvas = null;
      this._bodyCtx = null;
    }

    init() {
      if (this._initPromise) return this._initPromise;
      this._initPromise = new Promise((resolve) => {
        let loaded = 0;
        const done = () => {
          if (++loaded >= IMG_KEYS.length) {
            this.ready = true;
            this._buildBodyLayer();
            resolve();
          }
        };
        IMG_KEYS.forEach((k) => {
          const im = new Image();
          im.onload = done;
          im.onerror = done;
          im.src = BASE_PATH + k + '.png';
          this.img[k] = im;
        });
      });
      return this._initPromise;
    }

    // Pre-composite body: base → erase where clothing goes → draw clothing.
    // Result is a single canvas with no double-outline at garment boundaries.
    _buildBodyLayer() {
      const W = TW * SCALE, H = TH * SCALE;
      if (!this._bodyCanvas) {
        this._bodyCanvas = document.createElement('canvas');
        this._bodyCanvas.width = W;
        this._bodyCanvas.height = H;
        this._bodyCtx = this._bodyCanvas.getContext('2d');
        this._bodyCtx.imageSmoothingEnabled = false;
      }
      const bct = this._bodyCtx;
      bct.clearRect(0, 0, W, H);

      const drawImg = (k) => {
        if (this.img[k] && this.img[k].width) bct.drawImage(this.img[k], 0, 0, W, H);
      };

      // 1. Draw full base (skin + body outline)
      drawImg('base');

      // 2. Erase base pixels that sit under any clothing layer
      bct.globalCompositeOperation = 'destination-out';
      if (this.worn.bottom) drawImg('bottom');
      if (this.worn.top)    drawImg('top');
      if (this.worn.hair)   drawImg('hair');

      // 3. Draw clothing on top of the erased region
      bct.globalCompositeOperation = 'source-over';
      if (this.worn.bottom) drawImg('bottom');
      if (this.worn.top)    drawImg('top');
      if (this.worn.hair)   drawImg('hair');
    }

    mount(canvas) {
      if (!canvas) return;
      this.canvas = canvas;
      this.canvas.width = TW * SCALE;
      this.canvas.height = TH * SCALE;
      this.ctx = canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;
      this.init();
      if (!this._raf) this._loop(performance.now());
    }

    // ── public API ──
    setEmotion(name) { if (name in FACE) this.faceIdx = FACE[name]; }
    setAnim(a) { this.anim = a; this.animStart = performance.now(); }

    setMood(moodKey) {
      const m = MOOD[moodKey] || MOOD.idle;
      this.setEmotion(m.face);
      if (this.anim !== 'eat') this.setAnim(m.anim);
    }

    playOnce(a, cb) {
      this.anim = a; this.animStart = performance.now(); this.onceCb = cb || null;
      if (a === 'eat') this.setEmotion('yum');
    }

    equip(slot, on) {
      if (slot in this.worn) {
        this.worn[slot] = !!on;
        if (this.ready) this._buildBodyLayer();
      }
    }

    snapshot(type) {
      return this.canvas ? this.canvas.toDataURL(type === 'webp' ? 'image/webp' : 'image/png') : null;
    }

    destroy() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null; this.canvas = null; this.ctx = null;
    }

    _motion(t) {
      const s = (t - this.animStart) / 1000;
      switch (this.anim) {
        case 'idle':      return { dy: Math.sin(t / 450) * 2 };
        case 'cheer':     return { dy: -Math.abs(Math.sin(t / 180)) * 4 };
        case 'sway':      return { rot: Math.sin(t / 700) * 3, dy: Math.sin(t / 700) * 1.2 };
        case 'shake':     return { dx: Math.sin(t / 70) * 1.4, rot: Math.sin(t / 70) * 1.4 };
        case 'shakeHard': return { dx: Math.sin(t / 45) * 2.2 };
        case 'jitter':    return { dx: Math.sin(t / 45) * 1.4, dy: Math.cos(t / 50) * 1 };
        case 'eat': {
          const k = Math.min(1, s / 0.55);
          const b = Math.sin(k * Math.PI);
          return { dy: -b * 6, sy: 1 - b * 0.06, done: k >= 1 };
        }
        default: return {};
      }
    }

    _loop(t) {
      this._raf = requestAnimationFrame((tt) => this._loop(tt));
      const ctx = this.ctx;
      if (!ctx || !this.ready) return;

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const m = this._motion(t);
      if (m.done && this.onceCb) { const cb = this.onceCb; this.onceCb = null; cb(); }

      const W = this.canvas.width, H = this.canvas.height;

      // Shadow stays on ground, shrinks as character lifts
      const lift = Math.max(0, -(m.dy || 0));
      const shW = W * (1 - lift * 0.05);
      if (this.img.shadow && this.img.shadow.width) {
        ctx.drawImage(this.img.shadow, (W - shW) / 2, 0, shW, H);
      }

      // Character stack (pivot at feet)
      const dx = (m.dx || 0), dy = (m.dy || 0), rot = (m.rot || 0) * Math.PI / 180, sy = (m.sy || 1);
      ctx.save();
      ctx.translate(W / 2 + dx * SCALE, H * 0.94);
      ctx.rotate(rot);
      ctx.scale(1, sy);
      ctx.translate(-W / 2, -H * 0.94 + dy * SCALE);

      // Draw pre-composited body (no double-outline)
      if (this._bodyCanvas) ctx.drawImage(this._bodyCanvas, 0, 0, W, H);

      // Face drawn separately so emotion swaps don't require body rebuild
      const f = this.img['face_' + this.faceIdx];
      if (f && f.width) {
        ctx.drawImage(f, (TW / 2 - f.width / 2) * SCALE, 28 * SCALE, f.width * SCALE, f.height * SCALE);
      }

      ctx.restore();
    }
  }

  window.avatarModule = new AvatarModule();
})();
