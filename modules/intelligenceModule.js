// modules/intelligenceModule.js — Smart food & exercise recommendations (Phase 4)

const FOOD_INTEL = {
  underweight: {
    recommend: ['steak_001', 'all_you_can_001', 'set_meal_001', 'rice_chicken_001', 'pad_thai_001', 'ramen_001', 'immortal_rice_001'],
    avoid:     ['salad_001', 'water_001', 'apple_001'],
    strategy_th: 'กินแคลอรี่สูงเพื่อเพิ่มน้ำหนัก เน้นโปรตีนและคาร์บ',
    strategy_en: 'Eat high-calorie foods to gain weight — focus on protein & carbs',
  },
  normal: {
    recommend: ['rice_chicken_001', 'fish_rice_001', 'salad_001', 'banana_001', 'apple_001', 'pad_thai_001'],
    avoid:     ['all_you_can_001', 'immortal_rice_001'],
    strategy_th: 'กินสมดุล โปรตีนลีน ผัก ผลไม้ เพื่อรักษาน้ำหนัก',
    strategy_en: 'Balanced diet — lean protein, vegetables, fruits to maintain weight',
  },
  overweight: {
    recommend: ['salad_001', 'apple_001', 'water_001', 'banana_001', 'fish_rice_001'],
    avoid:     ['steak_001', 'all_you_can_001', 'set_meal_001', 'immortal_rice_001', 'pad_thai_001'],
    strategy_th: 'เลือกอาหารแคลอรี่ต่ำ ผัก ผลไม้ โปรตีนไร้ไขมัน',
    strategy_en: 'Choose low-calorie foods — vegetables, fruits, lean protein',
  },
  obese_lv1: {
    recommend: ['salad_001', 'apple_001', 'water_001', 'banana_001'],
    avoid:     ['steak_001', 'all_you_can_001', 'set_meal_001', 'immortal_rice_001', 'pad_thai_001', 'ramen_001', 'rice_chicken_001'],
    strategy_th: 'จำกัดแคลอรี่อย่างเคร่งครัด เน้นผักและน้ำเป็นหลัก',
    strategy_en: 'Strict calorie restriction — focus on vegetables and water',
  },
  obese_lv2: {
    recommend: ['salad_001', 'apple_001', 'water_001'],
    avoid:     ['steak_001', 'all_you_can_001', 'set_meal_001', 'immortal_rice_001', 'pad_thai_001', 'ramen_001', 'rice_chicken_001', 'energy_drink_001'],
    strategy_th: 'ควบคุมอาหารอย่างเข้มงวด ปรึกษาผู้เชี่ยวชาญ',
    strategy_en: 'Strict diet control — consult a nutritionist',
  },
  obese_lv3: {
    recommend: ['salad_001', 'water_001', 'apple_001'],
    avoid:     ['steak_001', 'all_you_can_001', 'set_meal_001', 'immortal_rice_001', 'pad_thai_001', 'ramen_001', 'rice_chicken_001', 'energy_drink_001', 'lucky_meal_001'],
    strategy_th: 'ต้องการการดูแลจากแพทย์ ควบคุมอาหารอย่างเคร่งครัด',
    strategy_en: 'Medical supervision required — strict food control',
  },
};

