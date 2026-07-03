// modules/historyModule.js — Daily snapshot & analytics history (Phase 3)

class HistoryModule {
  constructor() {
    this.days = []; // max 90 entries: [{ date, caloriesEaten, caloriesBurned, calorieGoal, sleepHours, sleepQuality, stress, exerciseMin, questsDone, waterDrank, weight, bmi, level }]
  }

  _today() { return new Date().toISOString().slice(0, 10); }

  saveSnapshot() {
    const ch = window.characterModule;
    const hm = window.hungerModule;
    const qm = window.questModule;
    const sm = window.sleepModule;
    const st = window.stressModule;
    const wm = window.weightModule;

    const today = this._today();
    const macros = hm.macroTotals || {};
    const entry = {
      date:           today,
      caloriesEaten:  hm.caloriesEaten  || 0,
      caloriesBurned: hm.caloriesBurned || 0,
      calorieGoal:    ch.get('dailyCalorie'),
      sleepHours:     sm.lastSleepHours  || 0,
      sleepQuality:   sm.lastSleepQuality || 'normal',
      stress:         st.stress,
      exerciseMin:    hm.exerciseMinutes || 0,
      questsDone:     qm.countCompleted(ch.get('dailyCalorie')),
      waterDrank:     hm.waterDrank     || 0,
      weight:         (wm.getLatest() || {}).weight || ch.get('weightKg'),
      bmi:            ch.get('bmi'),
      level:          ch.get('level'),
      macroProtein:   macros.protein || 0,
      macroCarbs:     macros.carbs   || 0,
      macroFat:       macros.fat     || 0,
    };

    const idx = this.days.findIndex(d => d.date === today);
    if (idx >= 0) this.days[idx] = entry;
    else          this.days.push(entry);
    if (this.days.length > 90) this.days = this.days.slice(-90);
    this.days.sort((a, b) => a.date.localeCompare(b.date));
    return entry;
  }

  getRecent(n) {
    return this.days.slice(-n);
  }

  getWeeklySummary() {
    const recent = this.getRecent(7);
    if (!recent.length) return null;
    const n = recent.length;
    return {
      avgCalories: Math.round(recent.reduce((s, d) => s + d.caloriesEaten, 0) / n),
      avgSleep:    Math.round(recent.reduce((s, d) => s + d.sleepHours, 0) / n * 10) / 10,
      totalExMin:  recent.reduce((s, d) => s + d.exerciseMin, 0),
      totalWater:  recent.reduce((s, d) => s + d.waterDrank, 0),
      questDays:   recent.filter(d => d.questsDone >= 3).length,
      days: n,
    };
  }

  toJSON()    { return { days: this.days }; }
  fromJSON(d) { if (d) this.days = d.days || []; }
}

window.historyModule = new HistoryModule();
