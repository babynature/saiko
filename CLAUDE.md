# Shinka Health Game — CLAUDE.md

All agents working in this directory must read this file first.

---

## What This App Is

**Shinka** (進化) — gamified daily health tracker.  
Live at: **https://babynature.github.io/saiko/**  
Repo: **https://github.com/babynature/saiko**  
Deploy: `git add <files> && git commit -m "..." && git push` → GitHub Pages auto-deploys in ~1–2 min.

Target users: anyone aged 5–100 who wants to track food, exercise, sleep, water, weight with game mechanics (XP, levels, quests, achievements).

---

## Critical Coding Rules

1. **No `type="module"`** — all JS is plain scripts, all exports are globals on `window.*`
2. **No frameworks** — Vanilla JS + CSS only (no React, Vue, etc.)
3. **New .js file → add `<script src="...">` to `index.html`** before `</body>`
4. **Split files at ~600 lines** — create `-b.js`, `-c.js` suffixes if needed
5. **CSS variables only** — use tokens from `:root` in `styles.css` (see below)
6. **`renderAll()`** — call after any state change that needs full re-render
7. **`saveGame()`** — call after any persistent state change
8. **Never hardcode colors** — always `var(--primary)`, `var(--danger)`, etc.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | HTML + CSS + Vanilla JS (no framework) |
| Storage | `localStorage` (primary) + Firebase Firestore (cloud sync) |
| Auth | Firebase Auth |
| PWA | `sw.js` (service worker) + `manifest.json` |
| Language | Thai/English via `i18n.js` → `t('key')` |

---

## File Structure

```
index.html              ← SPA shell: 5 tabs (home / marketplace / quests / shop / profile)
styles.css              ← Dark theme CSS, design tokens, Atomic Design system (Phase 11)
i18n.js                 ← t(key, vars); setLang('th'|'en'); currentLang global
app.js                  ← Main orchestrator (3000+ lines) — see "app.js Sections" below
manifest.json           ← PWA: name "Shinka Health Game", short_name "Shinka"
sw.js                   ← Service worker — bump CACHE version on every deploy
firebase-config.js      ← Firebase SDK init

modules/
  bmiModule.js          ← BMI calc, 5 categories, price/advice modifiers
  characterModule.js    ← Character state: name, age, height, weight, level, XP, buffs, cosmetics
  hungerModule.js       ← Hunger meter 0-100, caloriesEaten, caloriesBurned, foodLog[], exerciseMinutes
  marketplaceModule.js  ← FOOD_DATA inline, buy() logic, BMI price adjustment
  questModule.js        ← 5 daily quests, EXERCISE_KCAL_PER_MIN (23 types), auto-reset at midnight
  xpModule.js           ← SHOP_DATA inline, buy/apply cosmetic items
  streakModule.js       ← Daily streak, milestones, checkIn()
  sleepModule.js        ← Sleep log (hours + quality), fatigue 0-100, decays 3pt/hr
  stressModule.js       ← Stress 0-100, life events (work/social/illness/exam)
  weightModule.js       ← Daily weight logs (90-day history), BMI recalc, trend arrow
  achievementModule.js  ← 21 achievements, check(triggerType, ctx) with anti-recursion guard
  historyModule.js      ← Activity snapshots: saveSnapshot() daily, getRecent(n), getWeeklySummary()
  gearModule.js         ← Gear slots, equipment bonuses
  missionModule.js      ← Daily Mission Board
  intelligenceModule.js ← Intelligence stat, study bonuses
  firebaseModule.js     ← Firebase Auth + Firestore cloud save, scheduleSyncToCloud()
  waterModule.js        ← Daily water intake (ml), glass tracking, goal, daily reset
  notificationModule.js ← Web Notification API: 7 reminders (breakfast/lunch/dinner/exercise/water/sleep/weight)
  shareModule.js        ← Canvas-rendered Health Card PNG for sharing
  customFoodModule.js   ← User-defined foods (localStorage key: shg-custom-foods)
  barcodeModule.js      ← BarcodeDetector API + Open Food Facts API lookup
  nutritionGuideModule.js ← Science-based macro targets, workout timing, nutrition tips

data/
  foodDatabase.js       ← window.FOOD_DB — 190+ items, categories: ข้าว/เส้น/กับข้าว/เช้า/ฟาสต์ฟู้ด/ผลไม้/ขนม/เครื่องดื่ม/7-Eleven/สปาเกตตี้/แซนด์วิช/โจ๊ก/ข้าวเหนียว/ข้าวต้ม/ข้าวราดหน้า
  bmi_database.json / food_marketplace.json / quests.json / shop.json
```

