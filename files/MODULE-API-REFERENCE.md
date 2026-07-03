# MODULE API REFERENCE & DOCUMENTATION
## All Game Modules - Complete Method Reference

**Status:** Developer Reference  
**Version:** 1.0  
**Date:** 2026-07-03

---

## 🎮 GAME MODULES OVERVIEW

```
Game Architecture:
┌─────────────────────────────────────┐
│ app.js (Main Loop)                  │
├─────────────────────────────────────┤
│ ├─ bmiModule: Calculate BMI         │
│ ├─ characterModule: Sam state       │
│ ├─ hungerModule: Hunger meter       │
│ ├─ marketplaceModule: Food shop     │
│ ├─ questModule: Daily quests        │
│ ├─ xpModule: Experience & levels    │
│ ├─ streakModule: Daily streaks      │
│ ├─ calorieModule: Calorie tracker   │
│ ├─ cosmeticsModule: Cosmetics       │
│ ├─ healthModule: Sleep/Stress       │
│ ├─ lifeEventsModule: Events         │
│ └─ realWorldIntegrationModule: API  │
└─────────────────────────────────────┘
```

---

## 📚 MODULE 1: BMI MODULE

### Class Definition
```javascript
class BMIModule {
  constructor()
  loadDatabase()
  calculateBMI(heightCm, weightKg)
  getBMICategory(bmi)
  calculateDailyCalorie(age, height, weight, gender, activity)
  getFoodPriceModifier(bmi)
  getExerciseRecommendations(category)
}
```

### Methods

#### `calculateBMI(heightCm, weightKg)`
```javascript
// Input: height in cm, weight in kg
// Output: BMI value (number)
// Formula: BMI = weight / (height_m)²

const bmi = bmiModule.calculateBMI(170, 50);
console.log(bmi);  // 17.24 (Underweight)
```

#### `getBMICategory(bmi)`
```javascript
// Input: BMI value
// Output: Category string
// Possible values: 'underweight', 'normal', 'overweight', 
//                  'obese_lv1', 'obese_lv2', 'obese_lv3'

const category = bmiModule.getBMICategory(19.5);
console.log(category);  // 'normal'
```

#### `calculateDailyCalorie(age, heightCm, weightKg, gender, activity)`
```javascript
// Input: User demographics + activity level
// Output: Daily calorie target (number)
// Activity: 'sedentary' | 'light' | 'moderate' | 'active'

const dailyCalorie = bmiModule.calculateDailyCalorie(16, 170, 50, 'M', 'moderate');
console.log(dailyCalorie);  // 1850 kcal
```

#### `getFoodPriceModifier(bmi)`
```javascript
// Input: BMI value
// Output: Price multiplier (0.8 - 2.0)
// Higher BMI = more expensive high-calorie foods

const modifier = bmiModule.getFoodPriceModifier(25.5);
console.log(modifier);  // 1.2 (20% more expensive)

// Apply to food price:
const foodPrice = 50 * modifier;  // 60 EXP
```

---

## 🧑 MODULE 2: CHARACTER MODULE

### Class Definition
```javascript
class CharacterModule {
  constructor()
  updateCharacterSize(bmi)
  addExp(amount)
  checkLevelUp()
  getEmotion(hungerPercent)
  equipCosmetic(type, itemId)
  getCharacterStatus()
  saveCharacter()
}
```

### Character Object Structure
```javascript
character.character = {
  name: 'Sam',
  level: 1,
  exp: 0,
  health: 80,
  strength: 50,
  endurance: 50,
  intelligence: 60,
  stamina: 60,
  weight: 50,
  bmi: 17.3,
  size: 100,  // 90-130% based on BMI
  cosmetics: {
    clothing: 'school-uniform',
    accessories: [],
    hair: 'black-normal'
  }
}
```

### Methods

#### `updateCharacterSize(bmi)`
```javascript
// Input: BMI value
// Output: Updates character.size (90-130%)
// Formula: size = 100 + (bmi - 21.5) * 3

character.updateCharacterSize(19.5);
console.log(character.character.size);  // 91% (smaller)

character.updateCharacterSize(25.0);
console.log(character.character.size);  // 110% (larger)
```

