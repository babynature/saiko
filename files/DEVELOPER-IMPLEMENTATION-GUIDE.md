# DEVELOPER IMPLEMENTATION GUIDE
## How to Use Blueprint + Start Developing the App

**Status:** Developer Quick Start  
**Version:** 1.0  
**Date:** 2026-07-03  

---

## 📋 BEFORE YOU START: CHECKLIST

### What You Have
```
✅ 31 Blueprint files (656 KB)
✅ 5 Production databases (JSON)
✅ Complete UI/UX design
✅ Responsive design specs
✅ All system specifications
✅ Development roadmap
```

### What You Need to Add
```
❌ HTML/CSS/JavaScript files
❌ Project structure/folders
❌ Build tools (webpack/vite)
❌ Package management (npm)
❌ Version control (git)
❌ Actual game code
❌ Asset files (images/icons/sounds)
❌ Firebase configuration
❌ Testing framework
```

---

## 🎯 QUICK START: 3 STEPS

### STEP 1: READ BLUEPRINT (1 hour)
```
1. 00-START-HERE.txt (5 min)
2. COMPREHENSIVE-MASTER-BLUEPRINT.md (30 min)
3. UI-UX-DESIGN-SYSTEM.md (20 min)
4. Quick review of JSON databases
```

### STEP 2: PLAN DEVELOPMENT (30 min)
```
1. Create project folder structure
2. Setup package.json
3. Plan Phase 1 (2 weeks)
4. Assign tasks
```

### STEP 3: START CODING (Begin!)
```
1. Setup index.html
2. Create CSS framework
3. Build BMI module
4. Add character display
5. Implement hunger system
...
```

---

## 📁 PROJECT STRUCTURE (Create This)

```
student-health-game/
├── index.html                 ← Main HTML
├── styles.css                 ← Global styles
├── app.js                      ← Main application
├── i18n.js                     ← Thai/English translation
│
├── /modules                    ← Game modules
│   ├── bmiModule.js
│   ├── characterModule.js
│   ├── hungerModule.js
│   ├── marketplaceModule.js
│   ├── questModule.js
│   ├── xpModule.js
│   ├── streakModule.js
│   ├── calorieModule.js
│   ├── userModule.js
│   ├── cosmeticsModule.js      ← NEW
│   ├── healthModule.js         ← NEW
│   ├── lifeEventsModule.js     ← NEW
│   └── realWorldIntegrationModule.js ← NEW
│
├── /data                       ← JSON databases (from blueprint)
│   ├── bmi_database.json
│   ├── food_marketplace.json
│   ├── foods.json
│   ├── quests.json
│   ├── shop.json
│   └── cosmetics_database.json ← NEW (create from spec)
│
├── /styles                     ← CSS files
│   ├── variables.css           ← Colors, fonts
│   ├── layout.css              ← Grid, flexbox
│   ├── components.css          ← Buttons, cards
│   ├── responsive.css          ← Media queries
│   └── animations.css          ← Keyframes
│
├── /assets                     ← Images, icons, sounds
│   ├── /images
│   ├── /icons
│   ├── /sprites
│   └── /sounds
│
├── /libs                       ← Third-party libraries
│   ├── chart.js                ← For graphs
│   ├── hammer.js               ← For touch gestures
│   └── other...
│
├── package.json                ← Dependencies
├── .gitignore
├── README.md
└── firebase.json               ← Firebase config
```

---

## 🔧 SETUP: STEP-BY-STEP

### 1. Create Project Folder
```bash
mkdir student-health-game
cd student-health-game
```

### 2. Initialize Git
```bash
git init
git remote add origin YOUR_REPO_URL
```

### 3. Create package.json
```json
{
  "name": "student-health-game",
  "version": "1.0.0",
  "description": "Health gamification app for students",
  "main": "app.js",
  "scripts": {
    "start": "http-server",
    "build": "webpack",
    "test": "jest",
    "deploy": "firebase deploy"
  },
  "dependencies": {
    "chart.js": "^3.9.0",
    "hammer.js": "^2.0.8"
  },
  "devDependencies": {
    "webpack": "^5.0.0",
    "jest": "^27.0.0",
    "firebase-tools": "^11.0.0"
  }
}
```