---

## app.js Sections (in order)

```
SAVE_KEY = 'shg-v1'
_pendingFood, _currentTabId, _foodFreq globals
FOOD LOG DATE NAVIGATION  ← _foodLogViewDate, navigateFoodLog(), _syncFoodLogDateNav(), _renderFoodLogForDate(), _saveFoodLogHistory(), _loadFoodLogForDate()
FOOD FREQUENCY            ← _loadFoodFreq(), _saveFoodFreq(), _trackFoodFreq(), _getFrequentFoods()
INIT                      ← DOMContentLoaded → loadGame() → renderAll() or showScreen('onboarding')
SAVE / LOAD               ← saveGame(), loadGame()
SCREEN ROUTING            ← showScreen(), showTab()
ONBOARDING                ← setupBMIPreview(), startGame()
renderAll()               ← window.renderAll = function() — re-renders current tab
HUD                       ← renderHUD()
CHARACTER                 ← renderCharacter()
HUNGER                    ← renderHunger(), hungerModule.startTick()
FATIGUE                   ← renderFatigue()
STRESS                    ← renderStress(), renderLifeEvents(), startStressDrain()
STATS                     ← renderStats(), renderCalorieBar()
MARKETPLACE               ← renderMarketplace()
FOOD RECOMMENDATIONS      ← renderFoodRecommendations()
EXERCISE TIP              ← renderExerciseTip()
EXERCISE CARD             ← renderExerciseCard(), quickLogExercise(), logAllPlan()
QUESTS                    ← renderQuests()  ← calls questModule.init() to reset on day change
GLANCE CARD               ← renderGlance() — today at a glance (cal/sleep/exercise/water/quests/weight)
TOAST                     ← showToast(msg, type, duration)
FIRST RUN                 ← _showFirstRunGuide(name) — one-time overlay, stored in shg-firstrun-done
LEVEL UP                  ← showLevelUp()
ACHIEVEMENTS              ← checkAchievements(triggerType, ctx), renderAchievements()
MISSIONS                  ← renderMissions()
EXERCISE SUGGEST          ← renderExerciseSuggest() — threshold: excess >= 150 kcal
EXERCISE DB               ← EXERCISE_DB (36 exercises, 6 cats)
SHOP                      ← renderShop()
PROFILE                   ← renderProfile()
NEAR GOAL BANNER          ← renderNearGoalBanner()
FOOD LOG                  ← renderFoodLog(), renderFoodWeekChart(), _renderFoodLogForDate()
MACRO SUMMARY             ← renderMacroSummary()
MEAL SUGGEST              ← renderMealSuggest(), toggleMealSuggest() — collapsed by default
WEEKLY SUMMARY            ← renderWeeklySummary()
ANALYTICS CHART           ← renderAnalyticsChart(), switchAnalyticsTab() — tabs: calories/sleep/exercise/macro
WATER TRACKER             ← renderWaterTracker()
WEIGHT GOAL               ← renderWeightGoal(), renderWeightSection()
NOTIFICATIONS             ← renderNotifSettings()
WARDROBE                  ← renderWardrobe()
```

---

## Key Global Functions

