// modules/sleepModule.js — Sleep tracking & fatigue system

class SleepModule {
  constructor() {
    this.fatigue       = 70;       // 0=exhausted, 100=fully rested
    this.lastSleepHours   = 0;
    this.lastSleepQuality = 'normal';
    this.lastSleepTime    = 0;     // Date.now() when logged
    this.lastSleepDate    = '';    // YYYY-MM-DD
    this.totalDaysLogged  = 0;
    this.avgSleepHours    = 0;
  }

  _dateKey() { return window._localDate(); }

  logSleep(hours, quality) {
    const qualMod = quality === 'good' ? 10 : quality === 'poor' ? -15 : 0;
    let base;
    if      (hours < 3)  base = 15;
    else if (hours < 5)  base = 35;
    else if (hours < 7)  base = 60;
    else if (hours <= 9) base = 90;
    else if (hours <= 11)base = 80;
    else                 base = 65;

    this.fatigue = Math.max(0, Math.min(100, base + qualMod));
    this.lastSleepHours   = hours;
    this.lastSleepQuality = quality;
    this.lastSleepTime    = Date.now();
    this.lastSleepDate    = this._dateKey();

    if (this.totalDaysLogged === 0) {
      this.avgSleepHours = hours;
    } else {
      this.avgSleepHours = Math.round(
        ((this.avgSleepHours * this.totalDaysLogged) + hours) /
        (this.totalDaysLogged + 1) * 10
      ) / 10;
    }
    this.totalDaysLogged++;
    return { fatigue: this.fatigue };
  }

  getCurrentFatigue() {
    if (!this.lastSleepTime) return this.fatigue;
    const hoursSince = (Date.now() - this.lastSleepTime) / 3600000;
    const decay = Math.floor(hoursSince * 3); // -3 fatigue per waking hour
    return Math.max(0, this.fatigue - decay);
  }

  getStatusKey() {
    const f = this.getCurrentFatigue();
    if (f >= 80) return 'fatigue_great';
    if (f >= 50) return 'fatigue_good';
    if (f >= 30) return 'fatigue_tired';
    if (f >= 10) return 'fatigue_very_tired';
    return 'fatigue_exhausted';
  }

  getStatMultiplier() {
    const f = this.getCurrentFatigue();
    if (f >= 80) return 1.1;
    if (f >= 50) return 1.0;
    if (f >= 30) return 0.9;
    if (f >= 10) return 0.75;
    return 0.6;
  }

  getXPMultiplier() {
    const f = this.getCurrentFatigue();
    if (f >= 80) return 1.1;
    if (f >= 50) return 1.0;
    if (f >= 30) return 0.95;
    if (f >= 10) return 0.85;
    return 0.7;
  }

  toJSON() {
    return {
      fatigue:          this.fatigue,
      lastSleepHours:   this.lastSleepHours,
      lastSleepQuality: this.lastSleepQuality,
      lastSleepTime:    this.lastSleepTime,
      lastSleepDate:    this.lastSleepDate,
      totalDaysLogged:  this.totalDaysLogged,
      avgSleepHours:    this.avgSleepHours,
    };
  }

  fromJSON(d) {
    this.fatigue          = d.fatigue          ?? 70;
    this.lastSleepHours   = d.lastSleepHours   || 0;
    this.lastSleepQuality = d.lastSleepQuality || 'normal';
    this.lastSleepTime    = d.lastSleepTime    || 0;
    this.lastSleepDate    = d.lastSleepDate    || '';
    this.totalDaysLogged  = d.totalDaysLogged  || 0;
    this.avgSleepHours    = d.avgSleepHours    || 0;
  }
}

window.sleepModule = new SleepModule();