### 4. Create index.html
```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Health Game</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  
  <script src="libs/hammer.js"></script>
  <script src="libs/chart.js"></script>
  <script src="i18n.js"></script>
  <script src="modules/bmiModule.js"></script>
  <script src="modules/characterModule.js"></script>
  <script src="modules/hungerModule.js"></script>
  <!-- ... other modules ... -->
  <script src="app.js"></script>
</body>
</html>
```

### 5. Setup Firebase
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

---

## 📝 CODE EXAMPLES

### Example 1: BMI Module (from blueprint)
```javascript
// modules/bmiModule.js

class BMIModule {
  constructor() {
    this.bmiData = null;
  }
  
  // Load BMI database
  async loadDatabase() {
    const response = await fetch('/data/bmi_database.json');
    this.bmiData = await response.json();
  }
  
  // Calculate BMI
  calculateBMI(heightCm, weightKg) {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }
  
  // Get BMI category
  getBMICategory(bmi) {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    if (bmi < 35) return 'obese_lv1';
    if (bmi < 40) return 'obese_lv2';
    return 'obese_lv3';
  }
  
  // Calculate daily calorie target (from blueprint)
  calculateDailyCalorie(age, heightCm, weightKg, gender, activity) {
    let bmr;
    if (gender === 'M') {
      bmr = 66 + (13.7 * weightKg) + (5 * heightCm) - (6.8 * age);
    } else {
      bmr = 655 + (9.6 * weightKg) + (1.8 * heightCm) - (4.7 * age);
    }
    
    const activityMultiplier = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725
    };
    
    return Math.round(bmr * (activityMultiplier[activity] || 1.2));
  }
  
  // Get food price modifier (from blueprint)
  getFoodPriceModifier(bmi) {
    const category = this.getBMICategory(bmi);
    const modifiers = {
      'underweight': 0.8,    // High-calorie foods cheaper
      'normal': 1.0,
      'overweight': 1.2,     // High-calorie foods more expensive
      'obese_lv1': 1.3,
      'obese_lv2': 1.5,
      'obese_lv3': 2.0
    };
    return modifiers[category];
  }
}

// Usage
const bmiModule = new BMIModule();
await bmiModule.loadDatabase();

const bmi = bmiModule.calculateBMI(170, 50);
const category = bmiModule.getBMICategory(bmi);
const dailyCalorie = bmiModule.calculateDailyCalorie(16, 170, 50, 'M', 'moderate');
const priceModifier = bmiModule.getFoodPriceModifier(bmi);
```

### Example 2: Character Module
```javascript
// modules/characterModule.js

class CharacterModule {
  constructor() {
    this.character = {
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
      size: 100,  // % scale (90-130)
      cosmetics: {
        clothing: 'school-uniform',
        accessories: [],
        hair: 'black-normal'
      }
    };
  }
  
  // Update character size based on BMI
  updateCharacterSize(bmi) {
    // Formula: size = 100 + (bmi - 21.5) * 3
    // At BMI 18.5 (underweight) = 91%
    // At BMI 21.5 (normal) = 100%
    // At BMI 25 (overweight) = 110%
    // At BMI 30 (obese) = 126%
    
    const size = Math.max(90, Math.min(130, 100 + (bmi - 21.5) * 3));
    this.character.size = Math.round(size);
    this.character.bmi = bmi;
  }
  
  // Add experience
  addExp(amount) {
    this.character.exp += amount;
    this.checkLevelUp();
  }
  
  // Check for level up
  checkLevelUp() {
    // XP needed = (level * 1000) + (level^2 * 200)
    const nextLevelXP = (this.character.level * 1000) + 
                        (Math.pow(this.character.level, 2) * 200);
    
    if (this.character.exp >= nextLevelXP) {
      this.character.level++;
      this.character.exp -= nextLevelXP;
      this.onLevelUp();
    }
  }
  
  // Level up effects
  onLevelUp() {
    // Increase stats
    this.character.health += 5;
    this.character.strength += 2;
    this.character.endurance += 2;
    this.character.intelligence += 1;
    this.character.stamina += 3;
    
    console.log(`🎉 Level up! Now Lv ${this.character.level}`);
  }
  
  // Get character emotion based on hunger
  getEmotion(hungerPercent) {
    if (hungerPercent >= 70) return 'happy';
    if (hungerPercent >= 40) return 'normal';
    if (hungerPercent >= 20) return 'sad';
    return 'distressed';
  }
  
  // Equip cosmetics
  equipCosmetic(type, itemId) {
    this.character.cosmetics[type] = itemId;
  }
}

// Usage
const character = new CharacterModule();
character.updateCharacterSize(19.5);
character.addExp(50);
character.equipCosmetic('clothing', 'gym-outfit');
```