```js
saveGame()                 // persist state to localStorage + cloud sync
loadGame()                 // restore from localStorage
renderAll()                // re-render entire current tab
showTab(tabId)             // switch tab: 'home'|'marketplace'|'quests'|'shop'|'profile'
showToast(msg, type, dur)  // type: 'success'|'error'|'info'|'warning'
awardXP(amount, source)    // adds to _xpBalance AND character progression
checkAchievements(type, ctx) // triggerTypes: 'food'|'exercise'|'streak'|'level'|'quest'|'water'|'sleep'|'stress'|'weight'|'days'

// Food log
addFoodLog()               // from form: reads #food-log-name, #food-log-kcal, #food-log-meal, macros
removeFoodLog(idx)         // remove entry by index
toggleFoodLog()            // open/close food panel — resets to today on open
navigateFoodLog(delta)     // +1/-1 to browse food history (30 days)
renderFoodLog()            // renders today's food log + syncs date nav + 7-day chart
renderFoodWeekChart()      // mini 7-bar chart, injected into #flog-week-chart

// Exercise
quickLogExercise(type, minutes, displayName, kcalOverride)
logAllPlan(ids)            // log all exercises from recommended plan

// Food search
initFoodSearch()           // wires up #food-log-name input with autocomplete
selectFood(idx)            // select from dropdown
fillFood(f)                // fill form with food object {name, kcal, protein, carbs, fat}

// Meal suggestions
toggleMealSuggest()        // toggle collapsed/expanded; persisted in shg-ms-open

// Water
addWater(ml)               // log water intake
```

---

## localStorage Keys

| Key | Contents |
|-----|----------|
| `shg-v1` | Main save: all module state as JSON |
| `shg-food-freq` | Food frequency map `{name: count}` |
| `shg-ms-open` | Meal suggestion panel state `'1'`/`'0'` |
| `shg-firstrun-done` | `'1'` if first-run guide shown |
| `shg-flog-YYYY-MM-DD` | Per-day food log array (30-day history) |
| `shg-custom-foods` | User-defined food database array |
| `shg-notifications` | Notification settings |
| `shg-lang` | Language `'th'`/`'en'` |

---

## CSS Design Tokens

Defined in `styles.css` `:root` block:

```css
--primary:       #6c63ff    /* purple accent */
--primary-d:     #5a52d5    /* darker variant */
--secondary:     #ff6584
--success:       #22c55e
--warning:       #f59e0b
--danger:        #ef4444
--surface:       #1a1a2e    /* card/panel background */
--surface-card:  #1e1e35
--surface-inset: #13131f
--bg:            #0f0f1a    /* page background */
--text:          #e2e8f0
--text-muted:    #94a3b8
--text-faint:    #475569
--border-subtle: rgba(255,255,255,.08)
--text-xs:  0.7rem  | --text-sm: 0.8rem | --text-md: 0.9rem | --text-lg: 1.05rem
--space-1: 0.25rem … --space-24: 6rem
--radius-sm: 6px | --radius-md: 10px | --radius-lg: 16px | --radius-xl: 24px | --radius-full: 9999px
```

**Atomic Design classes (Phase 11):**

```css
/* Buttons */    .btn .btn-primary .btn-success .btn-danger .btn-sm .btn-lg .btn-block
/* Badges */     .badge .badge-xp .badge-level .badge-easy .badge-medium .badge-hard .badge-info
/* Stat card */  .stat-card .stat-value .stat-label .stat-unit
/* Progress */   .progress-bar .progress-bar-fill (.success/.warning/.danger/.sm/.lg)
/* Section */    .section-header .section-icon .section-title .section-action .section-body
/* Log row */    .log-row .log-row-icon .log-row-label .log-row-sub .log-row-value .log-row-del
/* Empty state */.empty-state .empty-state-icon .empty-state-msg .empty-state-hint .empty-state-action
/* First run */  .firstrun-overlay .firstrun-sheet .firstrun-emoji .firstrun-title .firstrun-btn
```

---

## Module Public API Quick Reference

### hungerModule
```js
.caloriesEaten         // number
.caloriesBurned        // number
.exerciseMinutes       // number
.foodLog               // array of {name, kcal, time, mealType, hasMacros, protein, carbs, fat}
.getTodayFoodLog()     // returns foodLog[]
.getNetCalories()      // caloriesEaten - caloriesBurned
.getMacroTotals()      // {protein, carbs, fat}
.hasMacroData()        // bool
.startTick()           // starts hunger decay interval
```

