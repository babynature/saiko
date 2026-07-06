// modules/shareModule.js — Visual Health Card (Canvas PNG)

class ShareModule {
  constructor() { this._canvas = null; }

  // ── Rounded-rect helper (compat) ──────────────────────────
  _rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  _fillRR(ctx, x, y, w, h, r, fill) {
    ctx.fillStyle = fill;
    this._rr(ctx, x, y, w, h, r);
    ctx.fill();
  }

  // ── Draw the card ─────────────────────────────────────────
  draw() {
    const C = document.createElement('canvas');
    C.width  = 400;
    C.height = 610;
    const ctx = C.getContext('2d');

    // Pull data
    const ch    = window.characterModule;
    const name  = ch.get('name') || 'Player';
    const level = ch.get('level');
    const bmi   = ch.get('bmi');
    const bmiLabel = window.bmiModule.getCategoryLabel(bmi);
    const bmiColor = window.bmiModule.getCategoryColor(bmi);
    const streak   = window.streakModule?.currentStreak || 0;
    const kcal     = window.hungerModule?.caloriesEaten || 0;
    const kcalGoal = ch.get('dailyCalorie') || 2000;
    const water    = window.waterModule?.getGlasses() || 0;
    const waterGoal= window.waterModule?.getGoalGlasses() || 8;
    const exMin    = window.hungerModule?.exerciseMinutes || 0;
    const achCount = window.achievementModule?.getCount() || 0;
    const date = new Date().toLocaleDateString('th-TH', { day:'numeric', month:'long', year:'numeric' });

    // ── Background ──
    const bg = ctx.createLinearGradient(0, 0, 0, C.height);
    bg.addColorStop(0, '#1a1a2e');
    bg.addColorStop(1, '#0d0d1e');
    this._fillRR(ctx, 0, 0, C.width, C.height, 20, bg);

    // Top accent bar
    const accent = ctx.createLinearGradient(0, 0, C.width, 0);
    accent.addColorStop(0, '#6c63ff');
    accent.addColorStop(1, '#a78bfa');
    ctx.fillStyle = accent;
    this._rr(ctx, 0, 0, C.width, 6, 3);
    ctx.fill();

    // Brand
    ctx.fillStyle = '#7c7aa0';
    ctx.font = '13px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SHINKA HEALTH GAME', 200, 34);

    // Name
    ctx.fillStyle = '#f0f0ff';
    ctx.font = `bold 30px Arial, sans-serif`;
    ctx.fillText(name, 200, 76);

    // Level badge
    this._fillRR(ctx, 155, 85, 90, 26, 13, 'rgba(108,99,255,0.25)');
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText(`⭐  Lv.${level}`, 200, 103);

