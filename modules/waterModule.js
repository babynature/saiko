// modules/waterModule.js — Daily Water Intake Tracker

class WaterModule {
  constructor() {
    this.data = { mlToday: 0, goalMl: 2000, lastDate: '' };
  }

  _today() { return window._localDate(); }

  _checkReset() {
    const today = this._today();
    if (this.data.lastDate !== today) {
      this.data.mlToday = 0;
      this.data.lastDate = today;
    }
  }

  add(ml) {
    this._checkReset();
    this.data.mlToday = Math.min(this.data.mlToday + ml, this.data.goalMl * 3);
    return this.data.mlToday;
  }

  getMl()          { this._checkReset(); return this.data.mlToday; }
  getGoalMl()      { return this.data.goalMl; }
  getGlasses()     { return Math.floor(this.getMl() / 250); }
  getGoalGlasses() { return Math.round(this.data.goalMl / 250); }
  getPct()         { return Math.min(100, Math.round(this.getMl() / this.data.goalMl * 100)); }
  isGoalMet()      { return this.getMl() >= this.data.goalMl; }
  setGoal(ml)      { this.data.goalMl = Math.max(500, Math.min(5000, Math.round(ml / 250) * 250)); }

  toJSON()    { this._checkReset(); return { ...this.data }; }
  fromJSON(d) { if (d) Object.assign(this.data, d); this._checkReset(); }
}

window.waterModule = new WaterModule();
