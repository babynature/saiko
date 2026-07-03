// i18n.js — Thai / English translations

const I18N = {
  th: {
    // Onboarding
    onboard_sub: 'เกมสุขภาพสำหรับนักเรียน',
    setup_title: '⚙️ ตั้งค่าตัวละคร',
    lbl_name: 'ชื่อเล่น',
    lbl_age: 'อายุ (ปี)',
    lbl_gender: 'เพศ',
    lbl_height: 'ส่วนสูง (cm)',
    lbl_weight: 'น้ำหนัก (kg)',
    lbl_activity: 'ระดับกิจกรรม',
    btn_start: 'เริ่มเกม!',
    calorie_goal: 'เป้าหมายแคลอรี่',

    // HUD
    txt_hunger: 'ความหิว',
    txt_calorie_today: 'แคลอรี่วันนี้',
    txt_buy_food: 'ซื้ออาหาร',
    txt_exercise: 'ออกกำลัง',
    txt_view_quests: 'ภารกิจ',

    // Stats
    txt_stat_health: 'สุขภาพ',
    txt_stat_strength: 'พลัง',
    txt_stat_endurance: 'ความทน',
    txt_stat_intel: 'ปัญญา',
    txt_stat_stamina: 'พลังงาน',

    // Hunger statuses
    hunger_satisfied: '😊 อิ่มมาก',
    hunger_normal: '😐 ปกติ',
    hunger_hungry: '😣 หิวข้าว',
    hunger_starving: '😵 หิวมาก!',

    // Marketplace
    marketplace_title: '🛒 ตลาดอาหาร',
    balance: 'คงเหลือ:',
    xp_unit: 'XP',
    hunger_restore: '+{n}% อิ่ม',
    duration: '{n} นาที',
    bonuses: 'บัฟ:',
    special_effect: '✨ ผลพิเศษ',
    cant_afford: 'XP ไม่พอ!',
    bought: 'ซื้อ {name} แล้ว! +{hunger}% อิ่ม',

    // Quests
    quests_title: '📋 ภารกิจประจำวัน',
    completed: 'สำเร็จ',
    xp_earned: 'XP ได้รับ',
    quest_done: '✅ สำเร็จแล้ว',
    quest_claim: 'รับรางวัล!',
    quest_claimed: 'รับแล้ว ✅',

    // Exercise
    exercise_log: '🏋️ บันทึกออกกำลัง',
    lbl_ex_type: 'ประเภท',
    lbl_ex_min: 'นาที',
    btn_log_ex: '🔥 บันทึก',
    exercise_logged: '🏋️ ออกกำลัง {min} นาที! เผาผลาญ {kcal} kcal +{xp} XP',

    // Shop
    shop_title: '🏪 ร้านค้า XP',
    balance2: 'คงเหลือ:',
    shop_owned: 'มีแล้ว',
    shop_bought: 'ซื้อ {name} แล้ว!',
    shop_no_xp: 'XP ไม่พอ',

    // Profile
    profile_title: '👤 โปรไฟล์',
    p_category: 'หมวด BMI',
    p_calorie: 'เป้าหมายแคลอรี่',
    p_level: 'เลเวล',
    p_totalxp: 'XP รวม',
    p_streak: 'Streak',
    p_playdays: 'วันที่เล่น',
    advice_title: '💡 คำแนะนำสุขภาพ',

    // Level up
    txt_levelup: '🎉 เลเวลอัพ!',
    txt_continue: 'ดำเนินต่อ',

    // Food modal
    txt_cancel: 'ยกเลิก',
    txt_buy: 'ซื้อ & กิน',

    // Nav
    nav_home: 'หน้าหลัก',
    nav_market: 'ตลาด',
    nav_quests: 'ภารกิจ',
    nav_shop: 'ร้าน',
    nav_profile: 'โปรไฟล์',

    // Titles by level
    title_1: 'ผู้เริ่มต้น',
    title_5: 'นักเรียน',
    title_10: 'ผู้ปฏิบัติ',
    title_20: 'ผู้เชี่ยวชาญ',
    title_30: 'นักโภชนาการ',
    title_50: 'เทพสุขภาพ',

    // BMI categories
    bmi_underweight: 'ต่ำเกินไป',
    bmi_normal: 'ปกติ',
    bmi_overweight: 'เกินน้ำหนัก',
    bmi_obese1: 'อ้วน ระดับ 1',
    bmi_obese2: 'อ้วน ระดับ 2',
    bmi_obese3: 'อ้วน ระดับ 3',

    // Advice
    advice_underweight: '⚠️ น้ำหนักต่ำเกินไป ควรกินอาหารพลังงานสูง เช่น ข้าว โปรตีน ไขมันดี ออกกำลังกายเบาๆ และฝึกกล้ามเนื้อเพื่อเพิ่มน้ำหนักอย่างมีสุขภาพ',
    advice_normal: '✅ น้ำหนักอยู่ในเกณฑ์ดีเยี่ยม! คงระดับนี้ไว้ด้วยการกินอาหารสมดุล ออกกำลังกาย 3-4 วัน/สัปดาห์ และนอนหลับให้เพียงพอ',
    advice_overweight: '⚠️ น้ำหนักเกินเกณฑ์เล็กน้อย แนะนำลดอาหารแคลอรี่สูง เพิ่มการออกกำลังกายคาร์ดิโอ และกินผักผลไม้มากขึ้น',
    advice_obese1: '🔴 น้ำหนักเกินมีความเสี่ยงต่อสุขภาพ ควรลดแคลอรี่อย่างน้อย 500 kcal/วัน ออกกำลังกายเป็นประจำ และปรึกษาผู้เชี่ยวชาญด้านโภชนาการ',
    advice_obese2: '🚨 อยู่ในระดับอันตราย! แนะนำพบแพทย์และนักโภชนาการ ลดแคลอรี่อย่างเข้มงวด และเริ่มออกกำลังกายเบาๆ ภายใต้การดูแล',
    advice_obese3: '🆘 สภาวะฉุกเฉิน! ควรพบแพทย์ทันที เพื่อรับการรักษาและวางแผนลดน้ำหนักอย่างปลอดภัย',

    // Errors
    err_name: 'กรุณาใส่ชื่อ (1-20 ตัวอักษร)',
    err_age: 'กรุณากรอกอายุ (5-100 ปี)',
    err_height: 'ส่วนสูงต้องอยู่ระหว่าง 100-220 cm',
    err_weight: 'น้ำหนักต้องอยู่ระหว่าง 20-200 kg',

    // Streak
    streak_milestone: '🔥 ยอดเยี่ยม! Streak {days} วัน! +{xp} XP',

    // Sleep & Fatigue
    txt_fatigue: 'ความล้า',
    fatigue_great: '😊 พักผ่อนดีเยี่ยม',
    fatigue_good: '😐 พักผ่อนพอ',
    fatigue_tired: '😴 เริ่มล้า',
    fatigue_very_tired: '😫 ล้ามาก',
    fatigue_exhausted: '💀 หมดแรง',
    sleep_modal_title: '😴 บันทึกการนอนหลับ',
    lbl_sleep_hours: 'ชั่วโมงที่นอนคืนนี้',
    lbl_sleep_quality: 'คุณภาพการนอน',
    opt_sleep_good: '😊 ดี — หลับสนิทตลอดคืน',
    opt_sleep_normal: '😐 ปกติ',
    opt_sleep_poor: '😟 ไม่ดี — ฝันร้าย/ตื่นกลางดึก',
    txt_log_sleep: 'บันทึกนอน',
    txt_save: 'บันทึก',

    // Stress
    txt_stress: 'ความเครียด',
    stress_calm: '😊 ผ่อนคลาย',
    stress_mid: '😐 เครียดเล็กน้อย',
    stress_high: '😰 เครียดมาก',
    stress_burnout: '🔴 เบิร์นเอาต์!',

    // Life Events
    txt_life_events: 'เหตุการณ์',
    life_event_title: '📅 เหตุการณ์ชีวิตนักเรียน',
    life_event_sub: 'เลือกเหตุการณ์ที่กำลังเกิดขึ้น',
    btn_close_event: '✅ ปิด',

    // Water Log
    txt_log_water: 'บันทึกน้ำ',
    water_logged: '💧 ดื่มน้ำ 1 แก้ว! +{xp} XP',

    // Wardrobe
    wardrobe_title: '🎨 ตู้เสื้อผ้า',
    wardrobe_owned: 'ไอเทมที่มี',
    wardrobe_empty: 'ยังไม่มีของตกแต่ง — ซื้อที่ร้านค้า 🏪',

    // Weight Tracking (Phase 2)
    txt_weight_section: 'ติดตามน้ำหนัก',
    txt_log_weight: 'บันทึก',
    txt_wstat_current: 'ปัจจุบัน',
    txt_wstat_start: 'เริ่มต้น',
    txt_wstat_change: 'เปลี่ยน',
    txt_wstat_trend: 'แนวโน้ม',
    weight_modal_title: '⚖️ บันทึกน้ำหนัก',
    lbl_weight_log: 'น้ำหนัก (kg)',
    txt_weight_save: 'บันทึก',
    p_weight: 'น้ำหนัก',
    weight_logged: '⚖️ น้ำหนัก {w} kg • BMI {bmi} {arrow}',

    // Achievements (Phase 2)
    txt_achievements: 'ความสำเร็จ',
    txt_ach_all: 'ทั้งหมด',
    txt_ach_unlocked: '✅ ได้แล้ว',
    txt_ach_locked: '🔒 ยังไม่ได้',

    // Mission Board + Gear (Phase 8)
    txt_missions_title:  '🌟 ภารกิจพิเศษวันนี้',
    txt_missions_reset:  'รีเซ็ตเที่ยงคืน',
    txt_mission_chest:   'ครบทุกภารกิจ!',
    txt_chest_claim:     'รับ {xp} XP',
    txt_chest_claimed:   '✅ รับแล้ว',
    txt_gear_title:      '⚙️ อุปกรณ์',
    txt_gear_buy:        'ซื้อ',
    txt_gear_equip:      '✓ สวมใส่',
    txt_gear_unequip:    'ถอดออก',
    txt_gear_equipped:   'กำลังใช้',
    txt_mission_done:    '✅ สำเร็จ!',
    txt_mission_new:     '🌟 ภารกิจสำเร็จ! +{xp} XP',
    txt_mission_all_done:'🎉 ครบทุกภารกิจ!',

    // Polish — Today at a Glance (Phase 7)
    txt_glance_title: 'วันนี้ในภาพรวม',
    txt_glance_cal: 'แคลอรี่',
    txt_glance_sleep: 'นอน',
    txt_glance_ex: 'ออกกำลัง',
    txt_glance_water: 'น้ำ',
    txt_glance_quests: 'เควสต์',
    txt_glance_weight: 'น้ำหนัก',

    // Firebase Auth + Cloud (Phase 6)
    txt_lb_title: 'อันดับชั้นเรียน',
    txt_signout: 'ออกจากระบบ',
    cloud_synced: 'ซิงค์แล้ว',
    cloud_syncing: 'กำลังซิงค์...',
    cloud_error: 'ซิงค์ล้มเหลว',

    // Export & Backup (Phase 5)
    txt_export_title: 'ส่งออกข้อมูล',
    txt_export_csv: 'CSV ประวัติ',
    txt_export_csv_sub: '7 วันล่าสุด',
    txt_export_json: 'สำรองข้อมูล',
    txt_export_json_sub: 'ไฟล์ .json',
    txt_import_json: 'นำเข้า',
    txt_import_json_sub: 'กู้คืนข้อมูล',
    txt_copy_card: 'คัดลอกรายงาน',
    txt_copy_card_sub: 'แชร์ได้เลย',

    // Food & Exercise Intelligence (Phase 4)
    txt_rec_title: 'แนะนำสำหรับคุณ',
    txt_ex_tip_title: 'ทิปออกกำลังกายวันนี้',
    ex_preview_label: 'ประมาณ',

    // History & Analytics (Phase 3)
    week_summary: 'สรุปสัปดาห์นี้',
    ws_avg_cal: 'แคลอรี่เฉลี่ย',
    ws_avg_sleep: 'นอนเฉลี่ย',
    ws_total_ex: 'ออกกำลัง',
    ws_quest_days: 'วันครบภารกิจ',
    analytics_title: 'กราฟ 7 วัน',
    atab_cal: '🍽️ แคล',
    atab_sleep: '😴 นอน',
    atab_ex: '🏃 ออกกำลัง',
    no_history: 'ยังไม่มีข้อมูล — เล่นต่อไปนะ!',

    // Quest names (override from JSON for localization)
    q_log_meals_name: 'บันทึกอาหาร',
    q_log_meals_desc: 'บันทึกอาหารอย่างน้อย 3 มื้อในวัน',
    q_stay_within_name: 'อยู่ในเป้าหมาย',
    q_stay_within_desc: 'รักษาแคลอรี่ไม่เกินเป้าหมายรายวัน',
    q_exercise_name: 'ท้าทายออกกำลัง',
    q_exercise_desc: 'เผาแคลอรี่ 300 kcal ผ่านการออกกำลังกาย',
    q_drink_water_name: 'ดื่มน้ำให้เพียงพอ',
    q_drink_water_desc: 'ดื่มน้ำอย่างน้อย 8 แก้วในวัน',
    q_balance_name: 'สมดุลมื้ออาหาร',
    q_balance_desc: 'กินอาหาร 3 มื้อ (เช้า กลาง เย็น)',
  },

  en: {
    onboard_sub: 'Health Gamification for Students',
    setup_title: '⚙️ Create Character',
    lbl_name: 'Nickname',
    lbl_age: 'Age (years)',
    lbl_gender: 'Gender',
    lbl_height: 'Height (cm)',
    lbl_weight: 'Weight (kg)',
    lbl_activity: 'Activity Level',
    btn_start: 'Start Game!',
    calorie_goal: 'Calorie Goal',

    txt_hunger: 'Hunger',
    txt_calorie_today: 'Today\'s Calories',
    txt_buy_food: 'Buy Food',
    txt_exercise: 'Exercise',
    txt_view_quests: 'Quests',

    txt_stat_health: 'Health',
    txt_stat_strength: 'Strength',
    txt_stat_endurance: 'Endurance',
    txt_stat_intel: 'Intelligence',
    txt_stat_stamina: 'Stamina',

    hunger_satisfied: '😊 Full',
    hunger_normal: '😐 Normal',
    hunger_hungry: '😣 Hungry',
    hunger_starving: '😵 Starving!',

    marketplace_title: '🛒 Food Marketplace',
    balance: 'Balance:',
    xp_unit: 'XP',
    hunger_restore: '+{n}% Hunger',
    duration: '{n} min',
    bonuses: 'Buffs:',
    special_effect: '✨ Special Effect',
    cant_afford: 'Not enough XP!',
    bought: 'Bought {name}! +{hunger}% Hunger',

    quests_title: '📋 Daily Quests',
    completed: 'Completed',
    xp_earned: 'XP Earned',
    quest_done: '✅ Done',
    quest_claim: 'Claim!',
    quest_claimed: 'Claimed ✅',

    exercise_log: '🏋️ Log Exercise',
    lbl_ex_type: 'Type',
    lbl_ex_min: 'Minutes',
    btn_log_ex: '🔥 Log',
    exercise_logged: '🏋️ Exercised {min} min! Burned {kcal} kcal +{xp} XP',

    shop_title: '🏪 XP Shop',
    balance2: 'Balance:',
    shop_owned: 'Owned',
    shop_bought: 'Bought {name}!',
    shop_no_xp: 'Not enough XP',

    profile_title: '👤 Profile',
    p_category: 'BMI Category',
    p_calorie: 'Calorie Goal',
    p_level: 'Level',
    p_totalxp: 'Total XP',
    p_streak: 'Streak',
    p_playdays: 'Days Played',
    advice_title: '💡 Health Advice',

    txt_levelup: '🎉 Level Up!',
    txt_continue: 'Continue',
    txt_cancel: 'Cancel',
    txt_buy: 'Buy & Eat',

    nav_home: 'Home',
    nav_market: 'Market',
    nav_quests: 'Quests',
    nav_shop: 'Shop',
    nav_profile: 'Profile',

    title_1: 'Beginner',
    title_5: 'Student',
    title_10: 'Practitioner',
    title_20: 'Expert',
    title_30: 'Nutritionist',
    title_50: 'Wellness Deity',

    bmi_underweight: 'Underweight',
    bmi_normal: 'Normal Weight',
    bmi_overweight: 'Overweight',
    bmi_obese1: 'Obese Lv.1',
    bmi_obese2: 'Obese Lv.2',
    bmi_obese3: 'Obese Lv.3',

    advice_underweight: '⚠️ Underweight — Eat calorie-dense foods: rice, protein, healthy fats. Do light strength training to build muscle mass healthily.',
    advice_normal: '✅ Excellent BMI! Maintain with balanced meals, exercise 3-4x/week, and adequate sleep.',
    advice_overweight: '⚠️ Slightly overweight — Reduce high-calorie foods, increase cardio exercise, and eat more vegetables and fruits.',
    advice_obese1: '🔴 Weight poses health risks. Reduce 500 kcal/day, exercise regularly, consult a nutritionist.',
    advice_obese2: '🚨 Dangerous level! See a doctor and dietitian. Strict calorie reduction and supervised light exercise.',
    advice_obese3: '🆘 Emergency! See a doctor immediately for safe weight loss treatment and planning.',

    err_name: 'Please enter a name (1-20 characters)',
    err_age: 'Please enter age (5-100)',
    err_height: 'Height must be 100-220 cm',
    err_weight: 'Weight must be 20-200 kg',

    streak_milestone: '🔥 Amazing! {days}-day Streak! +{xp} XP',

    // Sleep & Fatigue
    txt_fatigue: 'Fatigue',
    fatigue_great: '😊 Well Rested',
    fatigue_good: '😐 Decent Rest',
    fatigue_tired: '😴 Getting Tired',
    fatigue_very_tired: '😫 Very Tired',
    fatigue_exhausted: '💀 Exhausted',
    sleep_modal_title: '😴 Log Sleep',
    lbl_sleep_hours: 'Hours Slept Last Night',
    lbl_sleep_quality: 'Sleep Quality',
    opt_sleep_good: '😊 Good — Slept well all night',
    opt_sleep_normal: '😐 Normal',
    opt_sleep_poor: '😟 Poor — Nightmares / woke up',
    txt_log_sleep: 'Log Sleep',
    txt_save: 'Save',

    // Stress
    txt_stress: 'Stress',
    stress_calm: '😊 Calm',
    stress_mid: '😐 Mildly Stressed',
    stress_high: '😰 High Stress',
    stress_burnout: '🔴 Burnout!',

    // Life Events
    txt_life_events: 'Life Events',
    life_event_title: '📅 Student Life Events',
    life_event_sub: 'Select an event that is happening',
    btn_close_event: '✅ Close',

    // Water Log
    txt_log_water: 'Log Water',
    water_logged: '💧 Logged 1 glass of water! +{xp} XP',

    // Wardrobe
    wardrobe_title: '🎨 Wardrobe',
    wardrobe_owned: 'Your Items',
    wardrobe_empty: 'No cosmetics yet — buy from Shop 🏪',

    // Weight Tracking (Phase 2)
    txt_weight_section: 'Weight Tracker',
    txt_log_weight: 'Log',
    txt_wstat_current: 'Current',
    txt_wstat_start: 'Start',
    txt_wstat_change: 'Change',
    txt_wstat_trend: 'Trend',
    weight_modal_title: '⚖️ Log Weight',
    lbl_weight_log: 'Weight (kg)',
    txt_weight_save: 'Save',
    p_weight: 'Weight',
    weight_logged: '⚖️ Weight {w} kg • BMI {bmi} {arrow}',

    // Achievements (Phase 2)
    txt_achievements: 'Achievements',
    txt_ach_all: 'All',
    txt_ach_unlocked: '✅ Unlocked',
    txt_ach_locked: '🔒 Locked',

    // Mission Board + Gear (Phase 8)
    txt_missions_title:  '🌟 Daily Special Missions',
    txt_missions_reset:  'Resets at midnight',
    txt_mission_chest:   'All missions done!',
    txt_chest_claim:     'Claim {xp} XP',
    txt_chest_claimed:   '✅ Claimed',
    txt_gear_title:      '⚙️ Equipment',
    txt_gear_buy:        'Buy',
    txt_gear_equip:      '✓ Equip',
    txt_gear_unequip:    'Unequip',
    txt_gear_equipped:   'Equipped',
    txt_mission_done:    '✅ Done!',
    txt_mission_new:     '🌟 Mission done! +{xp} XP',
    txt_mission_all_done:'🎉 All missions complete!',

    // Polish — Today at a Glance (Phase 7)
    txt_glance_title: 'Today at a Glance',
    txt_glance_cal: 'Calories',
    txt_glance_sleep: 'Sleep',
    txt_glance_ex: 'Exercise',
    txt_glance_water: 'Water',
    txt_glance_quests: 'Quests',
    txt_glance_weight: 'Weight',

    // Firebase Auth + Cloud (Phase 6)
    txt_lb_title: 'Class Leaderboard',
    txt_signout: 'Sign Out',
    cloud_synced: 'Synced',
    cloud_syncing: 'Syncing...',
    cloud_error: 'Sync failed',

    // Export & Backup (Phase 5)
    txt_export_title: 'Export Data',
    txt_export_csv: 'CSV History',
    txt_export_csv_sub: 'Last 30 days',
    txt_export_json: 'Backup Save',
    txt_export_json_sub: '.json file',
    txt_import_json: 'Import',
    txt_import_json_sub: 'Restore data',
    txt_copy_card: 'Copy Report',
    txt_copy_card_sub: 'Share instantly',

    // Food & Exercise Intelligence (Phase 4)
    txt_rec_title: 'Recommended for You',
    txt_ex_tip_title: 'Today\'s Exercise Tip',
    ex_preview_label: 'Est.',

    // History & Analytics (Phase 3)
    week_summary: 'This Week\'s Summary',
    ws_avg_cal: 'Avg Calories',
    ws_avg_sleep: 'Avg Sleep',
    ws_total_ex: 'Exercise',
    ws_quest_days: 'Quest Days',
    analytics_title: '7-Day Chart',
    atab_cal: '🍽️ Cal',
    atab_sleep: '😴 Sleep',
    atab_ex: '🏃 Exercise',
    no_history: 'No data yet — keep playing!',

    q_log_meals_name: 'Log Meals',
    q_log_meals_desc: 'Log at least 3 meals today',
    q_stay_within_name: 'Stay Within Goal',
    q_stay_within_desc: 'Keep calories within your daily target',
    q_exercise_name: 'Exercise Challenge',
    q_exercise_desc: 'Burn 300+ calories through exercise',
    q_drink_water_name: 'Stay Hydrated',
    q_drink_water_desc: 'Drink at least 8 glasses of water today',
    q_balance_name: 'Balanced Meals',
    q_balance_desc: 'Eat 3 meals (breakfast, lunch, dinner)',
  }
};

