// modules/hungerModule.js — Hunger meter, calorie tracking

class HungerModule {
  constructor() {
    this.hunger = 50;       // 0-100
    this.caloriesEaten = 0; // today's kcal consumed
    this.caloriesBurned = 0;// today's kcal burned via exercise
    this.mealsLogged = 0;      // count today
    this.waterDrank = 0;       // glasses today
    this.exerciseMinutes = 0;  // total exercise minutes today
    this.mealTypes = { breakfast: false, lunch: false, dinner: false };
    this.lastUpdate = Date.now();
    this.foodLog = [];         // [{ name, kcal, protein, carbs, fat, mealType, time }]
    this.macroTotals = { protein: 0, carbs: 0, fat: 0 };

    // Drain rate per REAL minute
    this._drainPerMin = {
      rest: 0.15,
      questing: 0.3,
      exercise: 0.6,
    };
    this._currentActivity = 'rest';
    this._tickInterval = null;
  }

  startTick() {
    if (this._tickInterval) return;
    this._tickInterval = setInterval(() => this._tick(), 60000); // every real minute
  }

  _tick() {
    this.decayHunger(1, this._currentActivity);
    if (window.app) window.app.renderHunger();
  }

  decayHunger(minutes, activity = 'rest') {
    const rate = this._drainPerMin[activity] || this._drainPerMin.rest;
    this.hunger = Math.max(0, this.hunger - rate * minutes);
  }

  eatFood(foodItem, bmiPriceModifier = 1.0) {
    // Restore hunger (capped at 100)
    const prev = this.hunger;
    this.hunger = Math.min(100, this.hunger + foodItem.hunger_restore);
    const gained = this.hunger - prev;

    // Track calories
    const kcal = foodItem.calories || this._estimateCalories(foodItem);
    this.caloriesEaten += kcal;
    this.mealsLogged++;

    // Detect meal type from time of day
    const hour = new Date().getHours();
    if (hour >= 5  && hour < 11) this.mealTypes.breakfast = true;
    else if (hour >= 11 && hour < 16) this.mealTypes.lunch = true;
    else this.mealTypes.dinner = true;

    return { hungerGained: Math.round(gained), calories: kcal };
  }

  _estimateCalories(foodItem) {
    // Rough estimate based on hunger restore (1% hunger ≈ 18 kcal)
    return Math.round(foodItem.hunger_restore * 18);
  }

  drinkWater() {
    this.waterDrank++;
    this.hunger = Math.min(100, this.hunger + 2); // water gives tiny hunger
  }

  burnCalories(kcal, minutes) {
    this.caloriesBurned  += kcal;
    this.exerciseMinutes += (minutes || 0);
  }

  getNetCalories() {
    return this.caloriesEaten - this.caloriesBurned;
  }

  getHungerStatus() {
    if (this.hunger >= 70) return { key: 'hunger_satisfied', multiplier: 1.1 };
    if (this.hunger >= 40) return { key: 'hunger_normal',    multiplier: 1.0 };
    if (this.hunger >= 20) return { key: 'hunger_hungry',    multiplier: 0.8 };
    return                        { key: 'hunger_starving',  multiplier: 0.5 };
  }

  getHungerPct() { return Math.round(this.hunger); }

  getCaloriePct(dailyTarget) {
    return Math.min(100, Math.round(this.getNetCalories() / dailyTarget * 100));
  }

  // True if calorie intake <= daily target
  isWithinCalorieGoal(dailyTarget) {
    return this.getNetCalories() <= dailyTarget;
  }

  // Log a custom real-food entry
  // macros = { protein, carbs, fat } in grams (all optional)
  logCustomFood(name, kcal, mealType, macros) {
    const p = Math.round(macros && macros.protein > 0 ? macros.protein : 0);
    const c = Math.round(macros && macros.carbs   > 0 ? macros.carbs   : 0);
    const f = Math.round(macros && macros.fat     > 0 ? macros.fat     : 0);
    const entry = {
      name: name || 'อาหาร',
      kcal: Math.round(kcal),
      protein: p, carbs: c, fat: f,
      hasMacros: p > 0 || c > 0 || f > 0,
      mealType: mealType || 'snack',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };
    this.foodLog.push(entry);
    this.caloriesEaten += entry.kcal;
    this.mealsLogged++;
    this.macroTotals.protein += p;
    this.macroTotals.carbs   += c;
    this.macroTotals.fat     += f;
    this.hunger = Math.min(100, this.hunger + Math.round(entry.kcal / 20));
    if (mealType === 'breakfast') this.mealTypes.breakfast = true;
    else if (mealType === 'lunch')  this.mealTypes.lunch    = true;
    else if (mealType === 'dinner') this.mealTypes.dinner   = true;
    return entry;
  }

