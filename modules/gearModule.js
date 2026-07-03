// modules/gearModule.js — Gear / Equipment System (Phase 8)
// Permanent items that give passive bonuses when equipped

const GEAR_DATA = [
  {
    id: 'gear_shoes',
    slot: 'exercise',
    name_th: 'รองเท้าวิ่ง',
    name_en: 'Running Shoes',
    icon: '👟',
    desc_th: 'XP จากออกกำลัง +15%',
    desc_en: 'Exercise XP +15%',
    cost: 300,
    bonus: { type: 'exercise_xp_pct', value: 15 },
    rarity: 'uncommon',
  },
  {
    id: 'gear_bottle',
    slot: 'water',
    name_th: 'ขวดน้ำ',
    name_en: 'Water Bottle',
    icon: '🍶',
    desc_th: 'นับน้ำ +1 แก้วต่อการบันทึก',
    desc_en: 'Water count +1 per log',
    cost: 200,
    bonus: { type: 'water_bonus', value: 1 },
    rarity: 'common',
  },
  {
    id: 'gear_bag',
    slot: 'food',
    name_th: 'กระเป๋าอาหาร',
    name_en: 'Lunch Bag',
    icon: '🎒',
    desc_th: 'XP จากอาหาร +10%',
    desc_en: 'Food XP +10%',
    cost: 250,
    bonus: { type: 'food_xp_pct', value: 10 },
    rarity: 'uncommon',
  },
  {
    id: 'gear_mat',
    slot: 'sleep',
    name_th: 'ที่นอนพรีเมียม',
    name_en: 'Yoga Mat',
    icon: '🧘',
    desc_th: 'XP จากบันทึกนอน +20%',
    desc_en: 'Sleep log XP +20%',
    cost: 350,
    bonus: { type: 'sleep_xp_pct', value: 20 },
    rarity: 'rare',
  },
  {
    id: 'gear_watch',
    slot: 'hud',
    name_th: 'นาฬิกาสุขภาพ',
    name_en: 'Health Watch',
    icon: '⌚',
    desc_th: 'แสดง Stress + Water ใน HUD',
    desc_en: 'Shows stress & water in HUD',
    cost: 400,
    bonus: { type: 'hud_extra', value: 1 },
    rarity: 'rare',
  },
  {
    id: 'gear_shaker',
    slot: 'protein',
    name_th: 'แก้ว Protein Shaker',
    name_en: 'Protein Shaker',
    icon: '🥤',
    desc_th: 'Strength +3 ต่อการกินอาหาร',
    desc_en: 'Strength +3 per meal',
    cost: 280,
    bonus: { type: 'meal_strength', value: 3 },
    rarity: 'uncommon',
  },
];

const GEAR_SLOT_LABELS = {
  exercise: '🏃 ออกกำลัง',
  water:    '💧 น้ำ',
  food:     '🍽️ อาหาร',
  sleep:    '😴 นอน',
  hud:      '📊 HUD',
  protein:  '💪 โปรตีน',
};

class GearModule {
  constructor() {
    this.owned    = [];   // gear IDs
    this.equipped = {};   // { slot: gearId }
  }

  getAll()      { return GEAR_DATA; }
  getById(id)   { return GEAR_DATA.find(g => g.id === id); }
  isOwned(id)   { return this.owned.includes(id); }
  isEquipped(id) {
    const g = this.getById(id);
    return g ? this.equipped[g.slot] === id : false;
  }

  getSlotLabel(slot) {
    return GEAR_SLOT_LABELS[slot] || slot;
  }

  buy(id) {
    if (this.isOwned(id)) return false;
    this.owned.push(id);
    return true;
  }

  toggle(id) {
    const g = this.getById(id);
    if (!g || !this.isOwned(id)) return;
    if (this.equipped[g.slot] === id) {
      delete this.equipped[g.slot];
    } else {
      this.equipped[g.slot] = id;
    }
  }

  getBonus(bonusType) {
    for (const gearId of Object.values(this.equipped)) {
      const g = this.getById(gearId);
      if (g && g.bonus.type === bonusType) return g.bonus.value;
    }
    return 0;
  }

  applyExerciseXP(baseXP) {
    const pct = this.getBonus('exercise_xp_pct');
    return pct ? Math.round(baseXP * (1 + pct / 100)) : baseXP;
  }

  applyFoodXP(baseXP) {
    const pct = this.getBonus('food_xp_pct');
    return pct ? Math.round(baseXP * (1 + pct / 100)) : baseXP;
  }

  applySleepXP(baseXP) {
    const pct = this.getBonus('sleep_xp_pct');
    return pct ? Math.round(baseXP * (1 + pct / 100)) : baseXP;
  }

  getWaterBonus()        { return this.getBonus('water_bonus'); }
  getMealStrengthBonus() { return this.getBonus('meal_strength'); }
  hasHUDExtra()          { return this.getBonus('hud_extra') > 0; }

  getEquippedList() {
    return Object.values(this.equipped)
      .map(id => this.getById(id))
      .filter(Boolean);
  }

  toJSON() {
    return { owned: [...this.owned], equipped: { ...this.equipped } };
  }

  fromJSON(obj) {
    if (!obj) return;
    this.owned    = obj.owned    || [];
    this.equipped = obj.equipped || {};
  }
}

window.gearModule = new GearModule();
