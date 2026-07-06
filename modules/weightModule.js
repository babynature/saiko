// modules/weightModule.js — Daily Weight Tracking & BMI History

class WeightModule {
  constructor() {
    this.logs        = [];
    this.startWeight = 0;
    this.startDate   = '';
    this.goalWeight  = null;  // kg target, null = not set
  }

  _today() { return new Date().toISOString().slice(0, 10); }

  logWeight(kg, date = null) {
    const heightCm = window.characterModule.get('heightCm');
    const rawBmi   = window.bmiModule.calculateBMI(heightCm, kg);
    const bmi      = Math.round(rawBmi * 10) / 10;
    const entry    = { date: date || this._today(), weight: kg, bmi };

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

  setGoal(kg) { this.goalWeight = kg > 0 ? Math.round(kg * 10) / 10 : null; }

  getGoalProgress() {
    if (!this.goalWeight || !this.startWeight) return null;
    const latest = this.getLatest()?.weight ?? this.startWeight;
    const total  = Math.abs(this.goalWeight - this.startWeight);
    if (total < 0.01) return 100;
    const done = Math.abs(latest - this.startWeight);
    return Math.min(100, Math.round(done / total * 100));
  }

  getEstimatedDays() {
    if (!this.goalWeight) return null;
    const latest = this.getLatest()?.weight ?? this.startWeight;
    const remain = this.goalWeight - latest;
    if (Math.abs(remain) < 0.1) return 0;
    const r = this.getRecent(7);
    if (r.length < 2) return null;
    const avgChange = (r[r.length-1].weight - r[0].weight) / (r.length - 1);
    if (avgChange === 0 || Math.sign(avgChange) !== Math.sign(remain)) return null;
    return Math.ceil(Math.abs(remain / avgChange));
  }

  toJSON() {
    return { logs: this.logs, startWeight: this.startWeight, startDate: this.startDate, goalWeight: this.goalWeight };
  }

  fromJSON(d) {
    if (!d) return;
    this.logs        = d.logs        || [];
    this.startWeight = d.startWeight || 0;
    this.startDate   = d.startDate   || '';
    this.goalWeight  = d.goalWeight  ?? null;
  }
}

window.weightModule = new WeightModule();
