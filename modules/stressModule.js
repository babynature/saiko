// modules/stressModule.js — Stress management & student life events

const LIFE_EVENTS = [
  {
    id: 'exam_week',
    icon: '📚',
    name_th: 'สัปดาห์สอบ',
    name_en: 'Exam Week',
    desc_th: 'เครียด +30 • Quest XP ×1.3 • 7 วัน',
    desc_en: 'Stress +30 • Quest XP ×1.3 • 7 days',
    stress_change: +30,
    duration_days: 7,
    xp_bonus_type: 'quest',
    xp_bonus: 1.3,
    color: '#f59e0b',
  },
  {
    id: 'sports_day',
    icon: '🏅',
    name_th: 'วันกีฬาสี',
    name_en: 'Sports Day',
    desc_th: 'เครียด -20 • ออกกำลัง XP ×2 • 1 วัน',
    desc_en: 'Stress -20 • Exercise XP ×2 • 1 day',
    stress_change: -20,
    duration_days: 1,
    xp_bonus_type: 'exercise',
    xp_bonus: 2.0,
    color: '#22c55e',
  },
  {
    id: 'holiday',
    icon: '🏖️',
    name_th: 'วันหยุด',
    name_en: 'Holiday',
    desc_th: 'เครียด -15 • XP ทั้งหมด ×1.1 • 3 วัน',
    desc_en: 'Stress -15 • All XP ×1.1 • 3 days',
    stress_change: -15,
    duration_days: 3,
    xp_bonus_type: 'all',
    xp_bonus: 1.1,
    color: '#3b82f6',
  },
  {
    id: 'project_due',
    icon: '📝',
    name_th: 'ส่งโปรเจคใหญ่',
    name_en: 'Project Deadline',
    desc_th: 'เครียด +20 • ออกกำลังลดเครียดพิเศษ • 3 วัน',
    desc_en: 'Stress +20 • Exercise reduces stress more • 3 days',
    stress_change: +20,
    duration_days: 3,
    xp_bonus_type: null,
    xp_bonus: 1.0,
    color: '#ef4444',
  },
];

class StressModule {
  constructor() {
    this.stress = 20;       // 0=calm, 100=burnout
    this.activeEvents = []; // [{ eventId, startDate, endsDate }]
  }

  _dateKey() { return new Date().toISOString().slice(0, 10); }

  addStress(amount) {
    this.stress = Math.min(100, Math.max(0, this.stress + amount));
  }

  reduceStress(amount) {
    this.stress = Math.max(0, this.stress - amount);
  }

  triggerEvent(eventId) {
    const ev = LIFE_EVENTS.find(e => e.id === eventId);
    if (!ev) return null;
    // Replace existing same event
    this.activeEvents = this.activeEvents.filter(a => a.eventId !== eventId);
    const today = this._dateKey();
    const ends = new Date(Date.now() + ev.duration_days * 86400000).toISOString().slice(0, 10);
    this.activeEvents.push({ eventId, startDate: today, endsDate: ends });
    this.addStress(ev.stress_change);
    return ev;
  }

  checkEventExpiry() {
    const today = this._dateKey();
    this.activeEvents = this.activeEvents.filter(a => a.endsDate >= today);
  }

  getActiveEvents() {
    this.checkEventExpiry();
    return this.activeEvents
      .map(a => LIFE_EVENTS.find(e => e.id === a.eventId))
      .filter(Boolean);
  }

  // type: 'quest' | 'exercise' | 'all' | 'sleep' | 'food'
  getXPBonus(type) {
    this.checkEventExpiry();
    let bonus = 1.0;
    for (const a of this.activeEvents) {
      const ev = LIFE_EVENTS.find(e => e.id === a.eventId);
      if (!ev) continue;
      if (ev.xp_bonus_type === 'all' || ev.xp_bonus_type === type) {
        bonus *= ev.xp_bonus;
      }
    }
    return bonus;
  }

  getStatMultiplier() {
    if (this.stress >= 80) return 0.6;
    if (this.stress >= 60) return 0.75;
    if (this.stress >= 30) return 0.9;
    return 1.0;
  }

  // Extra hunger drain per minute due to stress
  getHungerDrainBonus() {
    if (this.stress >= 80) return 0.15;
    if (this.stress >= 60) return 0.10;
    if (this.stress >= 30) return 0.05;
    return 0;
  }

  getStatusKey() {
    if (this.stress >= 80) return 'stress_burnout';
    if (this.stress >= 60) return 'stress_high';
    if (this.stress >= 30) return 'stress_mid';
    return 'stress_calm';
  }

  toJSON() {
    return { stress: this.stress, activeEvents: this.activeEvents };
  }

  fromJSON(d) {
    this.stress       = d.stress       ?? 20;
    this.activeEvents = d.activeEvents || [];
    this.checkEventExpiry();
  }
}

window.stressModule  = new StressModule();
window.LIFE_EVENTS   = LIFE_EVENTS;
