// modules/marketplaceModule.js — Food marketplace data & purchase logic

const FOOD_DATA = [
  { food_id:'water_001',      category_id:'instant_snacks', name_th:'น้ำเปล่า',           name_en:'Water',              exp_cost:5,   hunger_restore:10, calories:0,   stats_bonus:{},                                  icon:'💧', rarity:'common' },
  { food_id:'candy_001',      category_id:'instant_snacks', name_th:'ลูกอม',              name_en:'Candy',              exp_cost:8,   hunger_restore:12, calories:50,  stats_bonus:{stamina:10},                         icon:'🍬', rarity:'common' },
  { food_id:'chocolate_001',  category_id:'instant_snacks', name_th:'ช็อกโกแลต',          name_en:'Chocolate',          exp_cost:12,  hunger_restore:18, calories:80,  stats_bonus:{stamina:15, intelligence:10},        icon:'🍫', rarity:'common' },
  { food_id:'banana_001',     category_id:'instant_snacks', name_th:'กล้วย',              name_en:'Banana',             exp_cost:15,  hunger_restore:22, calories:90,  stats_bonus:{health:8, stamina:10},              icon:'🍌', rarity:'common' },
  { food_id:'bread_001',      category_id:'light_meals',    name_th:'ขนมปัง',             name_en:'Bread',              exp_cost:15,  hunger_restore:20, calories:120, stats_bonus:{health:5},                          icon:'🥐', rarity:'common' },
  { food_id:'rice_001',       category_id:'light_meals',    name_th:'ข้าวสวย',            name_en:'Plain Rice',         exp_cost:20,  hunger_restore:25, calories:150, stats_bonus:{stamina:3},                         icon:'🍚', rarity:'common' },
  { food_id:'apple_001',      category_id:'light_meals',    name_th:'แอปเปิล',            name_en:'Apple',              exp_cost:10,  hunger_restore:15, calories:80,  stats_bonus:{health:10},                         icon:'🍎', rarity:'common' },
  { food_id:'salad_001',      category_id:'light_meals',    name_th:'สลัดผัก',            name_en:'Vegetable Salad',    exp_cost:18,  hunger_restore:18, calories:60,  stats_bonus:{health:15, endurance:5},            icon:'🥗', rarity:'uncommon' },
  { food_id:'rice_chicken_001',category_id:'regular_meals', name_th:'ข้าวมันไก่',          name_en:'Chicken Rice',       exp_cost:50,  hunger_restore:50, calories:450, stats_bonus:{strength:10, health:15, stamina:8}, icon:'🍗', rarity:'uncommon' },
  { food_id:'pad_thai_001',   category_id:'regular_meals',  name_th:'ผัดไทย',             name_en:'Pad Thai',           exp_cost:60,  hunger_restore:55, calories:500, stats_bonus:{strength:8, endurance:10, stamina:10},icon:'🍜', rarity:'uncommon' },
  { food_id:'fish_rice_001',  category_id:'regular_meals',  name_th:'ปลาย่างข้าว',        name_en:'Grilled Fish Rice',  exp_cost:55,  hunger_restore:52, calories:420, stats_bonus:{intelligence:15, health:12, stamina:8},icon:'🐟', rarity:'uncommon' },
  { food_id:'ramen_001',      category_id:'regular_meals',  name_th:'บะหมี่',             name_en:'Ramen',              exp_cost:50,  hunger_restore:48, calories:400, stats_bonus:{stamina:20, strength:5},            icon:'🍝', rarity:'uncommon' },
  { food_id:'set_meal_001',   category_id:'heavy_meals',    name_th:'ชุดอาหารพรีเมียม',   name_en:'Premium Meal Set',   exp_cost:100, hunger_restore:85, calories:750, stats_bonus:{strength:20, health:25, endurance:15, stamina:20}, icon:'🍽️', rarity:'rare' },
  { food_id:'steak_001',      category_id:'heavy_meals',    name_th:'สเต็ก',              name_en:'Steak',              exp_cost:120, hunger_restore:90, calories:850, stats_bonus:{strength:30, health:20, endurance:10},icon:'🥩', rarity:'rare' },
  { food_id:'all_you_can_001',category_id:'heavy_meals',    name_th:'บุฟเฟต์',            name_en:'All-You-Can-Eat',    exp_cost:150, hunger_restore:100,calories:1200,stats_bonus:{strength:25, health:30, endurance:20, stamina:25, intelligence:10},icon:'🍲', rarity:'rare' },
  { food_id:'energy_drink_001',category_id:'special_items', name_th:'เครื่องดื่มพลังงาน',  name_en:'Energy Drink',       exp_cost:40,  hunger_restore:30, calories:120, stats_bonus:{stamina:30, strength:15},           icon:'⚡', rarity:'uncommon', special_effect:'2x XP for 30 min' },
  { food_id:'lucky_meal_001', category_id:'special_items',  name_th:'อาหารเสริมโชค',      name_en:'Lucky Meal',         exp_cost:75,  hunger_restore:60, calories:350, stats_bonus:{health:20, intelligence:25},        icon:'🌟', rarity:'rare',     special_effect:'Bonus XP +25-50' },
  { food_id:'immortal_rice_001',category_id:'special_items',name_th:'ข้าวเข้มข้น',        name_en:'Eternal Rice',       exp_cost:200, hunger_restore:100,calories:600, stats_bonus:{health:50, strength:30, endurance:30, stamina:40, intelligence:20},icon:'👑', rarity:'legendary', special_effect:'All stats +100% for 3 hours' },
];

const DAILY_SPECIALS = {
  0: { food_id:'all_you_can_001', discount:0.30 }, // Sunday
  1: { food_id:'pad_thai_001',    discount:0.20 }, // Monday
  3: { food_id:'rice_chicken_001',discount:0.15 }, // Wednesday
  5: { food_id:'steak_001',       discount:0.25 }, // Friday
};

class MarketplaceModule {
  constructor() {
    this.foods = FOOD_DATA;
  }

  getAll() { return this.foods; }

  getByCategory(catId) {
    if (catId === 'all') return this.foods;
    return this.foods.filter(f => f.category_id === catId);
  }

  getFood(foodId) {
    return this.foods.find(f => f.food_id === foodId);
  }

  // Applies BMI price modifier to high-calorie foods (>200 kcal)
  getAdjustedPrice(food, bmiModifier) {
    if (food.calories > 200) {
      return Math.round(food.exp_cost * bmiModifier);
    }
    return food.exp_cost;
  }

  getTodaySpecial() {
    const day = new Date().getDay();
    return DAILY_SPECIALS[day] || null;
  }

  getSpecialPrice(food) {
    const sp = this.getTodaySpecial();
    if (!sp || sp.food_id !== food.food_id) return null;
    return Math.round(food.exp_cost * (1 - sp.discount));
  }

  // Returns { success, cost, message }
  buyFood(food, currentXP, bmiModifier) {
    const specialPrice = this.getSpecialPrice(food);
    const cost = specialPrice !== null ? specialPrice : this.getAdjustedPrice(food, bmiModifier);

    if (currentXP < cost) {
      return { success: false, cost, message: t('cant_afford') };
    }

    return { success: true, cost, food };
  }

  getFoodName(food) {
    return currentLang === 'en' ? food.name_en : food.name_th;
  }

  getBonusSummary(food) {
    const b = food.stats_bonus || {};
    const parts = Object.entries(b).map(([stat, val]) => `+${val} ${stat}`);
    return parts.join(', ');
  }
}

window.marketplaceModule = new MarketplaceModule();