#### `addExp(amount)`
```javascript
// Input: XP amount to add
// Output: Updates character.exp, checks levelup

character.addExp(50);
// If level up occurs, triggers onLevelUp()
```

#### `getEmotion(hungerPercent)`
```javascript
// Input: Hunger percentage (0-100)
// Output: Emotion string
// Returns: 'happy' | 'normal' | 'sad' | 'distressed'

const emotion = character.getEmotion(75);
console.log(emotion);  // 'happy'
```

#### `equipCosmetic(type, itemId)`
```javascript
// Input: Cosmetic type + item ID
// Types: 'clothing' | 'accessories' | 'hair'
// Output: Updates character cosmetics

character.equipCosmetic('clothing', 'gym-outfit');
character.equipCosmetic('hair', 'blue-hair');
```

---

## 🍽️ MODULE 3: HUNGER MODULE

### Class Definition
```javascript
class HungerModule {
  constructor(character)
  updateHunger(minutesElapsed, activity)
  applyHungerEffects()
  eatFood(foodItem)
  getHungerStatus()
  getEffectiveStats()
}
```

### Properties
```javascript
hunger.hunger = 50;      // Current hunger (0-100%)
hunger.drainRate = 0.5;  // Base drain per minute
hunger.effectiveStats = {};  // Stats with hunger multiplier
```

### Methods

#### `updateHunger(minutesElapsed, activity)`
```javascript
// Input: Time elapsed (minutes) + activity type
// Activity: 'rest' | 'questing' | 'exercise'
// Output: Updates hunger meter, applies effects

hunger.updateHunger(10, 'rest');      // -5% hunger
hunger.updateHunger(10, 'questing');  // -10% hunger
hunger.updateHunger(10, 'exercise');  // -20% hunger
```

#### `eatFood(foodItem)`
```javascript
// Input: Food object from marketplace
// Output: Updates hunger + stats, returns message

const food = foodMarketplace.getFood('chicken-rice');
const message = hunger.eatFood(food);
console.log(message);  // "Ate Chicken Rice! Hunger +50"

// Food item structure:
// {
//   id: 'chicken-rice',
//   name: 'Chicken Rice',
//   hungerRestore: 50,
//   bonuses: { health: 15, strength: 10 }
// }
```

#### `getHungerStatus()`
```javascript
// Output: Status string based on hunger level
// Returns: 'satisfied' | 'normal' | 'hungry' | 'starving'

console.log(hunger.getHungerStatus());  // 'satisfied'
```

#### `getEffectiveStats()`
```javascript
// Output: Character stats with hunger multiplier applied
// Hunger affects all stats from 0.5x (starving) to 1.1x (satisfied)

const stats = hunger.getEffectiveStats();
console.log(stats.health);  // 88 (if hunger is satisfied: 80 * 1.1)
```

---

## 🛒 MODULE 4: MARKETPLACE MODULE

### Class Definition
```javascript
class MarketplaceModule {
  constructor()
  loadDatabase()
  getFoodsByCategory(category)
  getFood(foodId)
  calculateFoodPrice(foodId, bmiPriceModifier)
  canAfford(foodId, currentExp)
  buyFood(foodId, currentExp, bmiModifier)
  getDailySpecials()
  getRecommendedFood(hungerPercent, currentExp)
}
```

### Methods

#### `getFoodsByCategory(category)`
```javascript
// Input: Category string
// Categories: 'light-meals' | 'regular-meals' | 'heavy-meals' | 
//             'special-items' | 'instant-snacks'
// Output: Array of food items

const foods = marketplace.getFoodsByCategory('light-meals');
console.log(foods);  // [water, salad, ...]
```

#### `calculateFoodPrice(foodId, bmiPriceModifier)`
```javascript
// Input: Food ID + BMI price modifier
// Output: Adjusted price in EXP

const basePrice = 50;
const modifier = 1.2;  // Overweight modifier
const finalPrice = marketplace.calculateFoodPrice('chicken-rice', modifier);
console.log(finalPrice);  // 60 EXP (50 * 1.2)
```