const EXERCISE_INTEL = {
  underweight: {
    focus_th: '💪 เน้นสร้างกล้ามเนื้อ',
    focus_en: '💪 Build Muscle',
    recommended: ['gym', 'walking'],
    avoid:       ['running'],
    tips_th: [
      'เล่นกล้ามเนื้อ (Gym/Push-up) 3 วัน/สัปดาห์',
      'วิ่งเบาๆ 20-30 นาที เพื่อสุขภาพหัวใจ ไม่ต้องหักโหม',
      'ตั้งเป้าเผาแคลอรี่ไม่เกิน 300 kcal/ครั้ง เพื่อไม่ให้น้ำหนักลด',
    ],
    tips_en: [
      'Weight training 3 days/week for muscle gain',
      'Light jogging 20-30 min for cardiovascular health — keep it easy',
      'Aim to burn under 300 kcal/session to avoid weight loss',
    ],
    target_min: 30,
    target_days: 3,
  },
  normal: {
    focus_th: '⚖️ ฝึกแบบผสมผสาน',
    focus_en: '⚖️ Mixed Training',
    recommended: ['running', 'cycling', 'swimming', 'gym'],
    avoid:       [],
    tips_th: [
      'คาร์ดิโอ 3-4 วัน/สัปดาห์ 30-45 นาที ความเข้มระดับกลาง',
      'เล่นกล้ามเนื้อ 2-3 วัน/สัปดาห์ เพื่อคงสัดส่วน',
      'เป้าหมาย: เผาผลาญ 1,500-1,800 kcal/สัปดาห์',
    ],
    tips_en: [
      'Cardio 3-4 days/week, 30-45 min at moderate intensity',
      'Strength training 2-3 days/week to maintain muscle',
      'Target: burn 1,500-1,800 kcal/week',
    ],
    target_min: 40,
    target_days: 4,
  },
  overweight: {
    focus_th: '🔥 เผาผลาญสูง',
    focus_en: '🔥 High Burn Cardio',
    recommended: ['running', 'cycling', 'swimming'],
    avoid:       [],
    tips_th: [
      'คาร์ดิโอเข้ม 5-6 วัน/สัปดาห์ อย่างน้อย 45 นาที',
      'วิ่งหรือปั่นจักรยานในระดับที่หายใจเร็ว แต่ยังพูดได้',
      'เป้าหมาย: เผาผลาญ 2,000-2,500 kcal/สัปดาห์',
    ],
    tips_en: [
      'Intensive cardio 5-6 days/week for at least 45 min',
      'Run or cycle at moderate-high intensity',
      'Target: burn 2,000-2,500 kcal/week',
    ],
    target_min: 45,
    target_days: 5,
  },
  obese_lv1: {
    focus_th: '🚶 เดินแล้วค่อยๆ วิ่ง',
    focus_en: '🚶 Walk → Jog Progression',
    recommended: ['walking', 'cycling', 'swimming'],
    avoid:       ['gym'],
    tips_th: [
      'เริ่มจากเดิน 30 นาที ทุกวัน ค่อยๆ เพิ่มความเร็ว',
      'ว่ายน้ำหรือปั่นจักรยาน ลดแรงกระแทกที่ข้อเข่า',
      'เป้าหมาย: เดิน/วิ่งสะสม 150 นาที/สัปดาห์',
    ],
    tips_en: [
      'Start with 30-min walks daily, gradually increase pace',
      'Swimming or cycling to reduce knee joint impact',
      'Target: 150 minutes of walking/jogging per week',
    ],
    target_min: 30,
    target_days: 5,
  },
  obese_lv2: {
    focus_th: '🚶 เดินเบาๆ ทุกวัน',
    focus_en: '🚶 Daily Light Walking',
    recommended: ['walking', 'swimming'],
    avoid:       ['running', 'gym'],
    tips_th: [
      'เดินเบาๆ 20-30 นาที/วัน ภายใต้การดูแลแพทย์',
      'หลีกเลี่ยงการออกกำลังที่หนักเกินไป เสี่ยงต่อข้อต่อ',
      'ปรึกษาแพทย์ก่อนเริ่มโปรแกรมออกกำลังกาย',
    ],
    tips_en: [
      'Light 20-30 min walk daily under medical supervision',
      'Avoid high-impact exercise to protect joints',
      'Consult your doctor before starting an exercise program',
    ],
    target_min: 20,
    target_days: 5,
  },
  obese_lv3: {
    focus_th: '🏥 ปรึกษาแพทย์ก่อน',
    focus_en: '🏥 Medical Clearance First',
    recommended: ['walking'],
    avoid:       ['running', 'cycling', 'gym'],
    tips_th: [
      'ต้องปรึกษาแพทย์ก่อนออกกำลังกายทุกชนิด',
      'เดินเบาๆ 10-15 นาที/วัน เป็นจุดเริ่มต้น',
      'เพิ่มระยะเวลาอย่างช้าๆ ทุก 2 สัปดาห์',
    ],
    tips_en: [
      'Medical consultation required before any exercise',
      'Start with 10-15 min gentle walks per day',
      'Increase duration slowly — every 2 weeks',
    ],
    target_min: 15,
    target_days: 5,
  },
};

class IntelligenceModule {
  getFoodIntel(bmiCategoryId) {
    return FOOD_INTEL[bmiCategoryId] || FOOD_INTEL.normal;
  }

  getExerciseIntel(bmiCategoryId) {
    return EXERCISE_INTEL[bmiCategoryId] || EXERCISE_INTEL.normal;
  }

  // Returns 'recommend' | 'warn' | 'neutral'
  getFoodTag(food, bmiCategoryId) {
    const intel = this.getFoodIntel(bmiCategoryId);
    if (intel.recommend.includes(food.food_id)) return 'recommend';
    if (intel.avoid.includes(food.food_id))    return 'warn';
    return 'neutral';
  }

  // Returns top N recommended food objects
  getTopRecommended(bmiCategoryId, foods, limit = 3) {
    const intel = this.getFoodIntel(bmiCategoryId);
    return intel.recommend
      .map(id => foods.find(f => f.food_id === id))
      .filter(Boolean)
      .slice(0, limit);
  }

  // Returns color class for calorie impact
  getCalorieImpact(foodCalories, netCaloriesNow, dailyGoal) {
    const after = netCaloriesNow + foodCalories;
    const pct   = after / dailyGoal;
    if (pct <= 0.85)  return 'safe';    // green
    if (pct <= 1.05)  return 'ok';      // yellow
    return 'over';                        // red
  }

  // Random tip index (deterministic per day)
  getDailyTipIndex(tips) {
    const day = new Date().getDate();
    return day % tips.length;
  }

  getTodayTip(bmiCategoryId) {
    const intel = this.getExerciseIntel(bmiCategoryId);
    const arr   = currentLang === 'en' ? intel.tips_en : intel.tips_th;
    return arr[this.getDailyTipIndex(arr)];
  }

  getExercisePreviewKcal(type, minutes) {
    const RATES = { walking: 4, running: 8, cycling: 6, swimming: 7, gym: 5 };
    return Math.round((RATES[type] || 4) * (minutes || 0));
  }

  isExerciseRecommended(type, bmiCategoryId) {
    return this.getExerciseIntel(bmiCategoryId).recommended.includes(type);
  }

  isExerciseToAvoid(type, bmiCategoryId) {
    return this.getExerciseIntel(bmiCategoryId).avoid.includes(type);
  }
}

window.intelligenceModule = new IntelligenceModule();