### characterModule
```js
.get(key)              // keys: name, age, heightCm, weightKg, gender, activityLevel, dailyCalorie, level, xp, categoryId
.set(key, val)
.getXPProgress()       // {current, next, pct}
.addXP(n)
.toJSON() / .fromJSON(obj)
```

### questModule
```js
.init()                // resets progress if new day — call at start of renderQuests()
.getAll()              // returns QUEST_DEFINITIONS array
.getProgress(id)       // number
.getTarget(quest, dailyCal)
.isComplete(quest, dailyCal)  // bool
.isClaimed(id)         // bool
.countCompleted(dailyCal)
.totalXPEarned()
.toJSON() / .fromJSON(obj)
```

### historyModule
```js
.saveSnapshot()        // called inside saveGame()
.getRecent(n)          // last n days: [{date, caloriesEaten, caloriesBurned, calorieGoal, sleepHours, exerciseMin, questsDone, waterDrank, weight, ...}]
.getWeeklySummary()    // {avgCalories, avgSleep, totalExMin, questDays, days}
.toJSON() / .fromJSON(obj)
```

### waterModule
```js
.add(ml)
.getMl() / .getGoalMl()
.getGlasses() / .getGoalGlasses()
.getPct() / .isGoalMet()
.setGoal(ml)
.toJSON() / .fromJSON(obj)
```

### weightModule
```js
.log(kg)               // add entry
.getLatest()           // {date, weight} or null
.getRecent(n)          // last n entries
.getTrend()            // 'up'|'down'|'stable'|null
.toJSON() / .fromJSON(obj)
```

### notificationModule
```js
.settings              // {enabled, reminders: {breakfast, lunch, dinner, exercise, water, sleep, weight}}
.isSupported() / .getPermission()
.requestPermission()
.scheduleAll() / .cancelAll()
.setEnabled(bool)
.setReminder(key, field, value)
.getNextFireLabel(key)
```

### customFoodModule
```js
.getAll()              // [{id, name, kcal, protein, carbs, fat, emoji, portion}]
.add(name, kcal, protein, carbs, fat, emoji, portion)
.remove(id)
.find(name)
```

### barcodeModule
```js
.isSupported()         // BarcodeDetector available
.openScanner()         // injects modal + starts camera
.closeScanner()
```

---

## Exercise System

### EXERCISE_KCAL_PER_MIN (in questModule.js, 23 types)
```
เดิน:      walking(4), brisk_walk(5)
วิ่ง:      jogging(7), running(8), hiit(11)
จักรยาน:   cycling(6), cycling_hard(9)
ว่ายน้ำ:   swimming(7)
ฟิตเนส:    gym(5), weight_train(5), bodyweight(5)
กีฬา:      badminton(6), tennis(7), football(7), basketball(7), volleyball(5), court_sport(7), muay_thai(9)
คาร์ดิโอ:  aerobic(6), jump_rope(10), dancing(5), hiking(5)
ผ่อนคลาย:  yoga(3), stretching(2)
```

### EXERCISE_DB (in app.js, 36 exercises, 6 categories)
```
upper(5):       pushup, wide_pushup, diamond_pushup, pike_pushup, tricep_dip
lower(5):       squat, lunge, glute_bridge, wall_sit, calf_raise
core(7):        crunch, plank, russian_twist, mountain_climber, leg_raises, bicycle_crunch, bird_dog
agility(5):     jump_squat, lateral_lunge, burpee_power, high_knees_power, skaters
flexibility(4): superman, cat_cow, childs_pose, downward_dog
cardio(10):     jumping_jack, burpee, high_knees, jump_rope, aerobic, brisk_walk, jog_zone2, run_pace, hiit_run, court_sport
```