#### `buyFood(foodId, currentExp, bmiModifier)`
```javascript
// Input: Food ID, current EXP, BMI modifier
// Output: { success, newExp, message }

const result = marketplace.buyFood('chicken-rice', 100, 1.0);
if (result.success) {
  console.log(result.message);  // "Bought Chicken Rice!"
  currentExp = result.newExp;
} else {
  console.log(result.message);  // "Not enough EXP"
}
```

#### `getDailySpecials()`
```javascript
// Output: Array of special items on sale today
// Structure: { foodId, discount }

const specials = marketplace.getDailySpecials();
console.log(specials);
// [
//   { foodId: 'pad-thai', discount: 0.2 },  // -20%
//   { foodId: 'chicken-rice', discount: 0.15 }  // -15%
// ]
```

---

## 📋 MODULE 5: QUEST MODULE

### Class Definition
```javascript
class QuestModule {
  constructor()
  loadDatabase()
  getDailyQuests()
  getQuestProgress(questId)
  updateQuestProgress(questId, progress)
  completeQuest(questId)
  getCompletedCount()
  resetDailyQuests()
}
```

### Quest Types
```javascript
// From blueprint:
// Type: 'count' - Log X of something
// Type: 'threshold' - Reach X value
// Type: 'burn_calories' - Burn X kcal
```

### Methods

#### `getDailyQuests()`
```javascript
// Output: Array of 5 daily quests for today

const quests = questModule.getDailyQuests();
// [
//   { id: 'log-meals', name: 'Log Meals', goal: 3, progress: 0, reward: 50 },
//   { id: 'stay-within-goal', name: 'Stay Within Calorie Goal', goal: 1850, progress: 950, reward: 100 },
//   ...
// ]
```

#### `updateQuestProgress(questId, progress)`
```javascript
// Input: Quest ID + new progress value
// Output: Updates quest progress

questModule.updateQuestProgress('log-meals', 1);  // Logged 1 meal
questModule.updateQuestProgress('stay-within-goal', 950);  // 950 kcal logged
```

#### `completeQuest(questId)`
```javascript
// Input: Quest ID
// Output: { success, xpReward, message }

const result = questModule.completeQuest('log-meals');
if (result.success) {
  console.log(result.message);  // "Quest completed!"
  characterExp += result.xpReward;  // Add 50 XP
}
```

---

## ⭐ MODULE 6: XP MODULE

### Class Definition
```javascript
class XPModule {
  constructor(characterModule)
  addXP(amount)
  getXPRequired(level)
  getXPProgress(level)
  getTitleByLevel(level)
  getMilestoneRewards(daysCompleted)
}
```

### Methods

#### `getXPRequired(level)`
```javascript
// Input: Level number
// Output: Total XP needed to reach that level
// Formula: (level * 1000) + (level² * 200)

const xpNeeded = xpModule.getXPRequired(5);
console.log(xpNeeded);  // 7500 (total XP to reach level 5)
```

#### `getTitleByLevel(level)`
```javascript
// Input: Level
// Output: Title string
// Progression: Beginner → Student → Nutritionist → Master → Health Deity

console.log(xpModule.getTitleByLevel(1));   // 'Beginner'
console.log(xpModule.getTitleByLevel(15));  // 'Student'
console.log(xpModule.getTitleByLevel(30));  // 'Nutritionist'
console.log(xpModule.getTitleByLevel(50));  // 'Health Deity'
```

---

## 📊 MODULE 7: STREAK MODULE

### Class Definition
```javascript
class StreakModule {
  constructor()
  updateStreak(questsCompletedToday)
  getStreakBonus()
  getStreakMilestones()
  hasStreakBroken()
  resetStreak()
}
```

### Methods

#### `updateStreak(questsCompletedToday)`
```javascript
// Input: Number of quests completed today
// Output: Updates streak (needs 2+ quests to count)

streak.updateStreak(3);  // 3 quests done → streak +1
streak.updateStreak(1);  // Only 1 quest → streak broken

const currentStreak = streak.currentStreak;  // e.g., 12 days
```

