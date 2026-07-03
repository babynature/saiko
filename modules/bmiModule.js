// modules/bmiModule.js — BMI calculations & category data

class BMIModule {
  constructor() {
    this.categories = [
      { id: 'underweight', min: 0,    max: 18.5, priceModifier: 0.8,  calMult: 1.2,  sizePercent: 90,  statMod: -0.2 },
      { id: 'normal',      min: 18.5, max: 25,   priceModifier: 1.0,  calMult: 1.0,  sizePercent: 100, statMod: 0 },
      { id: 'overweight',  min: 25,   max: 30,   priceModifier: 1.2,  calMult: 0.85, sizePercent: 108, statMod: -0.1 },
      { id: 'obese_lv1',   min: 30,   max: 35,   priceModifier: 1.5,  calMult: 0.75, sizePercent: 116, statMod: -0.25 },
      { id: 'obese_lv2',   min: 35,   max: 40,   priceModifier: 2.0,  calMult: 0.70, sizePercent: 124, statMod: -0.4 },
      { id: 'obese_lv3',   min: 40,   max: 999,  priceModifier: 3.0,  calMult: 0.65, sizePercent: 130, statMod: -0.5 },
    ];
  }

  calculateBMI(heightCm, weightKg) {
    const h = heightCm / 100;
    return Math.round((weightKg / (h * h)) * 10) / 10;
  }

  getCategory(bmi) {
    return this.categories.find(c => bmi >= c.min && bmi < c.max) || this.categories[5];
  }

  getCategoryId(bmi) {
    return this.getCategory(bmi).id;
  }

  // Harris-Benedict BMR
  calculateBMR(age, heightCm, weightKg, gender) {
    if (gender === 'M') {
      return 66 + (13.7 * weightKg) + (5 * heightCm) - (6.8 * age);
    }
    return 655 + (9.6 * weightKg) + (1.8 * heightCm) - (4.7 * age);
  }

  calculateDailyCalorie(age, heightCm, weightKg, gender, activity) {
    const bmr = this.calculateBMR(age, heightCm, weightKg, gender);
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    const tdee = bmr * (multipliers[activity] || 1.375);
    const cat = this.getCategory(this.calculateBMI(heightCm, weightKg));
    return Math.round(tdee * cat.calMult);
  }

  getPriceModifier(bmi) {
    return this.getCategory(bmi).priceModifier;
  }

  getSizePercent(bmi) {
    return this.getCategory(bmi).sizePercent;
  }

  getStatModifier(bmi) {
    return this.getCategory(bmi).statMod;
  }

  getCategoryColor(bmi) {
    const id = this.getCategoryId(bmi);
    const colors = {
      underweight: '#60a5fa', normal: '#4ade80', overweight: '#fbbf24',
      obese_lv1: '#f87171', obese_lv2: '#dc2626', obese_lv3: '#7f1d1d'
    };
    return colors[id] || '#a0a0c0';
  }

  getCategoryLabel(bmi) {
    const id = this.getCategoryId(bmi);
    const keys = {
      underweight: 'bmi_underweight', normal: 'bmi_normal', overweight: 'bmi_overweight',
      obese_lv1: 'bmi_obese1', obese_lv2: 'bmi_obese2', obese_lv3: 'bmi_obese3'
    };
    return t(keys[id] || 'bmi_normal');
  }

  getAdviceKey(bmi) {
    const id = this.getCategoryId(bmi);
    const keys = {
      underweight: 'advice_underweight', normal: 'advice_normal', overweight: 'advice_overweight',
      obese_lv1: 'advice_obese1', obese_lv2: 'advice_obese2', obese_lv3: 'advice_obese3'
    };
    return keys[id] || 'advice_normal';
  }

  // Returns CSS class for BMI color
  getBMIClass(bmi) {
    const id = this.getCategoryId(bmi);
    return 'bmi-' + id.replace('_lv', '').replace('_', '');
  }

  // Live preview on onboarding form
  previewBMI(heightCm, weightKg, age, gender, activity) {
    if (!heightCm || !weightKg || heightCm < 50 || weightKg < 5) return null;
    const bmi = this.calculateBMI(heightCm, weightKg);
    const calorie = this.calculateDailyCalorie(age || 16, heightCm, weightKg, gender || 'F', activity || 'light');
    return { bmi, calorie, categoryId: this.getCategoryId(bmi), color: this.getCategoryColor(bmi), label: this.getCategoryLabel(bmi) };
  }
}

window.bmiModule = new BMIModule();
