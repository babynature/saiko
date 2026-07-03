// modules/missionModule.js — Daily Mission Board (Phase 8)
// 3 missions rotate daily by date hash from a pool of 15

const MISSION_POOL = [
  { id: 'water_8',      title_th: 'ดื่มน้ำ 8 แก้ว',          title_en: 'Drink 8 glasses',      emoji: '💧', type: 'water_count',   target: 8,   xp: 100, diff: 'easy'   },
  { id: 'water_10',     title_th: 'ดื่มน้ำ 10 แก้ว',         title_en: 'Drink 10 glasses',     emoji: '🚰', type: 'water_count',   target: 10,  xp: 180, diff: 'medium' },
  { id: 'exercise_30',  title_th: 'ออกกำลัง 30 นาที',        title_en: 'Exercise 30 min',      emoji: '🏃', type: 'exercise_min',  target: 30,  xp: 200, diff: 'medium' },
  { id: 'exercise_60',  title_th: 'ออกกำลัง 60 นาที',        title_en: 'Exercise 60 min',      emoji: '💪', type: 'exercise_min',  target: 60,  xp: 350, diff: 'hard'   },
  { id: 'burn_200',     title_th: 'เผาผลาญ 200 kcal',        title_en: 'Burn 200 kcal',        emoji: '🔥', type: 'exercise_burn', target: 200, xp: 175, diff: 'medium' },
  { id: 'burn_400',     title_th: 'เผาผลาญ 400 kcal',        title_en: 'Burn 400 kcal',        emoji: '⚡', type: 'exercise_burn', target: 400, xp: 300, diff: 'hard'   },
  { id: 'meal_3',       title_th: 'บันทึกอาหาร 3 มื้อ',      title_en: 'Log 3 meals',          emoji: '🍽️', type: 'meal_count',    target: 3,   xp: 120, diff: 'easy'   },
  { id: 'meal_5',       title_th: 'บันทึกอาหาร 5 รายการ',    title_en: 'Log 5 food items',     emoji: '📋', type: 'meal_count',    target: 5,   xp: 200, diff: 'medium' },
  { id: 'quest_3',      title_th: 'ทำภารกิจเสร็จ 3 ข้อ',    title_en: 'Complete 3 quests',    emoji: '📌', type: 'quest_done',    target: 3,   xp: 250, diff: 'medium' },
  { id: 'sleep_7',      title_th: 'นอนหลับ 7 ชั่วโมง',       title_en: 'Sleep 7 hours',        emoji: '😴', type: 'sleep_hours',   target: 7,   xp: 150, diff: 'easy'   },
  { id: 'sleep_8',      title_th: 'นอนหลับ 8 ชั่วโมง',       title_en: 'Sleep 8 hours',        emoji: '🌙', type: 'sleep_hours',   target: 8,   xp: 200, diff: 'medium' },
  { id: 'calorie_goal', title_th: 'อยู่ในเป้าแคลอรี่วันนี้', title_en: 'Hit calorie goal',     emoji: '🎯', type: 'calorie_goal',  target: 1,   xp: 200, diff: 'medium' },
  { id: 'low_stress',   title_th: 'ความเครียดต่ำกว่า 50',     title_en: 'Keep stress below 50', emoji: '😌', type: 'low_stress',    target: 1,   xp: 150, diff: 'easy'   },
  { id: 'log_weight',   title_th: 'บันทึกน้ำหนักวันนี้',     title_en: 'Log your weight',      emoji: '⚖️', type: 'log_weight',    target: 1,   xp: 120, diff: 'easy'   },
  { id: 'walk_30',      title_th: 'เดิน 30 นาที',             title_en: 'Walk 30 minutes',      emoji: '🚶', type: 'walk_min',      target: 30,  xp: 160, diff: 'medium' },
];

const MISSION_BONUS_XP = 500;

function _missionTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function _missionDateHash(s) {
  let h = 0x1234ABCD;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 0x9e3779b9);
    h ^= h >>> 16;
  }
  return h >>> 0;
}