### Example 3: Hunger Module
```javascript
// modules/hungerModule.js

class HungerModule {
  constructor(character) {
    this.character = character;
    this.hunger = 50;  // 0-100%
    this.drainRate = 0.5;  // per minute at rest
  }
  
  // Update hunger based on time elapsed
  updateHunger(minutesElapsed, activity = 'rest') {
    const activityDrain = {
      'rest': 0.5,
      'questing': 1.0,
      'exercise': 2.0
    };
    
    const drain = activityDrain[activity] || 0.5;
    this.hunger = Math.max(0, this.hunger - (drain * minutesElapsed));
    
    this.applyHungerEffects();
  }
  
  // Apply hunger effects to stats
  applyHungerEffects() {
    const baseMultiplier = {
      'happy': 1.1,      // 70-100%: +10% to all stats
      'normal': 1.0,     // 40-70%: normal
      'sad': 0.8,        // 20-40%: -20% to all stats
      'distressed': 0.5  // 0-20%: -50% to all stats
    };
    
    const emotion = this.character.getEmotion(this.hunger);
    const multiplier = baseMultiplier[emotion];
    
    // Apply to character stats (display only, don't modify base)
    this.effectiveStats = {
      health: this.character.health * multiplier,
      strength: this.character.strength * multiplier,
      // ... etc
    };
  }
  
  // Eat food
  eatFood(foodItem) {
    this.hunger = Math.min(100, this.hunger + foodItem.hungerRestore);
    
    // Apply stat bonuses
    if (foodItem.bonuses) {
      this.character.health += foodItem.bonuses.health || 0;
      this.character.strength += foodItem.bonuses.strength || 0;
      // ... etc
    }
    
    this.applyHungerEffects();
    return `Ate ${foodItem.name}! Hunger +${foodItem.hungerRestore}`;
  }
  
  // Get hunger status
  getHungerStatus() {
    if (this.hunger >= 70) return 'satisfied';
    if (this.hunger >= 40) return 'normal';
    if (this.hunger >= 20) return 'hungry';
    return 'starving';
  }
}

// Usage
const hunger = new HungerModule(character);
hunger.updateHunger(10, 'rest');  // 10 minutes at rest
const food = foodMarketplace.getFood('chicken-rice');
hunger.eatFood(food);
```

---

## 📊 DATA FLOW (from blueprint)

```
User Input
    ↓
BMI Module → calculates personalization
    ↓
Character Module → updates character state
    ↓
Hunger Module → affects stats & gameplay
    ↓
Marketplace Module → sells food based on BMI
    ↓
Quest Module → tracks progress
    ↓
XP Module → awards experience
    ↓
Cosmetics Module → applies visual updates
    ↓
Health Module → tracks sleep/stress/fatigue
    ↓
UI Render → displays to player
```

---

## 🎯 PHASE 1: 2-WEEK PLAN

### Week 1
**Day 1-2: Setup**
- Project structure
- index.html
- CSS framework
- Firebase setup

**Day 3-4: Core Systems**
- BMI module
- Character module
- Display character on screen

**Day 5: Hunger & Stats**
- Hunger module
- Gauge rendering
- Health display

### Week 2
**Day 6-7: Marketplace**
- Food marketplace UI
- Card-based layout
- Purchase logic