### Smart Recommendation Logic (`_buildRecommendation`)
```
Wed 15:00+ → ยืดก่อนคอร์ต (cat_cow + lateral_lunge + bird_dog + court_sport)
21:00+ / <6:00 → ยืดเหยียดก่อนนอน
เช้า 6-10 → Day-of-week: Mon=Upper, Tue=Lower, Wed=Cardio, Thu=Core, Fri=Agility, Sat=Full, Sun=Flex
กลางวัน 11-14 → HIIT หรือ Core เร็ว
บ่าย 14-17 → By BMI (underweight=Upper, normal=Balanced, overweight=Cardio)
เย็น 17-21 → Day-of-week full workout
Threshold: excess >= 150 kcal (เกินเป้า)
```

---

## Food Log Date Navigation

```js
_foodLogViewDate       // null = today, "YYYY-MM-DD" = past day
_todayStr()            // "YYYY-MM-DD"
navigateFoodLog(+1/-1) // change day, max 30 days back, not past today
_syncFoodLogDateNav()  // updates label/date/buttons/#panel-food.past-day
_renderFoodLogForDate()// today → renderFoodLog(); past → read-only render
_saveFoodLogHistory()  // saves to shg-flog-YYYY-MM-DD, prunes >30 days; called in saveGame()
```

**Past-day mode** — when `_foodLogViewDate` is set, `#panel-food` gets class `past-day` which hides:
`.food-log-form`, `.macro-toggle-btn`, `.macro-input-row`, `#meal-suggest`, `#macro-summary`, `.flog-del`

**Date nav bar** is `position: sticky; top: 0` so it stays visible while scrolling history.

---

## Phase History

| Phase | Feature |
|-------|---------|
| 1 | MVP: BMI, hunger, marketplace, quests, shop, profile |
| 1.5 | Sleep/fatigue, stress, life events, wardrobe |
| 2 | Weight tracking, 21 achievements |
| 3 | History & analytics (week summary, Chart.js bars) |
| 4 | Food/exercise intelligence (BMI-based recs, calorie badges) |
| 5 | Export & backup (CSV, JSON, health card copy) |
| 6 | Firebase Auth + Firestore cloud save + leaderboard |
| 7 | PWA, Today at a Glance card, toast queue, animations |
| 8 | Daily Mission Board + Gear system |
| 9 | Food search autocomplete + FOOD_DB 190+ items |
| 10 | Smart exercise recommendation engine + 23 exercise types |
| 11 | Atomic Design system: shared tokens, atoms, molecules, empty states, first-run guide |
| 11b | Share Health Card, Custom Foods, Macro Chart, Meal Suggestion |
| 11c | Water Tracker, Weight Goal, Exercise Notification reminder |
| 11d | Barcode Scanner (BarcodeDetector + Open Food Facts) |
| 11e | Nutrition Guide module (macro targets, workout timing) |
| 11f | Refactoring UI principles, Laws of UX improvements |
| 11g | Hooked model: frequent foods dropdown, near-goal banner, lucky XP |
| 11h | Food panel as overlay (zero layout shift), exercise card on home tab |
| 11i | Meal suggestions collapsed by default (localStorage state) |
| 11j | Food log date navigation + 30-day history + mini 7-day calorie chart |

---

## i18n

```js
t('key')               // returns Thai or English string based on currentLang
t('key', {var: val})   // with interpolation
setLang('th'|'en')     // switches language + re-renders
currentLang            // global: 'th' or 'en'
```

All user-visible strings must use `t()`. Keys are in `i18n.js`.

---

## Service Worker

Bump `CACHE` version in `sw.js` on every deploy that changes JS/CSS/HTML:
```js
const CACHE = 'shg-v11c';  // ← increment this
```

---

## Firebase

```js
firebaseModule.isLoggedIn()             // bool
firebaseModule.init(onAuthStateChanged) // call on DOMContentLoaded
firebaseModule.scheduleSyncToCloud(json)// debounced 3s
firebaseModule.forceSyncToCloud()       // immediate
```

Auth state changes fire `onAuthStateChanged(user)` in `app.js` which calls `renderAll()`.