function _pickDailyMissions(dateKey) {
  let seed = _missionDateHash(dateKey);
  const pool = MISSION_POOL.slice();
  const picked = [];
  while (picked.length < 3 && pool.length > 0) {
    seed = ((seed * 1664525 + 1013904223) >>> 0);
    const idx = seed % pool.length;
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

class MissionModule {
  constructor() {
    this._todayKey = '';
    this._progress = {};      // missionId → { count, completed }
    this._bonusClaimed = false;
    this._missions = [];
  }

  init() {
    const today = _missionTodayKey();
    if (this._todayKey !== today) {
      this._todayKey = today;
      this._progress = {};
      this._bonusClaimed = false;
    }
    this._missions = _pickDailyMissions(this._todayKey);
  }

  getMissions() { return this._missions; }

  getProgress(id) {
    return this._progress[id] || { count: 0, completed: false };
  }

  _advance(missionId, amount) {
    const m = this._missions.find(x => x.id === missionId);
    if (!m) return false;
    const p = this._progress[missionId] || { count: 0, completed: false };
    if (p.completed) return false;
    p.count = Math.min((p.count || 0) + amount, m.target);
    if (p.count >= m.target) p.completed = true;
    this._progress[missionId] = p;
    return p.completed;
  }

  // Returns array of newly-completed mission objects
  onEvent(type, data) {
    const newlyDone = [];
    for (const m of this._missions) {
      if ((this._progress[m.id] || {}).completed) continue;

      let hit = false;
      let amt = 1;

      switch (m.type) {
        case 'water_count':
          if (type === 'water') { hit = true; }
          break;
        case 'exercise_min':
          if (type === 'exercise') { hit = true; amt = data.minutes || 0; }
          break;
        case 'exercise_burn':
          if (type === 'exercise') { hit = true; amt = data.kcal || 0; }
          break;
        case 'walk_min':
          if (type === 'exercise' && data.exType === 'walking') { hit = true; amt = data.minutes || 0; }
          break;
        case 'meal_count':
          if (type === 'meal') { hit = true; }
          break;
        case 'quest_done':
          if (type === 'quest') { hit = true; }
          break;
        case 'sleep_hours':
          if (type === 'sleep') { hit = true; amt = data.hours || 0; }
          break;
        case 'log_weight':
          if (type === 'weight') { hit = true; }
          break;
      }

      if (hit) {
        const done = this._advance(m.id, amt);
        if (done) newlyDone.push(m);
      }
    }
    return newlyDone;
  }

  // Check state-based missions — call from renderMissions()
  autoCheck(state) {
    const newlyDone = [];
    for (const m of this._missions) {
      if ((this._progress[m.id] || {}).completed) continue;
      let done = false;
      if (m.type === 'calorie_goal' && state.netCalories > 0 && state.netCalories <= state.dailyGoal) {
        done = this._advance(m.id, 1);
      } else if (m.type === 'low_stress' && state.stress < 50) {
        done = this._advance(m.id, 1);
      }
      if (done) newlyDone.push(m);
    }
    return newlyDone;
  }

  isAllDone() {
    return this._missions.length > 0 &&
      this._missions.every(m => (this._progress[m.id] || {}).completed);
  }

  claimBonus() {
    if (this._bonusClaimed || !this.isAllDone()) return 0;
    this._bonusClaimed = true;
    return MISSION_BONUS_XP;
  }

  getBonusClaimed() { return this._bonusClaimed; }
  getBonusXP() { return MISSION_BONUS_XP; }

  toJSON() {
    return {
      todayKey: this._todayKey,
      progress: this._progress,
      bonusClaimed: this._bonusClaimed,
    };
  }

  fromJSON(obj) {
    if (!obj) { this.init(); return; }
    this._todayKey   = obj.todayKey    || '';
    this._progress   = obj.progress   || {};
    this._bonusClaimed = obj.bonusClaimed || false;
    this.init();
  }
}

window.missionModule = new MissionModule();