**Day 8-9: Quests**
- Quest system
- Daily quests
- Progress tracking

**Day 10: Integration & Deploy**
- localStorage persistence
- i18n (Thai/English)
- Firebase deployment
- Testing

---

## 🗄️ HOW TO USE JSON DATABASES

### Loading Data
```javascript
// Load all databases
async function loadAllData() {
  const bmiDB = await fetch('/data/bmi_database.json').then(r => r.json());
  const foodDB = await fetch('/data/food_marketplace.json').then(r => r.json());
  const questDB = await fetch('/data/quests.json').then(r => r.json());
  const shopDB = await fetch('/data/shop.json').then(r => r.json());
  
  return { bmiDB, foodDB, questDB, shopDB };
}

// Use in your code
const databases = await loadAllData();
const foodItem = databases.foodDB.items[0];
```

### Database Structures

**bmi_database.json:**
```json
{
  "categories": {
    "normal": {
      "bmi_min": 18.5,
      "bmi_max": 24.9,
      "recommendations": [...],
      "priceModifier": 1.0
    }
  }
}
```

**food_marketplace.json:**
```json
{
  "items": [
    {
      "id": "chicken-rice",
      "name": "Chicken Rice",
      "exp_cost": 50,
      "hunger_restore": 50,
      "bonuses": {
        "strength": 10,
        "health": 15
      }
    }
  ]
}
```

---

## 🔄 PERSISTENCE (LocalStorage)

```javascript
// Save game state
function saveGame() {
  const gameState = {
    character: character.character,
    hunger: hunger.hunger,
    progress: questModule.progress,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('game-state', JSON.stringify(gameState));
}

// Load game state
function loadGame() {
  const saved = localStorage.getItem('game-state');
  if (saved) {
    const gameState = JSON.parse(saved);
    character.character = gameState.character;
    hunger.hunger = gameState.hunger;
    // ... restore other state
  }
}

// Auto-save every 5 minutes
setInterval(saveGame, 5 * 60 * 1000);
```

---

## 🌍 INTERNATIONALIZATION (i18n)

```javascript
// i18n.js
const translations = {
  th: {
    character_name: 'แซม',
    hunger: 'ความหิว',
    health: 'สุขภาพ',
    eat_message: 'กินอาหารอร่อยๆ!',
    level_up: 'เลเวลอัพ!'
  },
  en: {
    character_name: 'Sam',
    hunger: 'Hunger',
    health: 'Health',
    eat_message: 'Enjoyed delicious meal!',
    level_up: 'Level Up!'
  }
};

function t(key, lang = 'th') {
  return translations[lang][key] || key;
}

// Usage
console.log(t('character_name', 'th'));  // แซม
console.log(t('character_name', 'en'));  // Sam
```

---

## ✅ CHECKLIST FOR DEVELOPMENT

**Phase 1 (MVP):**
- [ ] Project setup
- [ ] BMI module
- [ ] Character display
- [ ] Hunger system
- [ ] Food marketplace
- [ ] Quests
- [ ] XP & levels
- [ ] Streak tracker
- [ ] localStorage
- [ ] Firebase deploy

**Phase 1.5 (Advanced Health):**
- [ ] Cosmetics system
- [ ] Sleep tracking
- [ ] Stress management
- [ ] Life events

**Phase 2 (Real-World):**
- [ ] Pedometer sync
- [ ] Barcode scanner
- [ ] Exercise detection

---

## 📚 RESOURCES

**Blueprint Files:**
- COMPREHENSIVE-MASTER-BLUEPRINT.md
- UI-UX-DESIGN-SYSTEM.md
- All system detail files

**Libraries:**
- Chart.js: Data visualization
- Hammer.js: Touch gestures
- Firebase: Backend & hosting

**Tools:**
- VS Code: Code editor
- Git: Version control
- Firebase CLI: Deployment

---

## 🚀 READY TO CODE?

1. ✅ Downloaded all 31 blueprint files
2. ✅ Created project structure
3. ✅ Setup index.html + package.json
4. ✅ Loaded JSON databases
5. ✅ Started coding modules

**Let's build! 🎮**