let currentLang = 'th';

function t(key, vars = {}) {
  let str = (I18N[currentLang] || I18N.th)[key] || key;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  });
  return str;
}

function setLang(lang) {
  currentLang = lang;
  document.getElementById('btn-lang-th').classList.toggle('active', lang === 'th');
  document.getElementById('btn-lang-en').classList.toggle('active', lang === 'en');
  applyTranslations();
  localStorage.setItem('shg-lang', lang);
}

function toggleLang() {
  setLang(currentLang === 'th' ? 'en' : 'th');
}

function applyTranslations() {
  const map = {
    'txt-onboard-sub': 'onboard_sub',
    'txt-setup-title': 'setup_title',
    'lbl-name': 'lbl_name',
    'lbl-age': 'lbl_age',
    'lbl-gender': 'lbl_gender',
    'lbl-height': 'lbl_height',
    'lbl-weight': 'lbl_weight',
    'lbl-activity': 'lbl_activity',
    'txt-btn-start': 'btn_start',
    'txt-hunger': 'txt_hunger',
    'txt-calorie-today': 'txt_calorie_today',
    'txt-buy-food': 'txt_buy_food',
    'txt-exercise': 'txt_exercise',
    'txt-view-quests': 'txt_view_quests',
    'txt-stat-health': 'txt_stat_health',
    'txt-stat-strength': 'txt_stat_strength',
    'txt-stat-endurance': 'txt_stat_endurance',
    'txt-stat-intel': 'txt_stat_intel',
    'txt-stat-stamina': 'txt_stat_stamina',
    'txt-marketplace-title': 'marketplace_title',
    'txt-balance': 'balance',
    'txt-balance2': 'balance2',
    'txt-quests-title': 'quests_title',
    'txt-completed': 'completed',
    'txt-xp-earned': 'xp_earned',
    'txt-exercise-log': 'exercise_log',
    'lbl-ex-type': 'lbl_ex_type',
    'lbl-ex-min': 'lbl_ex_min',
    'btn-log-ex': 'btn_log_ex',
    'txt-shop-title': 'shop_title',
    'txt-profile-title': 'profile_title',
    'txt-p-category': 'p_category',
    'txt-p-calorie': 'p_calorie',
    'txt-p-level': 'p_level',
    'txt-p-totalxp': 'p_totalxp',
    'txt-p-streak': 'p_streak',
    'txt-p-playdays': 'p_playdays',
    'txt-advice-title': 'advice_title',
    'txt-levelup': 'txt_levelup',
    'txt-continue': 'txt_continue',
    'txt-cancel': 'txt_cancel',
    'txt-buy': 'txt_buy',
    'txt-nav-home': 'nav_home',
    'txt-nav-market': 'nav_market',
    'txt-nav-quests': 'nav_quests',
    'txt-nav-shop': 'nav_shop',
    'txt-nav-profile': 'nav_profile',
    // Phase 1.5
    'txt-fatigue': 'txt_fatigue',
    'txt-stress': 'txt_stress',
    'txt-log-sleep': 'txt_log_sleep',
    'txt-log-water': 'txt_log_water',
    'txt-life-events': 'txt_life_events',
    'txt-sleep-modal-title': 'sleep_modal_title',
    'lbl-sleep-hours': 'lbl_sleep_hours',
    'lbl-sleep-quality': 'lbl_sleep_quality',
    'opt-sleep-good': 'opt_sleep_good',
    'opt-sleep-normal': 'opt_sleep_normal',
    'opt-sleep-poor': 'opt_sleep_poor',
    'txt-life-event-title': 'life_event_title',
    'txt-life-event-sub': 'life_event_sub',
    'btn-close-event': 'btn_close_event',
    'txt-wardrobe': 'wardrobe_title',
    'txt-owned-items': 'wardrobe_owned',
    'txt-sleep-save': 'txt_save',
    // Phase 2 — Weight
    'txt-weight-section': 'txt_weight_section',
    'txt-log-weight': 'txt_log_weight',
    'txt-wstat-current': 'txt_wstat_current',
    'txt-wstat-start': 'txt_wstat_start',
    'txt-wstat-change': 'txt_wstat_change',
    'txt-wstat-trend': 'txt_wstat_trend',
    'txt-weight-modal-title': 'weight_modal_title',
    'lbl-weight-log': 'lbl_weight_log',
    'txt-weight-save': 'txt_weight_save',
    'txt-p-weight': 'p_weight',
    // Phase 2 — Achievements
    'txt-achievements': 'txt_achievements',
    'txt-ach-all': 'txt_ach_all',
    'txt-ach-unlocked': 'txt_ach_unlocked',
    'txt-ach-locked': 'txt_ach_locked',
    // Phase 7 — Glance
    'txt-glance-title':  'txt_glance_title',
    'txt-glance-cal':    'txt_glance_cal',
    'txt-glance-sleep':  'txt_glance_sleep',
    'txt-glance-ex':     'txt_glance_ex',
    'txt-glance-water':  'txt_glance_water',
    'txt-glance-quests': 'txt_glance_quests',
    'txt-glance-weight': 'txt_glance_weight',
    // Phase 8 — Missions & Gear
    'txt-missions-title': 'txt_missions_title',
    'txt-missions-reset': 'txt_missions_reset',
    'txt-mission-chest':  'txt_mission_chest',
    'txt-gear-title':     'txt_gear_title',
    // Phase 6 — Firebase
    'txt-lb-title':  'txt_lb_title',
    'txt-signout':   'txt_signout',
    // Phase 5 — Export
    'txt-export-title': 'txt_export_title',
    'txt-export-csv': 'txt_export_csv',
    'txt-export-csv-sub': 'txt_export_csv_sub',
    'txt-export-json': 'txt_export_json',
    'txt-export-json-sub': 'txt_export_json_sub',
    'txt-import-json': 'txt_import_json',
    'txt-import-json-sub': 'txt_import_json_sub',
    'txt-copy-card': 'txt_copy_card',
    'txt-copy-card-sub': 'txt_copy_card_sub',
    // Phase 4 — Food & Exercise Intelligence
    'txt-rec-title': 'txt_rec_title',
    // Phase 3 — Weekly Summary & Analytics
    'txt-week-summary': 'week_summary',
    'txt-ws-avg-cal': 'ws_avg_cal',
    'txt-ws-avg-sleep': 'ws_avg_sleep',
    'txt-ws-total-ex': 'ws_total_ex',
    'txt-ws-quest-days': 'ws_quest_days',
    'txt-analytics-title': 'analytics_title',
    'atab-cal': 'atab_cal',
    'atab-sleep': 'atab_sleep',
    'atab-ex': 'atab_ex',
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  });
  if (window.renderAll) window.renderAll();
}
