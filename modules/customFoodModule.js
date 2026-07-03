// modules/customFoodModule.js — User-defined food database

const CUSTOM_FOOD_KEY = 'shg-custom-foods';

class CustomFoodModule {
  constructor() {
    this._foods = [];
    this._load();
  }

  // ── Persistence ───────────────────────────────────────────
  _load() {
    try {
      const raw = localStorage.getItem(CUSTOM_FOOD_KEY);
      this._foods = raw ? JSON.parse(raw) : [];
    } catch { this._foods = []; }
  }

  _save() {
    localStorage.setItem(CUSTOM_FOOD_KEY, JSON.stringify(this._foods));
  }

  // ── CRUD ─────────────────────────────────────────────────
  getAll() { return this._foods; }

  add(name, kcal, protein, carbs, fat, emoji, portion) {
    const entry = {
      id:      'cf_' + Date.now(),
      name:    String(name).trim().slice(0, 40),
      kcal:    Math.round(Math.max(1, kcal)),
      protein: Math.round(protein || 0),
      carbs:   Math.round(carbs   || 0),
      fat:     Math.round(fat     || 0),
      emoji:   emoji   || '⭐',
      portion: portion || '',
      category:'custom',
      custom:  true,
    };
    this._foods.unshift(entry);
    this._save();
    this._injectToFoodDB();
    return entry;
  }

  remove(id) {
    this._foods = this._foods.filter(f => f.id !== id);
    this._save();
    this._injectToFoodDB();
  }

  // Prepend custom entries to the global FOOD_DB so they appear first in search
  _injectToFoodDB() {
    if (!window.FOOD_DB) return;
    window.FOOD_DB = window.FOOD_DB.filter(f => !f.custom);
    this._foods.forEach(f => window.FOOD_DB.push(f));
  }

  // ── Modal ─────────────────────────────────────────────────
  openModal() {
    if (!document.getElementById('cf-style')) {
      const st = document.createElement('style');
      st.id = 'cf-style';
      st.textContent = `
        #cf-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.82);
          z-index:700; align-items:flex-start; justify-content:center; padding:16px; overflow-y:auto; }
        #cf-overlay.open { display:flex; }
        .cf-inner { background:#1e1e3a; border-radius:16px; padding:18px; max-width:440px;
          width:100%; margin:auto; }
        .cf-inner h3 { color:#f0f0ff; text-align:center; margin-bottom:14px; font-size:16px; }
        .cf-form { display:grid; gap:10px; margin-bottom:14px; }
        .cf-row { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .cf-field label { font-size:12px; color:#9090c0; margin-bottom:3px; display:block; }
        .cf-field input { width:100%; background:#252547; border:1px solid rgba(255,255,255,0.1);
          border-radius:8px; padding:8px 10px; color:#f0f0ff; font-size:14px; }
        .cf-field input:focus { outline:none; border-color:#6c63ff; }
        .cf-actions { display:flex; gap:8px; }
        .cf-btn-add { flex:1; background:#6c63ff; color:#fff; border:none; border-radius:10px;
          padding:11px; font-weight:700; font-size:14px; cursor:pointer; }
        .cf-btn-close { background:#252547; color:#a0a0c0; border:none; border-radius:10px;
          padding:11px 16px; font-size:14px; cursor:pointer; }
        .cf-divider { border:none; border-top:1px solid rgba(255,255,255,0.07); margin:14px 0; }
        .cf-list-title { color:#7070a0; font-size:12px; margin-bottom:8px; }
        .cf-list { display:flex; flex-direction:column; gap:6px; max-height:240px; overflow-y:auto; }
        .cf-item { display:flex; align-items:center; gap:8px; background:#252547;
          border-radius:10px; padding:8px 10px; }
        .cf-item-emoji { font-size:22px; flex-shrink:0; }
        .cf-item-info { flex:1; min-width:0; }
        .cf-item-name  { font-size:14px; color:#f0f0ff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .cf-item-meta  { font-size:11px; color:#7070a0; }
        .cf-item-del { background:none; border:none; color:#6060a0; font-size:16px;
          cursor:pointer; padding:4px 8px; border-radius:6px; flex-shrink:0; }
        .cf-item-del:hover { color:#f87171; background:rgba(248,113,113,0.1); }
        .cf-empty { color:#5050a0; font-size:13px; text-align:center; padding:12px 0; }
      `;
      document.head.appendChild(st);
    }

    let overlay = document.getElementById('cf-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'cf-overlay';
      overlay.innerHTML = `
        <div class="cf-inner">
          <h3>➕ เพิ่มอาหารของฉัน</h3>
          <div class="cf-form">
            <div class="cf-field">
              <label>ชื่ออาหาร *</label>
              <input type="text" id="cf-name" placeholder="เช่น ข้าวมันไก่บ้าน" maxlength="40">
            </div>
            <div class="cf-row">
              <div class="cf-field">
                <label>แคลอรี่ (kcal) *</label>
                <input type="number" id="cf-kcal" placeholder="400" min="1" max="5000">
              </div>
              <div class="cf-field">
                <label>อีโมจิ</label>
                <input type="text" id="cf-emoji" placeholder="🍽️" maxlength="2" value="⭐">
              </div>
            </div>
            <div class="cf-field">
              <label>ปริมาณ / หน่วย (ไม่บังคับ)</label>
              <input type="text" id="cf-portion" placeholder="เช่น 1 จาน (200g)" maxlength="30">
            </div>
            <div class="cf-row">
              <div class="cf-field">
                <label>โปรตีน (g)</label>
                <input type="number" id="cf-protein" placeholder="0" min="0" max="500">
              </div>
              <div class="cf-field">
                <label>คาร์บ (g)</label>
                <input type="number" id="cf-carbs" placeholder="0" min="0" max="500">
              </div>
            </div>
            <div class="cf-field" style="max-width:50%">
              <label>ไขมัน (g)</label>
              <input type="number" id="cf-fat" placeholder="0" min="0" max="300">
            </div>
          </div>
          <div class="cf-actions">
            <button class="cf-btn-add" onclick="customFoodModule._submitAdd()">✅ เพิ่มอาหาร</button>
            <button class="cf-btn-close" onclick="customFoodModule.closeModal()">✕</button>
          </div>
          <hr class="cf-divider">
          <div class="cf-list-title">อาหารที่บันทึกไว้</div>
          <div class="cf-list" id="cf-list"></div>
        </div>`;
      overlay.addEventListener('click', e => { if (e.target === overlay) customFoodModule.closeModal(); });
      document.body.appendChild(overlay);
    }

    this._refreshList();
    overlay.classList.add('open');
  }

