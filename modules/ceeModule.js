// modules/ceeModule.js
// Constrained Total Energy Expenditure adjustment (Pontzer et al. 2012, 2016)
//
// Key finding: when exercise increases, the body compensates by reducing other
// metabolic costs (inflammation, stress response, reproductive hormones).
// So the NET increase in daily energy expenditure is less than the exercise kcal
// calculated by naive kcal/min × minutes formulas.
//
// This module adjusts displayed calorie burn to reflect actual metabolic contribution.

class CEEModule {

  // Acute load factor: today's accumulated exercise load reduces efficiency of
  // each additional session (the body is already compensating more as load rises)
  _loadFactor(burnedSoFar) {
    if (burnedSoFar < 150) return 1.00; // first session — full efficiency
    if (burnedSoFar < 300) return 0.90; // mild load
    if (burnedSoFar < 500) return 0.80; // moderate — noticeable compensation
    return 0.70;                         // heavy load day
  }

  // Adaptation factor: consecutive exercise days build metabolic adaptation,
  // increasing the body's compensatory response (Hadza equilibrium at ~72%)
  _adaptFactor(streak) {
    if (streak <= 2)  return 1.00; // fresh start / casual exerciser
    if (streak <= 6)  return 0.93; // short streak
    if (streak <= 13) return 0.85; // regular exerciser
    return 0.72;                    // long-term Hadza-level equilibrium (Pontzer 2012)
  }

  // Returns consecutive days with meaningful exercise (>= 20 min)
  getStreakDays() {
    try {
      const recent = historyModule.getRecent(21);
      let streak = 0;
      for (let i = recent.length - 1; i >= 0; i--) {
        if ((recent[i].exerciseMin || 0) >= 20) streak++;
        else break;
      }
      return streak;
    } catch { return 0; }
  }

  // Returns efficiency fraction (0.40 – 1.00)
  // burnedSoFar: today's caloriesBurned BEFORE the new session (default: current state)
  getEfficiency(burnedSoFar) {
    const todayBurned = (burnedSoFar !== undefined)
      ? burnedSoFar
      : ((window.hungerModule && hungerModule.caloriesBurned) || 0);
    const streak = this.getStreakDays();
    const raw = this._loadFactor(todayBurned) * this._adaptFactor(streak);
    return Math.max(0.40, +raw.toFixed(2));
  }

  // Returns CEE-adjusted effective kcal
  adjustBurn(rawKcal, burnedSoFar) {
    return Math.round(rawKcal * this.getEfficiency(burnedSoFar));
  }

  // Returns display status object { pct, label, color, streak }
  getStatus() {
    const streak = this.getStreakDays();
    const eff = this.getEfficiency();
    const pct = Math.round(eff * 100);
    if (eff >= 0.97) return { pct, label: 'เต็มประสิทธิภาพ',           color: '#22c55e', streak };
    if (eff >= 0.88) return { pct, label: `ปรับตัว ${streak} วัน`,     color: '#a3e635', streak };
    if (eff >= 0.78) return { pct, label: 'ร่างกายชดเชยปานกลาง',       color: '#fbbf24', streak };
    if (eff >= 0.65) return { pct, label: 'ชดเชยสูง — พักได้แล้ว',    color: '#f97316', streak };
    return              { pct, label: 'CEE สูงมาก (Hadza Level)',       color: '#ef4444', streak };
  }
}

window.ceeModule = new CEEModule();