#### `getStreakBonus()`
```javascript
// Output: XP bonus based on current streak
// Formula: 10 × streak_days (capped at 100)

const bonus = streak.getStreakBonus();
console.log(bonus);  // 120 XP (for 12-day streak, capped at 100)
```

#### `getStreakMilestones()`
```javascript
// Output: Array of completed milestones
// Milestones at: 7, 14, 30, 100, 365 days

const milestones = streak.getStreakMilestones();
// ['7-day', '14-day']  (if current streak is 14)
```

---

## 💚 MODULE 8: HEALTH MODULE (NEW)

### Class Definition
```javascript
class HealthModule {
  constructor(character, hunger)
  logSleep(hours)
  updateFatigue(minutesAwake)
  updateStress(delta)
  doRelaxationActivity(activity)
  getHealthScore()
  applyHealthBonuses()
}
```

### Methods

#### `logSleep(hours)`
```javascript
// Input: Hours of sleep
// Output: Updates fatigue, applies bonuses

healthModule.logSleep(8);  // Good sleep
// Next day: +10% XP bonus, +50% stamina regen

healthModule.logSleep(5);  // Poor sleep
// Sleep debt +1, no bonuses
```

#### `updateFatigue(minutesAwake)`
```javascript
// Input: Minutes awake since last sleep
// Output: Updates fatigue (0-100%)
// Rate: +1% per hour awake

healthModule.updateFatigue(480);  // 8 hours awake = 8% fatigue
healthModule.updateFatigue(960);  // 16 hours awake = 16% fatigue
```

#### `updateStress(delta)`
```javascript
// Input: Stress change (-50 to +50)
// Output: Updates stress meter (0-100%)

healthModule.updateStress(20);   // Stress +20
healthModule.updateStress(-30);  // Stress -30 (relax)
```

#### `doRelaxationActivity(activity)`
```javascript
// Input: Activity type
// Activities: 'meditation' | 'reading' | 'gaming' | 'bath' | 'walk'
// Output: Reduces stress

healthModule.doRelaxationActivity('meditation');
// Stress -30, message: "Meditation helped reduce stress!"
```

#### `getHealthScore()`
```javascript
// Output: Overall health score (0-100)
// Formula: Average of (Hunger%, Health%, Stamina%, Fatigue_inverse%, Stress_inverse%)

const score = healthModule.getHealthScore();
console.log(score);  // 88 (Excellent)
```

---

## 👕 MODULE 9: COSMETICS MODULE (NEW)

### Class Definition
```javascript
class CosmeticsModule {
  constructor()
  loadDatabase()
  getAvailableItems(type)
  getEquippedItems()
  equipItem(type, itemId)
  buyItem(itemId, currentExp, equipped)
  getItemDetails(itemId)
  getBuffsForEquippedItems()
}
```

### Methods

#### `getAvailableItems(type)`
```javascript
// Input: Type string
// Types: 'clothing' | 'accessories' | 'hair'
// Output: Array of items of that type

const clothes = cosmeticsModule.getAvailableItems('clothing');
// Returns: [
//   { id: 'school-uniform', name: 'School Uniform', cost: 0, rarity: 'common' },
//   { id: 'gym-outfit', name: 'Gym Outfit', cost: 150, rarity: 'rare' },
//   ...
// ]
```

#### `getBuffsForEquippedItems()`
```javascript
// Output: All active buffs from equipped items

const buffs = cosmeticsModule.getBuffsForEquippedItems();
// Returns: {
//   xpBonus: 0.15,  // +15% XP from 'nerd-study-kit'
//   calorieMultiplier: 1.25,  // +25% calorie burn from 'running-shoes'
//   staminaCost: 0.85  // -15% stamina cost from 'gym-outfit'
// }
```

---

## 🌍 MODULE 10: REAL-WORLD INTEGRATION (NEW)

