// modules/avatarModule.js — Paper-doll avatar renderer (Phase A)
// Renders a layered pixel character on a <canvas>, animated purely via
// transforms (no multi-frame art needed yet). Emotions = face-layer swap.
//
// Layers stack: shadow → base → bottom → top → hair → face(emotion)
// Art lives in charector/avatar/*.png (tile 64x96).

(function () {
  const TW = 64, TH = 96, SCALE = 2;            // display 128x192
  const BASE_PATH = 'charector/avatar/';

  // face strip order (from generated art): index → expression
  const FACE = { neutral: 0, happy: 1, hungry: 2, tired: 3, stressed: 4, yum: 5, sad: 6, sleep: 7, angry: 8 };

  // mood (from getCharacterMood().anim) → face + body motion
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
    }

    init() {
      if (this._initPromise) return this._initPromise;
      this._initPromise = new Promise((resolve) => {
        let loaded = 0;
        const done = () => { if (++loaded >= IMG_KEYS.length) { this.ready = true; resolve(); } };
        IMG_KEYS.forEach((k) => {
          const im = new Image();
          im.onload = done;
          im.onerror = done;              // don't block on a missing file
          const file = k.startsWith('face_') ? k + '.png' : k + '.png';
          im.src = BASE_PATH + file;
          this.img[k] = im;
        });
      });
      return this._initPromise;
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

    // drive both face + motion from a mood key (getCharacterMood().anim)
    setMood(moodKey) {
      const m = MOOD[moodKey] || MOOD.idle;
      this.setEmotion(m.face);
      if (this.anim !== 'eat') this.setAnim(m.anim);   // don't interrupt eat
    }

    playOnce(a, cb) {
      this.anim = a; this.animStart = performance.now(); this.onceCb = cb || null;
      if (a === 'eat') this.setEmotion('yum');
    }

    equip(slot, on) { if (slot in this.worn) this.worn[slot] = !!on; }

    snapshot(type) {
      return this.canvas ? this.canvas.toDataURL(type === 'webp' ? 'image/webp' : 'image/png') : null;
    }

    destroy() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null; this.canvas = null; this.ctx = null;
    }

    // ── motion: returns transform for the character (shadow handled apart) ──
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

      // shadow — stays on ground, shrinks as the character lifts
      const lift = Math.max(0, -(m.dy || 0));
      const shW = W * (1 - lift * 0.05);
      if (this.img.shadow && this.img.shadow.width) ctx.drawImage(this.img.shadow, (W - shW) / 2, 0, shW, H);

      // character stack (pivot at feet)
      const dx = (m.dx || 0), dy = (m.dy || 0), rot = (m.rot || 0) * Math.PI / 180, sy = (m.sy || 1);
      ctx.save();
      ctx.translate(W / 2 + dx * SCALE, H * 0.94);
      ctx.rotate(rot);
      ctx.scale(1, sy);
      ctx.translate(-W / 2, -H * 0.94 + dy * SCALE);

      const draw = (k) => { if (this.img[k] && this.img[k].width) ctx.drawImage(this.img[k], 0, 0, W, H); };
      draw('base');
      if (this.worn.bottom) draw('bottom');
      if (this.worn.top) draw('top');
      if (this.worn.hair) draw('hair');
      const f = this.img['face_' + this.faceIdx];
      if (f && f.width) ctx.drawImage(f, (TW / 2 - f.width / 2) * SCALE, 20 * SCALE, f.width * SCALE, f.height * SCALE);
      ctx.restore();
    }
  }

  window.avatarModule = new AvatarModule();
})();