  removeCustomFood(index) {
    if (index < 0 || index >= this.foodLog.length) return;
    const entry = this.foodLog[index];
    this.caloriesEaten       = Math.max(0, this.caloriesEaten - entry.kcal);
    this.mealsLogged         = Math.max(0, this.mealsLogged - 1);
    this.macroTotals.protein = Math.max(0, this.macroTotals.protein - (entry.protein || 0));
    this.macroTotals.carbs   = Math.max(0, this.macroTotals.carbs   - (entry.carbs   || 0));
    this.macroTotals.fat     = Math.max(0, this.macroTotals.fat     - (entry.fat     || 0));
    this.foodLog.splice(index, 1);
  }

  updateFoodEntry(index, { name, kcal, mealType, protein, carbs, fat }) {
    if (index < 0 || index >= this.foodLog.length) return;
    const old = this.foodLog[index];
    this.caloriesEaten       = Math.max(0, this.caloriesEaten - old.kcal);
    this.macroTotals.protein = Math.max(0, this.macroTotals.protein - (old.protein || 0));
    this.macroTotals.carbs   = Math.max(0, this.macroTotals.carbs   - (old.carbs   || 0));
    this.macroTotals.fat     = Math.max(0, this.macroTotals.fat     - (old.fat     || 0));
    this.hunger              = Math.max(0, this.hunger - Math.round(old.kcal / 20));
    const p = Math.round(protein > 0 ? protein : 0);
    const c = Math.round(carbs   > 0 ? carbs   : 0);
    const f = Math.round(fat     > 0 ? fat     : 0);
    const updated = {
      name: name || old.name, kcal: Math.round(kcal),
      protein: p, carbs: c, fat: f,
      hasMacros: p > 0 || c > 0 || f > 0,
      mealType: mealType || old.mealType,
      time: old.time,
    };
    this.foodLog[index]       = updated;
    this.caloriesEaten       += updated.kcal;
    this.macroTotals.protein += p;
    this.macroTotals.carbs   += c;
    this.macroTotals.fat     += f;
    this.hunger = Math.min(100, this.hunger + Math.round(updated.kcal / 20));
    if (mealType === 'breakfast') this.mealTypes.breakfast = true;
    else if (mealType === 'lunch')  this.mealTypes.lunch    = true;
    else if (mealType === 'dinner') this.mealTypes.dinner   = true;
    return updated;
  }

  getMacroTotals() { return { ...this.macroTotals }; }

  // Daily targets based on calorie goal + BMI category
  getDailyMacroTargets(dailyCalorie, bmiCatId) {
    let pPct = 0.20, cPct = 0.55, fPct = 0.25;
    if (bmiCatId === 'underweight') { pPct = 0.25; cPct = 0.55; fPct = 0.20; }
    else if (bmiCatId && bmiCatId.startsWith('overweight')) { pPct = 0.30; cPct = 0.45; fPct = 0.25; }
    else if (bmiCatId && bmiCatId.startsWith('obese'))      { pPct = 0.30; cPct = 0.40; fPct = 0.30; }
    return {
      protein: Math.round(dailyCalorie * pPct / 4),
      carbs:   Math.round(dailyCalorie * cPct / 4),
      fat:     Math.round(dailyCalorie * fPct / 9),
    };
  }

  hasMacroData() {
    return this.foodLog.some(e => e.hasMacros);
  }

  getTodayFoodLog() { return this.foodLog; }

  resetForNewDay() {
    this.caloriesEaten   = 0;
    this.caloriesBurned  = 0;
    this.mealsLogged     = 0;
    this.waterDrank      = 0;
    this.exerciseMinutes = 0;
    this.mealTypes   = { breakfast: false, lunch: false, dinner: false };
    this.foodLog     = [];
    this.macroTotals = { protein: 0, carbs: 0, fat: 0 };
    this.hunger = Math.max(20, this.hunger - 30); // wake up a bit hungry
  }

  toJSON() {
    return {
      hunger: this.hunger,
      caloriesEaten: this.caloriesEaten,
      caloriesBurned:  this.caloriesBurned,
      mealsLogged:     this.mealsLogged,
      waterDrank:      this.waterDrank,
      exerciseMinutes: this.exerciseMinutes,
      mealTypes:       this.mealTypes,
      foodLog:         this.foodLog,
      macroTotals:     this.macroTotals,
      lastUpdate: this.lastUpdate,
    };
  }

  fromJSON(d) {
    Object.assign(this, d);
    this.exerciseMinutes = d.exerciseMinutes || 0;
    this.foodLog         = d.foodLog         || [];
    this.macroTotals     = d.macroTotals     || { protein: 0, carbs: 0, fat: 0 };
    // If saved more than 8 hours ago, apply offline hunger decay
    const elapsed = (Date.now() - (d.lastUpdate || Date.now())) / 60000;
    if (elapsed > 0) this.decayHunger(Math.min(elapsed, 480), 'rest');
    this.lastUpdate = Date.now();
  }
}

window.hungerModule = new HungerModule();
