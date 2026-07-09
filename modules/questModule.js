// modules/questModule.js — Daily quest tracking

const QUEST_DEFINITIONS = [
  {
    id: 'log_meals',
    nameKey: 'q_log_meals_name',
    descKey: 'q_log_meals_desc',
    type: 'count',
    target: 3,
    difficulty: 'easy',
    reward_xp: 50,
    emoji: '🍽️',
  },
  {
    id: 'stay_within_goal',
    nameKey: 'q_stay_within_name',
    descKey: 'q_stay_within_desc',
    type: 'threshold',
    difficulty: 'medium',
    reward_xp: 100,
    emoji: '🎯',
  },
  {
    id: 'exercise_challenge',
    nameKey: 'q_exercise_name',
    descKey: 'q_exercise_desc',
    type: 'burn_calories',
    target: 300,
    difficulty: 'hard',
    reward_xp: 150,
    emoji: '🔥',
  },
  {
    id: 'drink_water',
    nameKey: 'q_drink_water_name',
    descKey: 'q_drink_water_desc',
    type: 'count_water',
    target: 8,
    difficulty: 'easy',
    reward_xp: 25,
    emoji: '💧',
  },
  {
    id: 'balance_meals',
    nameKey: 'q_balance_name',
    descKey: 'q_balance_desc',
    type: 'meal_balance',
    target: 3,
    difficulty: 'medium',
    reward_xp: 75,
    emoji: '🥗',
  },
];

const EXERCISE_KCAL_PER_MIN = {
  walking: 4,      brisk_walk: 5,
  jogging: 7,      running: 8,      hiit: 11,
  cycling: 6,      cycling_hard: 9,
  swimming: 7,
  gym: 5,          weight_train: 5, bodyweight: 5,
  badminton: 6,    tennis: 7,       football: 7,
  basketball: 7,   volleyball: 5,   muay_thai: 9,   court_sport: 7,
  aerobic: 6,      jump_rope: 10,   dancing: 5,     hiking: 5,
  yoga: 3,         stretching: 2,
  kb_swing: 8,     kb_press: 5,     kb_squat: 6,    kb_snatch: 9,
  kb_row: 5,       kb_turkish_getup: 6, kb_renegade_row: 7, kb_lunge: 6,
  kb_russian_twist: 4, kb_figure8: 6,
};

class QuestModule {
  constructor() {
    this.progress = {};   // { questId: number }
    this.claimed  = {};   // { questId: true }
    this.lastResetDate = '';
  }

  init() {
    const today = this._dateKey();
    if (this.lastResetDate !== today) {
      this.progress = {};
      this.claimed  = {};
      this.lastResetDate = today;
    }
  }

  _dateKey() {
    return window._localDate();
  }

  getAll() { return QUEST_DEFINITIONS; }

  getProgress(questId) { return this.progress[questId] || 0; }

  getTarget(quest, dailyCalorie) {
    if (quest.type === 'threshold') return dailyCalorie;
    return quest.target;
  }

  isComplete(quest, dailyCalorie) {
    const prog = this.getProgress(quest.id);
    const target = this.getTarget(quest, dailyCalorie);
    if (quest.type === 'threshold') return prog <= target && prog > 0;
    return prog >= target;
  }

  isClaimed(questId) { return !!this.claimed[questId]; }

  claimQuest(quest, dailyCalorie) {
    if (this.isClaimed(quest.id)) return null;
    if (!this.isComplete(quest, dailyCalorie)) return null;
    this.claimed[quest.id] = true;
    return quest.reward_xp;
  }

  update(type, value) {
    switch (type) {
      case 'meal_logged':
        this.progress['log_meals'] = (this.progress['log_meals'] || 0) + 1;
        if (value === 'breakfast') this._trackMealType('breakfast');
        if (value === 'lunch')     this._trackMealType('lunch');
        if (value === 'dinner')    this._trackMealType('dinner');
        break;
      case 'calories_net':
        this.progress['stay_within_goal'] = value;
        break;
      case 'calories_burned':
        this.progress['exercise_challenge'] = (this.progress['exercise_challenge'] || 0) + value;
        break;
      case 'water_drank':
        this.progress['drink_water'] = (this.progress['drink_water'] || 0) + 1;
        break;
    }
  }

  _trackMealType(type) {
    if (!this.progress['_meals']) this.progress['_meals'] = {};
    this.progress['_meals'][type] = true;
    const mealCount = Object.keys(this.progress['_meals']).length;
    this.progress['balance_meals'] = mealCount;
  }

  countCompleted(dailyCalorie) {
    return QUEST_DEFINITIONS.filter(q => this.isComplete(q, dailyCalorie)).length;
  }

  totalXPEarned() {
    return QUEST_DEFINITIONS.filter(q => this.isClaimed(q.id)).reduce((sum, q) => sum + q.reward_xp, 0);
  }

  getExerciseKcal(type, minutes) {
    return Math.round((EXERCISE_KCAL_PER_MIN[type] || 4) * minutes);
  }

  getExerciseXP(kcal) {
    return Math.round(kcal / 4); // 4 kcal = 1 XP base
  }

  toJSON() {
    return { progress: this.progress, claimed: this.claimed, lastResetDate: this.lastResetDate };
  }

  fromJSON(d) {
    this.progress = d.progress || {};
    this.claimed  = d.claimed  || {};
    this.lastResetDate = d.lastResetDate || '';
    this.init(); // handles new-day reset
  }
}

window.questModule = new QuestModule();
