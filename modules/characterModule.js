// modules/characterModule.js — Character state & cosmetics

class CharacterModule {
  constructor() {
    this.data = {
      name: 'Sam',
      age: 16,
      gender: 'F',
      heightCm: 160,
      weightKg: 50,
      activity: 'light',
      bmi: 19.5,
      categoryId: 'normal',
      dailyCalorie: 1850,
      level: 1,
      exp: 0,
      totalExp: 0,
      health: 80,
      strength: 50,
      endurance: 50,
      intelligence: 60,
      stamina: 60,
      cosmetics: { color: 'default', aura: 'none', accessory: 'none', pet: 'none' },
      activeBuffs: [],   // [{ id, stat, amount, expiresAt }]
      xpMultiplier: 1.0,
      xpMultiplierExpires: null,
    };
  }

  get(key) { return this.data[key]; }
  set(key, val) { this.data[key] = val; }

  initFromSetup(name, age, gender, heightCm, weightKg, activity) {
    this.data.name = name;
    this.data.age = age;
    this.data.gender = gender;
    this.data.heightCm = heightCm;
    this.data.weightKg = weightKg;
    this.data.activity = activity;

    const bmi = window.bmiModule.calculateBMI(heightCm, weightKg);
    this.data.bmi = bmi;
    this.data.categoryId = window.bmiModule.getCategoryId(bmi);
    this.data.dailyCalorie = window.bmiModule.calculateDailyCalorie(age, heightCm, weightKg, gender, activity);

    this._applyBMIStats();
  }

  _applyBMIStats() {
    const mod = window.bmiModule.getStatModifier(this.data.bmi);
    const base = { health: 80, strength: 50, endurance: 50, intelligence: 60, stamina: 60 };
    this.data.health      = Math.max(10, Math.round(base.health      * (1 + mod)));
    this.data.strength    = Math.max(10, Math.round(base.strength    * (1 + mod)));
    this.data.endurance   = Math.max(10, Math.round(base.endurance   * (1 + mod)));
    this.data.intelligence= Math.max(10, Math.round(base.intelligence* (1 + mod)));
    this.data.stamina     = Math.max(10, Math.round(base.stamina     * (1 + mod)));
  }

  getEffectiveStats(hungerMultiplier = 1.0) {
    const buffs = this._getActiveBuffStats();
    return {
      health:       Math.round((this.data.health      + (buffs.health || 0))      * hungerMultiplier),
      strength:     Math.round((this.data.strength    + (buffs.strength || 0))    * hungerMultiplier),
      endurance:    Math.round((this.data.endurance   + (buffs.endurance || 0))   * hungerMultiplier),
      intelligence: Math.round((this.data.intelligence+ (buffs.intelligence || 0))* hungerMultiplier),
      stamina:      Math.round((this.data.stamina     + (buffs.stamina || 0))     * hungerMultiplier),
    };
  }

  _getActiveBuffStats() {
    const now = Date.now();
    const acc = {};
    this.data.activeBuffs = this.data.activeBuffs.filter(b => b.expiresAt === null || b.expiresAt > now);
    this.data.activeBuffs.forEach(b => { acc[b.stat] = (acc[b.stat] || 0) + b.amount; });
    return acc;
  }

  addBuff(id, stat, amount, durationHours) {
    const expiresAt = durationHours > 0 ? Date.now() + durationHours * 3600000 : null;
    const existing = this.data.activeBuffs.findIndex(b => b.id === id);
    if (existing >= 0) this.data.activeBuffs.splice(existing, 1);
    this.data.activeBuffs.push({ id, stat, amount, expiresAt });
  }

  addExp(amount) {
    const mult = this._getXPMultiplier();
    const gained = Math.round(amount * mult);
    this.data.exp += gained;
    this.data.totalExp += gained;
    const levelUpOccurred = this._checkLevelUp();
    return { gained, levelUp: levelUpOccurred };
  }

  _getXPMultiplier() {
    if (this.data.xpMultiplierExpires && Date.now() > this.data.xpMultiplierExpires) {
      this.data.xpMultiplier = 1.0;
      this.data.xpMultiplierExpires = null;
    }
    return this.data.xpMultiplier;
  }

  setXPMultiplier(mult, durationHours) {
    this.data.xpMultiplier = mult;
    this.data.xpMultiplierExpires = Date.now() + durationHours * 3600000;
  }

  _checkLevelUp() {
    const needed = this.getXPForLevel(this.data.level);
    if (this.data.exp < needed) return false;
    this.data.exp -= needed;
    this.data.level++;
    // Stat gains on level up
    this.data.health      += 5;
    this.data.strength    += 2;
    this.data.endurance   += 2;
    this.data.intelligence+= 1;
    this.data.stamina     += 3;
    return true;
  }

  getXPForLevel(level) {
    return (level * 500) + (Math.pow(level, 2) * 100);
  }

  getXPProgress() {
    const needed = this.getXPForLevel(this.data.level);
    return { current: this.data.exp, needed, pct: Math.min(100, Math.round(this.data.exp / needed * 100)) };
  }

  getTitle() {
    const lv = this.data.level;
    if (lv >= 50) return t('title_50');
    if (lv >= 30) return t('title_30');
    if (lv >= 20) return t('title_20');
    if (lv >= 10) return t('title_10');
    if (lv >= 5)  return t('title_5');
    return t('title_1');
  }

  getEmotionFace(hungerPct) {
    if (hungerPct >= 70) return '😊';
    if (hungerPct >= 40) return '😐';
    if (hungerPct >= 20) return '😣';
    return '😵';
  }

  getSizeScale() {
    return window.bmiModule.getSizePercent(this.data.bmi) / 100;
  }

  equipCosmetic(type, value) {
    this.data.cosmetics[type] = value;
  }

  getAuraClass() {
    const aura = this.data.cosmetics.aura;
    if (aura === 'golden') return 'golden';
    if (aura === 'azure')  return 'azure';
    if (aura === 'crimson')return 'crimson';
    return '';
  }

  toJSON() { return JSON.parse(JSON.stringify(this.data)); }
  fromJSON(d) { this.data = Object.assign(this.data, d); }
}

window.characterModule = new CharacterModule();
