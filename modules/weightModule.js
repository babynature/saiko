// modules/weightModule.js — Daily Weight Tracking & BMI History

class WeightModule {
  constructor() {
    this.logs        = [];  // [{ date:'YYYY-MM-DD', weight:number, bmi:number }]
    this.startWeight = 0;
    this.startDate   = '';
  }

  _today() { return new Date().toISOString().slice(0, 10); }

  logWeight(kg) {
    const heightCm = window.characterModule.get('heightCm');
    const rawBmi   = window.bmiModule.calculateBMI(heightCm, kg);
    const bmi      = Math.round(rawBmi * 10) / 10;
    const entry    = { date: this._today(), weight: kg, bmi };

    const idx = this.logs.findIndex(l => l.date === entry.date);
    if (idx >= 0) this.logs[idx] = entry;
    else          this.logs.push(entry);

    if (this.logs.length > 90) this.logs = this.logs.slice(-90);
    this.logs.sort((a, b) => a.date.localeCompare(b.date));

    if (!this.startWeight) {
      this.startWeight = kg;
      this.startDate   = entry.date;
    }
    return { weight: kg, bmi };
  }

  getLatest() {
    return this.logs.length ? this.logs[this.logs.length - 1] : null;
  }

  getRecent(n) {
    return this.logs.slice(-n);
  }

  getChange() {
    const latest = this.getLatest();
    if (!latest || !this.startWeight) return 0;
    return Math.round((latest.weight - this.startWeight) * 10) / 10;
  }

  getTrend() {
    const r = this.getRecent(3);
    if (r.length < 2) return 'stable';
    const d = r[r.length - 1].weight - r[0].weight;
    if (d < -0.05) return 'losing';
    if (d >  0.05) return 'gaining';
    return 'stable';
  }

  toJSON() {
    return { logs: this.logs, startWeight: this.startWeight, startDate: this.startDate };
  }

  fromJSON(d) {
    if (!d) return;
    this.logs        = d.logs        || [];
    this.startWeight = d.startWeight || 0;
    this.startDate   = d.startDate   || '';
  }
}

window.weightModule = new WeightModule();
