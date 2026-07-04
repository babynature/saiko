// modules/notificationModule.js — Web Notification Reminders
// Schedules in-browser notifications via setTimeout (tab must be open)

const NOTIF_STORAGE_KEY = 'shg-notifications';

const REMINDER_DEFAULTS = {
  breakfast: { on: false, time: '08:00', title: '🌅 มื้อเช้า',        body: 'อย่าลืมบันทึกมื้อเช้าวันนี้!' },
  lunch:     { on: true,  time: '12:00', title: '☀️ มื้อกลางวัน',    body: 'ถึงเวลาบันทึกมื้อกลางวันแล้ว!' },
  dinner:    { on: false, time: '18:00', title: '🌙 มื้อเย็น',        body: 'บันทึกมื้อเย็นซะนะ!' },
  exercise:  { on: false, time: '17:30', title: '🏃 ออกกำลังกาย',    body: 'วันนี้ออกกำลังกายยัง? เป้าหมายรอคุณอยู่!' },
  water:     { on: false, interval: 90,  title: '💧 ดื่มน้ำ',         body: 'ดื่มน้ำหน่อยนะ! เป้าหมาย 8 แก้วต่อวัน' },
  sleep:     { on: true,  time: '22:00', title: '😴 เวลานอน',         body: 'ถึงเวลานอนแล้ว อย่าลืมบันทึกการนอน!' },
  weight:    { on: false, time: '08:00', title: '⚖️ ชั่งน้ำหนัก',   body: 'วันนี้ชั่งน้ำหนักยังครับ?' },
};

class NotificationModule {
  constructor() {
    this._timers = [];
    this.settings = this._loadSettings();
  }

  // ── Permission ──────────────────────────────────────────────────

  isSupported() { return 'Notification' in window; }

  getPermission() {
    return this.isSupported() ? Notification.permission : 'unsupported';
  }

  async requestPermission() {
    if (!this.isSupported()) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    const result = await Notification.requestPermission();
    return result;
  }

  // ── Settings persistence ─────────────────────────────────────────

  _loadSettings() {
    try {
      const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (!raw) return this._defaultSettings();
      const saved = JSON.parse(raw);
      // Merge with defaults so new keys appear
      const s = this._defaultSettings();
      s.enabled = saved.enabled !== undefined ? saved.enabled : s.enabled;
      Object.keys(s.reminders).forEach(k => {
        if (saved.reminders && saved.reminders[k]) {
          Object.assign(s.reminders[k], saved.reminders[k]);
        }
      });
      return s;
    } catch { return this._defaultSettings(); }
  }

  _defaultSettings() {
    const reminders = {};
    Object.entries(REMINDER_DEFAULTS).forEach(([k, v]) => { reminders[k] = { ...v }; });
    return { enabled: false, reminders };
  }

  save() {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(this.settings));
  }

  setEnabled(bool) {
    this.settings.enabled = bool;
    this.save();
    if (bool) this.scheduleAll(); else this.cancelAll();
  }

  setReminder(key, patch) {
    if (!this.settings.reminders[key]) return;
    Object.assign(this.settings.reminders[key], patch);
    this.save();
    this.cancelAll();
    if (this.settings.enabled) this.scheduleAll();
  }

  // ── Scheduling ───────────────────────────────────────────────────

  // Smart checks: skip notification if user already logged that day
  _mealLogged(mealKey) {
    try {
      const log = window.hungerModule?.getTodayFoodLog() || [];
      return log.some(e => e.mealType === mealKey);
    } catch { return false; }
  }

  _exercisedToday() {
    try { return (window.hungerModule?.caloriesBurned || 0) > 0; } catch { return false; }
  }

  scheduleAll() {
    this.cancelAll();
    if (!this.isSupported() || Notification.permission !== 'granted') return;
    if (!this.settings.enabled) return;

    const r = this.settings.reminders;
    ['breakfast', 'lunch', 'dinner', 'exercise', 'sleep', 'weight'].forEach(key => {
      const rem = r[key];
      if (!rem.on) return;
      const ms = this._msUntilTime(rem.time);
      const id = setTimeout(() => {
        // Smart skip: don't notify if already done
        const skip =
          (key === 'breakfast' && this._mealLogged('breakfast')) ||
          (key === 'lunch'     && this._mealLogged('lunch'))     ||
          (key === 'dinner'    && this._mealLogged('dinner'))    ||
          (key === 'exercise'  && this._exercisedToday());
        if (!skip) this._send(rem.title, rem.body);
        // Reschedule for tomorrow
        const nextId = setTimeout(() => this.scheduleAll(), 60000);
        this._timers.push(nextId);
      }, ms);
      this._timers.push(id);
    });

    // Water: interval-based
    if (r.water.on) {
      const intervalMs = (r.water.interval || 120) * 60000;
      const id = setInterval(() => {
        const h = new Date().getHours();
        if (h >= 8 && h <= 21) this._send(r.water.title, r.water.body);
      }, intervalMs);
      this._timers.push(id);
    }
  }

  cancelAll() {
    this._timers.forEach(id => { clearTimeout(id); clearInterval(id); });
    this._timers = [];
  }

  // Send immediately (for testing)
  sendTest(key) {
    const rem = this.settings.reminders[key];
    if (rem) this._send(rem.title, rem.body + ' (ทดสอบ)');
  }

  _send(title, body) {
    if (!this.isSupported() || Notification.permission !== 'granted') return;
    try {
      const n = new Notification(title, {
        body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-96.png',
        tag: 'shg-reminder',
        renotify: true,
      });
      n.onclick = () => { window.focus(); n.close(); };
    } catch (e) {
      console.warn('Notification failed:', e);
    }
  }

  _msUntilTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const now  = new Date();
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    return target - now;
  }

  // Human-readable countdown for UI
  getNextFireLabel(key) {
    const rem = this.settings.reminders[key];
    if (!rem || !rem.on) return '';
    if (rem.interval) return `ทุก ${rem.interval} นาที`;
    const ms = this._msUntilTime(rem.time);
    const totalMin = Math.round(ms / 60000);
    if (totalMin < 60)  return `อีก ${totalMin} นาที`;
    const hrs = Math.floor(totalMin / 60);
    const min = totalMin % 60;
    return min ? `อีก ${hrs}ชม. ${min}นาที` : `อีก ${hrs} ชม.`;
  }
}

window.notificationModule = new NotificationModule();