### Class Definition
```javascript
class RealWorldIntegrationModule {
  constructor()
  syncPedometer()
  startBarcodeScanner()
  detectExercise()
  connectHealthTracker()
  grantXPFromSteps(stepCount)
  autoLogFood(barcode)
}
```

### Methods

#### `syncPedometer()`
```javascript
// Output: Connects to Apple Health / Google Fit
// Returns: { connected, stepCount, lastSync }

const result = await realWorldModule.syncPedometer();
if (result.connected) {
  console.log(`${result.stepCount} steps today!`);
  // 1,000 steps = +25 EXP automatically
}
```

#### `grantXPFromSteps(stepCount)`
```javascript
// Input: Step count
// Output: XP granted
// Formula: stepCount / 40 (e.g., 1000 steps = 25 XP)

const xp = realWorldModule.grantXPFromSteps(5000);
console.log(xp);  // 125 XP
```

#### `autoLogFood(barcode)`
```javascript
// Input: Product barcode
// Output: Auto-logs food if found in Open Food Facts
// Returns: { found, foodName, calories, logged }

const result = await realWorldModule.autoLogFood('8850031140097');
if (result.found) {
  console.log(`Auto-logged: ${result.foodName}`);
}
```

---

## 🎮 MAIN APP LOOP

### Basic Game Loop
```javascript
class GameApp {
  constructor() {
    // Initialize all modules
    this.bmi = new BMIModule();
    this.character = new CharacterModule();
    this.hunger = new HungerModule(this.character);
    this.marketplace = new MarketplaceModule();
    this.quest = new QuestModule();
    // ... etc
  }
  
  async init() {
    // Load all data
    await this.bmi.loadDatabase();
    await this.marketplace.loadDatabase();
    await this.quest.loadDatabase();
    
    // Load saved game or create new
    this.loadGame();
    
    // Start game loop
    this.startGameLoop();
  }
  
  startGameLoop() {
    // Run every second
    setInterval(() => {
      this.update();
      this.render();
    }, 1000);
  }
  
  update() {
    // Update game state
    this.hunger.updateHunger(1/60, 'rest');  // 1 second
    this.health.updateFatigue(1/60);
    this.applyGameMechanics();
  }
  
  render() {
    // Render UI
    this.renderCharacter();
    this.renderGauges();
    this.renderQuests();
    this.renderMarketplace();
  }
  
  saveGame() {
    localStorage.setItem('game-state', JSON.stringify({
      character: this.character.character,
      hunger: this.hunger.hunger,
      // ... etc
    }));
  }
  
  loadGame() {
    const saved = localStorage.getItem('game-state');
    if (saved) {
      const state = JSON.parse(saved);
      this.character.character = state.character;
      this.hunger.hunger = state.hunger;
      // ... etc
    }
  }
}

// Initialize
const app = new GameApp();
await app.init();
```

---

## 🚀 QUICK START EXAMPLE

```javascript
// Complete minimal example

async function startGame() {
  // 1. Load BMI module
  const bmi = new BMIModule();
  await bmi.loadDatabase();
  
  // 2. Create character
  const character = new CharacterModule();
  const bmiValue = bmi.calculateBMI(170, 50);
  character.updateCharacterSize(bmiValue);
  
  // 3. Setup hunger
  const hunger = new HungerModule(character);
  
  // 4. Load marketplace
  const marketplace = new MarketplaceModule();
  await marketplace.loadDatabase();
  
  // 5. Display character
  document.getElementById('character').innerHTML = `
    <div style="transform: scale(${character.character.size}%)">
      Sam Lv${character.character.level}
    </div>
  `;
  
  // 6. Display hunger
  document.getElementById('hunger').innerHTML = `
    Hunger: ${Math.round(hunger.hunger)}%
  `;
  
  // 7. Buy food
  const result = marketplace.buyFood('chicken-rice', 100, 1.0);
  if (result.success) {
    hunger.eatFood(marketplace.getFood('chicken-rice'));
  }
}

startGame();
```

---

**Documentation Complete!**

All modules documented with examples and use cases.
Ready for development! 🚀