  _submitAdd() {
    const get = id => (document.getElementById(id)?.value || '').trim();
    const name    = get('cf-name');
    const kcal    = parseFloat(get('cf-kcal'));
    const emoji   = get('cf-emoji') || '⭐';
    const portion = get('cf-portion');
    const protein = parseFloat(get('cf-protein')) || 0;
    const carbs   = parseFloat(get('cf-carbs'))   || 0;
    const fat     = parseFloat(get('cf-fat'))     || 0;

    if (!name) { window.showToast?.('⚠️ ใส่ชื่ออาหาร', 'error'); return; }
    if (!kcal || kcal < 1) { window.showToast?.('⚠️ ใส่แคลอรี่', 'error'); return; }

    this.add(name, kcal, protein, carbs, fat, emoji, portion);

    // Clear form
    ['cf-name','cf-kcal','cf-emoji','cf-portion','cf-protein','cf-carbs','cf-fat'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = id === 'cf-emoji' ? '⭐' : '';
    });

    window.showToast?.(`${emoji} เพิ่ม "${name}" แล้ว!`, 'success');
    this._refreshList();
  }

  _refreshList() {
    const list = document.getElementById('cf-list');
    if (!list) return;
    const foods = this.getAll();
    if (!foods.length) {
      list.innerHTML = '<div class="cf-empty">ยังไม่มีอาหารของคุณ — เพิ่มด้านบนเลย</div>';
      return;
    }
    list.innerHTML = foods.map(f => `
      <div class="cf-item">
        <span class="cf-item-emoji">${f.emoji}</span>
        <div class="cf-item-info">
          <div class="cf-item-name">${_escHtml ? _escHtml(f.name) : f.name}</div>
          <div class="cf-item-meta">${f.kcal} kcal${f.portion ? ' · ' + f.portion : ''}${f.protein ? ' · P' + f.protein + 'g' : ''}</div>
        </div>
        <button class="cf-item-del" onclick="customFoodModule.remove('${f.id}');customFoodModule._refreshList()" title="ลบ">✕</button>
      </div>
    `).join('');
  }

  closeModal() {
    document.getElementById('cf-overlay')?.classList.remove('open');
  }
}

window.customFoodModule = new CustomFoodModule();

// Inject after FOOD_DB is ready (runs after all scripts load)
document.addEventListener('DOMContentLoaded', () => {
  customFoodModule._injectToFoodDB();
});
