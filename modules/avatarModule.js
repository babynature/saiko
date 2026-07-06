// modules/avatarModule.js — Paper-doll avatar renderer
// Layers: shadow(procedural) → base_{gender} → bottom_{outfit} → top_{outfit} → hair_{hair} → face_{emotion}
//
// Double-outline fix: _buildBodyLayer() uses destination-out to erase base pixels
// wherever clothing pixels exist, then redraws clothing on top → single outline.
//
// API:
//   avatarModule.mount(canvas)
//   avatarModule.setLoadout(gender, outfit, hair)   e.g. ('f', 'f_princess', 'f_long_black')
//   avatarModule.setMood(moodKey)
//   avatarModule.playOnce(animName, callback)
//   avatarModule.snapshot()

(function () {
  const TW = 64, TH = 96, SCALE = 2;
  const BASE_PATH = 'charector/avatar/';

  // Order matches actual face strip: neutral happy yum hungry stressed tired sad sleep angry
  const FACE = { neutral:0, happy:1, yum:2, hungry:3, stressed:4, tired:5, sad:6, sleep:7, angry:8 };

  const MOOD = {
    idle:      { face: 'neutral',  anim: 'idle'  },
    happy:     { face: 'happy',    anim: 'cheer' },
    hungry:    { face: 'hungry',   anim: 'shake' },
    starving:  { face: 'sad',      anim: 'shakeHard' },
    tired:     { face: 'tired',    anim: 'sway'  },
    exhausted: { face: 'sleep',    anim: 'sway'  },
    stressed:  { face: 'stressed', anim: 'jitter' },
  };

  const FACE_KEYS = ['face_0','face_1','face_2','face_3','face_4','face_5','face_6','face_7','face_8'];

  class AvatarModule {
    constructor() {
      this.img   = {};
      this.ready = false;
      this.canvas = null;
      this.ctx    = null;
      this._raf   = null;
      this.faceIdx   = 0;
      this.anim      = 'idle';
      this.animStart = 0;
      this.onceCb    = null;
      this._bodyCanvas = null;
      this._bodyCtx    = null;

      // Current loadout
      this._gender = 'm';
      this._outfit = null;   // e.g. 'm_school' → loads top_m_school + bottom_m_school
      this._hair   = null;   // e.g. 'm_short'  → loads hair_m_short
    }

    // ── Image loading ────────────────────────────────────────────────────────
    _loadoutKeys() {
      const keys = [`base_${this._gender}`, ...FACE_KEYS];
      if (this._outfit) keys.push(`top_${this._outfit}`, `bottom_${this._outfit}`);
      if (this._hair)   keys.push(`hair_${this._hair}`);
      return keys;
    }

    _loadImages(keys) {
      return new Promise((resolve) => {
        const needed = keys.filter(k => !this.img[k] || !this.img[k].src);
        if (!needed.length) { resolve(); return; }
        let pending = needed.length;
        const done = () => { if (--pending === 0) resolve(); };
        needed.forEach((k) => {
          const im = new Image();
          im.onload = done;
          im.onerror = done;
          im.src = BASE_PATH + k + '.png';
          this.img[k] = im;
        });
      });
    }

    // ── Public API ────────────────────────────────────────────────────────────
    init(gender, outfit, hair) {
      this._gender = gender || 'm';
      this._outfit = outfit || null;
      this._hair   = hair   || null;
      if (this._initPromise) return this._initPromise;
      this._initPromise = this._loadImages(this._loadoutKeys()).then(() => {
        this.ready = true;
        this._buildBodyLayer();
      });
      return this._initPromise;
    }

    setLoadout(gender, outfit, hair) {
      const g = gender || 'm';
      const o = outfit || null;
      const h = hair   || null;
      if (g === this._gender && o === this._outfit && h === this._hair) return;
      this._gender = g;
      this._outfit = o;
      this._hair   = h;
      this._loadImages(this._loadoutKeys()).then(() => {
        if (this.ready) this._buildBodyLayer();
      });
    }

    mount(canvas) {
      if (!canvas) return;
      this.canvas = canvas;
      this.canvas.width  = TW * SCALE;
      this.canvas.height = TH * SCALE;
      this.ctx = canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;
      this.init(this._gender, this._outfit, this._hair);
      if (!this._raf) this._loop(performance.now());
    }

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

    snapshot(type) {
      return this.canvas ? this.canvas.toDataURL(type === 'webp' ? 'image/webp' : 'image/png') : null;
    }

    destroy() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null; this.canvas = null; this.ctx = null;
    }

    // ── Body compositing ─────────────────────────────────────────────────────
    // Pre-composites base → erase where clothing → draw clothing.
    // Prevents double-outline at garment boundaries.
    _buildBodyLayer() {
      const W = TW * SCALE, H = TH * SCALE;
      if (!this._bodyCanvas) {
        this._bodyCanvas = document.createElement('canvas');
        this._bodyCanvas.width  = W;
        this._bodyCanvas.height = H;
        this._bodyCtx = this._bodyCanvas.getContext('2d');
        this._bodyCtx.imageSmoothingEnabled = false;
      }
      const bct = this._bodyCtx;
      bct.clearRect(0, 0, W, H);

      const draw = (k) => {
        const im = this.img[k];
        if (im && im.width) bct.drawImage(im, 0, 0, W, H);
      };

      const baseKey   = `base_${this._gender}`;
      const topKey    = this._outfit ? `top_${this._outfit}`    : null;
      const bottomKey = this._outfit ? `bottom_${this._outfit}` : null;
      const hairKey   = this._hair   ? `hair_${this._hair}`     : null;

      // 1. Full base
      draw(baseKey);

      // 2. Erase base pixels under clothing
      bct.globalCompositeOperation = 'destination-out';
      if (bottomKey) draw(bottomKey);
      if (topKey)    draw(topKey);
      if (hairKey)   draw(hairKey);

      // 3. Draw clothing on top
      bct.globalCompositeOperation = 'source-over';
      if (bottomKey) draw(bottomKey);
      if (topKey)    draw(topKey);
      if (hairKey)   draw(hairKey);
    }

    // ── Animation ─────────────────────────────────────────────────────────────
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

      const W = this.canvas.width, H = this.canvas.height;
      ctx.clearRect(0, 0, W, H);

      const m = this._motion(t);
      if (m.done && this.onceCb) { const cb = this.onceCb; this.onceCb = null; cb(); }

      const dx = (m.dx || 0) * SCALE;
      const dy = (m.dy || 0) * SCALE;
      const rot = (m.rot || 0) * Math.PI / 180;
      const sy = m.sy || 1;

      // Procedural shadow ellipse at feet
      const lift = Math.max(0, -(m.dy || 0));
      const shW = W * 0.55 * (1 - lift * 0.04);
      const shH = H * 0.04;
      ctx.save();
      ctx.globalAlpha = 0.25 - lift * 0.01;
      ctx.beginPath();
      ctx.ellipse(W / 2, H * 0.97, shW / 2, shH / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.restore();

      // Character (pivot at feet)
      ctx.save();
      ctx.translate(W / 2 + dx, H * 0.94);
      ctx.rotate(rot);
      ctx.scale(1, sy);
      ctx.translate(-W / 2, -H * 0.94 + dy);

      // Pre-composited body
      if (this._bodyCanvas) ctx.drawImage(this._bodyCanvas, 0, 0, W, H);

      // Face overlay — destination-out erases body head area so the face
      // circle replaces it cleanly (no double-outline with base sprite).
      const f = this.img[`face_${this.faceIdx}`];
      if (f && f.width) {
        const fx = Math.round((TW / 2 - f.width / 2) * SCALE);
        const fy = 6 * SCALE;
        const fw = f.width  * SCALE;
        const fh = f.height * SCALE;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(f, fx, fy, fw, fh);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(f, fx, fy, fw, fh);
      }

      ctx.restore();
    }
  }

  window.avatarModule = new AvatarModule();
})();