    // Streak
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`🔥 ${streak} วัน Streak`, 200, 136);

    // ── BMI Card ──
    this._fillRR(ctx, 20, 152, 360, 76, 14, 'rgba(255,255,255,0.05)');
    ctx.strokeStyle = bmiColor + '55';
    ctx.lineWidth   = 1.5;
    this._rr(ctx, 20, 152, 360, 76, 14);
    ctx.stroke();

    ctx.fillStyle = bmiColor;
    ctx.font = 'bold 34px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(bmi.toFixed(1), 200, 198);

    ctx.fillStyle = '#b0b0d0';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText(`BMI — ${bmiLabel}`, 200, 218);

    // ── Stat Cards (3 cols) ──
    const statY = 248;
    const statW = 108, statH = 104, statGap = 10;
    const statsData = [
      { icon: '🍽', label: 'แคลอรี่', val: kcal,  max: kcalGoal,  unit: 'kcal', color: '#22c55e' },
      { icon: '💧', label: 'น้ำ',     val: water, max: waterGoal, unit: 'แก้ว',  color: '#38bdf8' },
      { icon: '🏃', label: 'ออกกำลัง',val: exMin, max: 30,        unit: 'นาที', color: '#c084fc' },
    ];

    statsData.forEach((s, i) => {
      const sx = 20 + i * (statW + statGap);
      this._fillRR(ctx, sx, statY, statW, statH, 12, 'rgba(255,255,255,0.04)');

      // Circular-ish progress fill bar at bottom
      const pct = Math.min(1, s.val / (s.max || 1));
      this._fillRR(ctx, sx + 8, statY + statH - 14, statW - 16, 8, 4, '#252545');
      this._fillRR(ctx, sx + 8, statY + statH - 14, Math.max(6, (statW - 16) * pct), 8, 4, s.color);

      // Icon
      ctx.font = '24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.icon, sx + statW / 2, statY + 34);

      // Value
      ctx.fillStyle = s.color;
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillText(String(s.val), sx + statW / 2, statY + 62);

      // Unit / label
      ctx.fillStyle = '#7070a0';
      ctx.font = '11px Arial, sans-serif';
      ctx.fillText(`/${s.max} ${s.unit}`, sx + statW / 2, statY + 78);
      ctx.fillStyle = '#a0a0c0';
      ctx.fillText(s.label, sx + statW / 2, statY + 93);
    });

    // ── Achievement bar ──
    const achY = statY + statH + 16;
    this._fillRR(ctx, 20, achY, 360, 54, 12, 'rgba(255,255,255,0.04)');
    ctx.fillStyle = '#f0f0ff';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🏆 ความสำเร็จ  ${achCount}/21`, 200, achY + 22);

    // Achievement mini-bar
    const achPct = achCount / 21;
    this._fillRR(ctx, 40, achY + 32, 320, 8, 4, '#252545');
    this._fillRR(ctx, 40, achY + 32, Math.max(8, 320 * achPct), 8, 4, '#fbbf24');

    // ── Kcal summary row ──
    const sumY = achY + 76;
    this._fillRR(ctx, 20, sumY, 360, 48, 12, 'rgba(108,99,255,0.12)');
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    const remain = kcalGoal - kcal;
    const remainLabel = remain >= 0
      ? `เหลืออีก ${remain.toLocaleString()} kcal`
      : `เกินเป้า ${Math.abs(remain).toLocaleString()} kcal`;
    const remainColor = remain >= 0 ? '#22c55e' : '#f87171';
    ctx.fillStyle = '#9090c0';
    ctx.fillText(`🔥 ${kcal.toLocaleString()} / ${kcalGoal.toLocaleString()} kcal วันนี้`, 200, sumY + 20);
    ctx.fillStyle = remainColor;
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText(remainLabel, 200, sumY + 38);

    // ── Footer ──
    ctx.fillStyle = '#505080';
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText(date, 200, sumY + 72);

    ctx.fillStyle = '#6c63ff';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillText('#ShinkaHealthGame 🎮', 200, sumY + 94);

    // Card border
    ctx.strokeStyle = 'rgba(108,99,255,0.25)';
    ctx.lineWidth   = 1.5;
    this._rr(ctx, 1, 1, C.width - 2, C.height - 2, 20);
    ctx.stroke();

    this._canvas = C;
    return C;
  }

  // ── Modal ─────────────────────────────────────────────────
  openModal() {
    if (!document.getElementById('share-modal-style')) {
      const st = document.createElement('style');
      st.id = 'share-modal-style';
      st.textContent = `
        #share-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.82); z-index:700;
          align-items:center; justify-content:center; padding:16px; }
        #share-overlay.open { display:flex; }
        .sh-inner { background:#1e1e3a; border-radius:16px; padding:18px; max-width:430px;
          width:100%; text-align:center; }
        .sh-inner h3 { color:#f0f0ff; margin-bottom:14px; font-size:16px; }
        #sh-preview canvas { border-radius:12px; max-width:100%; box-shadow:0 4px 20px rgba(0,0,0,0.5); }
        .sh-btns { display:flex; gap:10px; margin-top:14px; justify-content:center; flex-wrap:wrap; }
        .sh-btn { padding:10px 18px; border-radius:10px; border:none; cursor:pointer;
          font-weight:700; font-size:14px; }
        .sh-btn-dl  { background:#6c63ff; color:#fff; }
        .sh-btn-sh  { background:#22c55e; color:#fff; }
        .sh-btn-cl  { background:#252547; color:#a0a0c0; }
      `;
      document.head.appendChild(st);
    }

    if (!document.getElementById('share-overlay')) {
      const div = document.createElement('div');
      div.id = 'share-overlay';
      div.innerHTML = `
        <div class="sh-inner">
          <h3>📸 Health Card — แชร์ผลลัพธ์</h3>
          <div id="sh-preview"></div>
          <div class="sh-btns">
            <button class="sh-btn sh-btn-dl" onclick="shareModule.download()">⬇️ บันทึกรูป</button>
            ${navigator.share ? '<button class="sh-btn sh-btn-sh" onclick="shareModule.share()">📤 แชร์เลย</button>' : ''}
            <button class="sh-btn sh-btn-cl" onclick="shareModule.close()">✕ ปิด</button>
          </div>
        </div>`;
      div.addEventListener('click', e => { if (e.target === div) shareModule.close(); });
      document.body.appendChild(div);
    }

    const preview = document.getElementById('sh-preview');
    preview.innerHTML = '';
    const canvas = this.draw();
    preview.appendChild(canvas);
    document.getElementById('share-overlay').classList.add('open');
  }

  close() {
    document.getElementById('share-overlay')?.classList.remove('open');
  }

  download() {
    if (!this._canvas) return;
    const name = (window.characterModule?.get('name') || 'player').replace(/\W/g, '_');
    const date = window._localDate();
    const a    = document.createElement('a');
    a.download  = `shinka-${name}-${date}.png`;
    a.href      = this._canvas.toDataURL('image/png');
    a.click();
  }

  async share() {
    if (!this._canvas || !navigator.share) return;
    this._canvas.toBlob(async blob => {
      try {
        const file = new File([blob], 'shinka-health.png', { type: 'image/png' });
        await navigator.share({
          files:  [file],
          title:  'Shinka Health Game',
          text:   '#ShinkaHealthGame 🎮',
        });
      } catch {}
    }, 'image/png');
  }
}

window.shareModule = new ShareModule();
