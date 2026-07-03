# RESPONSIVE DESIGN & PLATFORM-SPECIFIC INTERACTIONS

**Status:** Detailed interaction specifications  
**Version:** 1.0  
**Date:** 2026-07-03  
**Purpose:** Mobile vs Desktop layout and interaction design

---

## 1. LAYOUT ADAPTATION (โครงสร้างการจัดวาง)

### 1.1 Mobile View (320px - 480px)

```
SINGLE COLUMN LAYOUT (Vertical Scrolling)

┌─────────────────────────────┐
│ 👤 Sam [Lv.5] 🔥 12 [⚙️]  │ (Header - Fixed)
├─────────────────────────────┤
│                             │
│   CHARACTER VISUAL          │
│    (Avatar 2D)              │
│   Size: Full width          │
│   Height: ~180px            │
│                             │
├─────────────────────────────┤
│ 🍽️ [████████░░] 75%       │ (Gauges - Scrollable)
│ ❤️ [██████████] 95%       │
│ ⚡ [███████░░░] 68%        │
│ 😴 [██░░░░░░░░] 15%        │
│ 😰 [███░░░░░░░] 28%        │
├─────────────────────────────┤
│ 🎯 Calories: 950/1850       │
│ 💰 EXP: 450/500             │
│ 🌍 Steps: 5,230             │
├─────────────────────────────┤
│                             │
│  📊 HEALTH SUMMARY          │
│  ├─ Status: Excellent       │
│  ├─ Sleep: 8.5 hours        │
│  └─ Stress: 28% (Calm)      │
│                             │
├─────────────────────────────┤
│  [SWIPE LEFT/RIGHT ↔]       │
│  Browse categories...       │
│                             │
├─────────────────────────────┤
│        [SPACER]             │
│                             │
└─────────────────────────────┘

┌─────────────────────────────┐
│ [🛒] [📋] [👕] [🏃] [📊]  │ BOTTOM NAV (Fixed)
└─────────────────────────────┘
```

**Key Features:**
- ✅ Single column layout (full width)
- ✅ Vertical scrolling for content
- ✅ Bottom navigation bar (always visible)
- ✅ Touch-friendly buttons (44px+)
- ✅ Thumb-friendly zone (center 2/3 of screen)
- ✅ Minimal horizontal scrolling
- ✅ Fast load times (content-first)

**Navigation Structure:**
```
BOTTOM NAV BAR (Fixed at bottom, 56px):
├─ 🛒 Marketplace (Tab 1)
├─ 📋 Quests (Tab 2)
├─ 👕 Cosmetics (Tab 3)
├─ 🏃 Exercise (Tab 4)
└─ 📊 Analytics (Tab 5)

Tab switching: Smooth fade transition (250ms)
Active tab: Highlighted with color + underline
Inactive tabs: Gray with icon only
```

### 1.2 Desktop View (769px+)

```
2-3 COLUMN DASHBOARD LAYOUT (CSS Grid)

┌──────────────────────────────────────────────────────────────┐
│ Header: Sam [Lv.5] 🔥 12  |  Health Status  |  Settings ⚙️   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  LEFT PANEL (25%)  │  CENTER (50%)  │  RIGHT PANEL (25%)   │
│                    │                │                      │
│  📋 QUESTS         │ CHARACTER AREA │ 📊 ANALYTICS        │
│  ├─ Log Meals ✅   │                │ ├─ Weight Trend     │
│  ├─ Exercise ⏳    │  [Avatar]      │ ├─ BMI History      │
│  ├─ Water ❌       │  Size: Large   │ ├─ XP Progress      │
│  ├─ Nutrition ⏳   │  +Cosmetics    │ └─ Quest Completion │
│  └─ Streak: 12 🔥 │                │                      │
│                    │ GAUGES BELOW:  │ 📈 TRENDS:          │
│  UPCOMING:         │ ├─ 🍽️ 75%    │ └─ Last 30 days:    │
│  ├─ Exam Week      │ ├─ ❤️ 95%    │    BMI: 19.5→19.2    │
│  └─ Sports Day     │ ├─ ⚡ 68%    │    Calories: ▁▂▃▂▄  │
│                    │ ├─ 😴 15%    │                      │
│  COSMETICS QUICK:  │ └─ 😰 28%    │ HEALTH SCORE:        │
│  ├─ Equipped:      │                │ 88/100 ⭐          │
│  │  Gym Outfit     │ PROGRESS:      │                      │
│  │  Nerd Glasses   │ ├─ Calories    │ RECOMMENDATIONS:    │
│  │  Blue Hair      │ ├─ XP/Level    │ ✓ Sleep 8hrs       │
│  │                 │ └─ Steps       │ ✓ Eat balanced     │
│  └─ [ 👕 Shop ]    │                │ ⚠️ Manage stress   │
│                    │                │ ✓ Good exercise    │
└────────────────────┴────────────────┴────────────────────────┘

Optional Bottom: Marketplace quick preview (scrollable cards)
```

**Key Features:**
- ✅ 2-3 column grid layout
- ✅ Left sidebar: Quests + Events + Cosmetics
- ✅ Center: Main character + gauges
- ✅ Right sidebar: Analytics + Trends
- ✅ Mouse hover interactions
- ✅ All information visible without scrolling (can scroll for details)
- ✅ Draggable panels (optional)

**Layout Specs:**
```
CSS Grid:
  grid-template-columns: 1fr 2fr 1fr (25% 50% 25%)
  gap: 16px
  max-width: 1400px
  margin: 0 auto

Sidebar width: 300px (fixed)
Center width: Dynamic
Min viewport: 1200px
Optimal: 1400px+
Max: 2000px
```

### 1.3 Tablet View (481px - 768px) - Bridge Layout

```
HYBRID: 2 COLUMN on smaller tablet, adapts to 3 on larger

Small Tablet (481-600px):
  ┌─────────────────────┐
  │  CHARACTER + GAUGES │ (Full width)
  ├─────────────────────┤
  │ QUESTS  │ ANALYTICS │ (2 columns)
  ├─────────────────────┤
  │ COSMETICS PREVIEW   │ (Full width)
  ├─────────────────────┤
  │ BOTTOM NAV (Tabs)   │ (Full width)
  └─────────────────────┘

Medium Tablet (600-768px):
  ┌────────────────────────────┐
  │ QUESTS │ CHARACTER │ STATS │ (3 columns)
  ├────────────────────────────┤
  │ GAUGES BELOW CHARACTER     │
  ├────────────────────────────┤
  │ COSMETICS + ANALYTICS      │
  └────────────────────────────┘
```

---

## 2. CONTROLS & INTERACTIONS (การควบคุมและการโต้ตอบ)

### 2.1 Mobile Controls

```
PRIMARY GESTURES:

TAP (Single Tap):
  ├─ Tap button → Execute action
  ├─ Tap card → Show details
  ├─ Tap [ BUY ] → Show confirmation
  ├─ Tap gauge → Show breakdown
  └─ Tap tab → Switch view

LONG PRESS (Long Tap):
  ├─ 500ms hold on food card → Show full details
  ├─ 500ms on quest → Show completion requirements
  └─ 500ms on equipment → Show buff description

SWIPE GESTURES:

SWIPE LEFT/RIGHT (Horizontal):
  ├─ Browse food categories
  │  └─ Light Meals ← → Regular Meals ← → Heavy Meals
  ├─ Switch between tabs (alternative to bottom nav)
  ├─ Dismiss alerts/notifications
  └─ Undo/Redo actions (with animation feedback)

SWIPE UP/DOWN (Vertical):
  ├─ Scroll content (default browser behavior)
  ├─ Pull-to-refresh (reload daily data)
  └─ Swipe down from top → Show quick stats

PINCH (Multi-touch):
  ├─ Zoom in/out on character (optional)
  └─ Zoom in/out on graphs (analytics tab)

DOUBLE TAP:
  ├─ Double tap character → Toggle cosmetics preview
  ├─ Double tap gauge → Show detailed breakdown
  └─ Double tap food → Quick buy (if enabled)

Example Interactions:

1. BROWSE MARKETPLACE (Swipe):
   ┌─────────────────┐
   │  Light Meals    │
   │  🍗🥗🍞       │ ← Current view
   │  [Swipe ←]      │
   └─────────────────┘
        ↓ (Swipe left)
   ┌─────────────────┐
   │  Regular Meals  │
   │  🍜🥘🍲       │ ← New view
   └─────────────────┘

2. LONG PRESS FOOD:
   Long press on card (500ms)
        ↓
   ┌──────────────────────┐
   │ Chicken Rice         │
   │ 50 EXP              │
   │ +50 Hunger          │
   │ +10 STR, +15 HP     │
   │ Duration: 45 min    │
   │ [ BUY ]  [ CANCEL ] │
   └──────────────────────┘
```

### 2.2 Desktop Controls & Hover Effects

```
MOUSE INTERACTIONS:

HOVER EFFECTS:

Marketplace Card Hover:
  ┌──────────────────────┐
  │  [CARD]              │ (Normal)
  │  🍗 Chicken Rice     │
  │  50 EXP              │
  └──────────────────────┘
  
  Mouse over ↓
  
  ┌──────────────────────┐
  │  [CARD - Lifted]     │ (Hover)
  │  🍗 Chicken Rice     │
  │  50 EXP              │
  │  ┌──────────────────┐│
  │  │ TOOLTIP:         ││ ← Appears
  │  │ +50 Hunger       ││
  │  │ +10 STR +15 HP   ││
  │  │ 45 min duration  ││
  │  │ Price: Normal    ││
  │  │ [ BUY ]          ││
  │  └──────────────────┘│
  └──────────────────────┘

Visual Changes on Hover:
  ├─ Card elevation: 2px → 8px shadow
  ├─ Transform: scale(1) → scale(1.02)
  ├─ Border: Subtle → Colored highlight
  ├─ Cursor: default → pointer
  ├─ Animation time: 200ms ease-out
  └─ Tooltip appears: 300ms delay

BUTTON HOVER STATES:

Normal Button:
  Background: #2ECC71 (Green)
  Text: White
  Shadow: 2px
  Cursor: default

Hover State:
  Background: #27AE60 (Darker green)
  Text: White
  Shadow: 4px
  Cursor: pointer
  Transform: translateY(-2px)

Active/Pressed State:
  Background: #1E8449 (Darkest)
  Shadow: 1px (inset)
  Transform: translateY(0px)

TOOLTIP EXAMPLES:

On Marketplace Card:
  ├─ Food name
  ├─ EXP cost
  ├─ Stats bonuses (+STR, +HP, etc)
  ├─ Duration
  ├─ Any special effects
  └─ [ BUY ] button

On Quest Card:
  ├─ Quest objective
  ├─ Progress (if started)
  ├─ XP reward
  ├─ Time remaining
  └─ [ CLAIM ] or [ START ]

On Cosmetics Item:
  ├─ Item name
  ├─ EXP cost
  ├─ Rarity (Common/Rare/Legendary)
  ├─ Buff description (if any)
  ├─ Current status (Owned/Equipped/Not Owned)
  └─ [ EQUIP ], [ BUY ], or [ UNEQUIP ]

FOCUS STATES (Keyboard Navigation):

Focus Ring:
  ├─ Visible on Tab key
  ├─ Style: 2px solid color
  ├─ Color: Matches accent color
  ├─ Offset: 2px from element
  └─ Animation: Subtle glow

Tabbing Order:
  1. Top navigation
  2. Main character area
  3. Left sidebar (quests)
  4. Center content (gauges, progress)
  5. Right sidebar (analytics)
  6. Bottom buttons
  └─ Logical flow left-to-right, top-to-bottom

CLICK INTERACTIONS:

Card Click:
  ├─ Tap/click → Preview details
  ├─ Double-click → Buy (with confirmation)
  ├─ Right-click → Context menu (add to favorites, etc)
  └─ Drag (optional) → Reorder items

Button Click:
  ├─ Click feedback: Scale 0.95x (press effect)
  ├─ Ripple effect: Spreads from click point
  ├─ Duration: 300ms
  └─ Then execute action

Link Hover:
  ├─ Color change
  ├─ Underline appears
  ├─ Cursor: pointer
  └─ Smooth transition (200ms)
```

---

## 3. DATA VISUALIZATION (การแสดงผลข้อมูลเชิงลึก)

### 3.1 Mobile Data Visualization

```
TAB-BASED LAYOUT (Separate tabs for detail views):

PRIMARY TAB: SUMMARY (Default view on dashboard)
  ├─ Character + Gauges
  ├─ Today's summary
  └─ Quick metrics

SECONDARY TABS (Swipe or tap):

├─ 📈 WEIGHT TREND
│  ┌─────────────────────────┐
│  │ WEIGHT HISTORY (Last 7d)│
│  │ Mon: 50.2 kg            │
│  │ Tue: 50.1 kg            │
│  │ Wed: 50.0 kg ⭐         │
│  │ Thu: 49.9 kg            │
│  │ Fri: 49.8 kg ⭐         │
│  │ Sat: 50.0 kg            │
│  │ Sun: 49.9 kg            │
│  │                         │
│  │ [Compact line graph]    │
│  │ ▁▂▁▀▁▁▂                 │
│  │                         │
│  │ AVG: 50.0 kg (stable)   │
│  │ TREND: -0.3 kg/week ✓   │
│  └─────────────────────────┘
│
├─ 📊 CALORIES LOG
│  ┌─────────────────────────┐
│  │ DAILY BREAKDOWN         │
│  │ Breakfast: 350 kcal     │
│  │ Lunch: 450 kcal         │
│  │ Snack: 100 kcal         │
│  │ Dinner: 0 kcal (pending)│
│  │ ─────────────────────   │
│  │ Total: 900 / 1850 kcal  │
│  │ Progress: ████░░░░░░    │
│  │                         │
│  │ Burned: 150 kcal        │
│  │ Net: 750 kcal (Good)    │
│  └─────────────────────────┘
│
├─ 📈 BMI CHART
│  ┌─────────────────────────┐
│  │ BMI HISTORY (Last 30d)  │
│  │ [Compact trend line]    │
│  │ ▁▁▂▁▁▀▀▂▁              │
│  │ ▂▃▂▁▂▃▂▁▂              │
│  │                         │
│  │ Current: 19.53          │
│  │ Category: Normal ✓      │
│  │ Change: -0.20 pts ↓     │
│  │ Goal: < 25              │
│  └─────────────────────────┘
│
├─ 🎯 QUEST HISTORY
│  ┌─────────────────────────┐
│  │ LAST 7 DAYS             │
│  │ Mon: 3/5 quests ✓✓✓     │
│  │ Tue: 5/5 quests ✓✓✓✓✓   │
│  │ Wed: 2/5 quests ✓✓      │
│  │ Thu: 4/5 quests ✓✓✓✓    │
│  │ Fri: 3/5 quests ✓✓✓     │
│  │ Sat: 5/5 quests ✓✓✓✓✓   │
│  │ Sun: 1/5 quests ✓       │
│  │ ─────────────────────   │
│  │ AVG: 3.3/5 per day      │
│  │ Completion: 66% ⭐      │
│  └─────────────────────────┘
│
└─ 💪 STATS GROWTH
   ┌─────────────────────────┐
   │ STAT PROGRESSION        │
   │ Strength: 50 → 55 (+5)  │
   │ Endurance: 50 → 52 (+2) │
   │ Intel: 60 → 62 (+2)     │
   │ Stamina: 60 → 65 (+5)   │
   │ Health: 80 → 90 (+10)   │
   │                         │
   │ [Each with small bars]  │
   │ Strongest: STR ★★★★★   │
   │ Weakest: END ★★☆☆☆    │
   └─────────────────────────┘

Compact Display:
  ✅ Charts use minimal space (fits 320px width)
  ✅ Use bar/line charts (not pie charts - hard to tap)
  ✅ Numbers shown clearly (not labels only)
  ✅ Swipe to change tabs
  ✅ Data updates in real-time
  ✅ Touch-friendly legend (tap to toggle data)
```

### 3.2 Desktop Data Visualization

```
MULTI-GRAPH DASHBOARD (All visible simultaneously):

LEFT PANEL (25%):
┌──────────────────────────────┐
│ 📊 QUICK STATS               │
├──────────────────────────────┤
│ Weight: 50.0 kg (↓ 0.2kg)   │
│ BMI: 19.53 (Normal) ✓        │
│ Calories Eaten: 950 kcal     │
│ Daily Goal: 1850 kcal        │
│ Remaining: 900 kcal ✓        │
│ Burned: 150 kcal             │
│ Net: 750 kcal (Balanced)     │
│ Quests: 3/5 (60%)           │
│ Streak: 12 days 🔥           │
└──────────────────────────────┘

CENTER PANEL (50%):
┌──────────────────────────────────────────┐
│ CHARACTER + GAUGES                       │
│ [Avatar with full cosmetics display]     │
│ Size: 100% (shows real-time scale)       │
│ ┌──────────────────────────────────────┐ │
│ │ Gauges:                              │ │
│ │ 🍽️ Hunger: 75% (████████░░)         │ │
│ │ ❤️ Health: 95% (██████████)         │ │
│ │ ⚡ Stamina: 68% (███████░░░)         │ │
│ │ 😴 Fatigue: 15% (██░░░░░░░░)         │ │
│ │ 😰 Stress: 28% (███░░░░░░░)          │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘

RIGHT PANEL (25%):
┌──────────────────────────────┐
│ 📈 TREND ANALYSIS            │
├──────────────────────────────┤
│                              │
│ BMI HISTORY (30 days):       │
│ ▁▁▂▁▁▀▀▂▁▂▃▂▁▂▃▂▁▂▃▂▁▂▃   │
│ 19.5┤ ╱╲                  │
│ 19.6┤╱  ╲╱╲               │
│ 19.7┤      ╲  ╱╲          │
│     └─────────────────────┘
│ ▼ Current: 19.53            │
│ ▼ Target: < 25.0            │
│ ✓ On track!                 │
│                              │
├──────────────────────────────┤
│                              │
│ CALORIE INTAKE (Last 7d):   │
│ 1200┤         ╱╲             │
│ 1400┤    ╱╲  ╱  ╲           │
│ 1600┤   ╱  ╲╱    ╲          │
│ 1800┤  ╱         ╲          │
│ 2000┤ ╱           ╲╱       │
│     └─────────────────────┘
│ ▼ Daily Avg: 1350 kcal      │
│ ▼ Target: 1850 kcal        │
│ ! Undereating (-500 avg)    │
│                              │
└──────────────────────────────┘

OPTIONAL BOTTOM SECTION (Full width):
┌──────────────────────────────────────────┐
│ 📅 WEEKLY SUMMARY                        │
├──────────────────────────────────────────┤
│ Day │ Quests │ Calories │ Steps │ BMI  │
├─────┼────────┼──────────┼───────┼──────┤
│ Mon │ 3/5 ✓✓ │ 1350/1850│ 7,500 │19.53 │
│ Tue │ 5/5 ✓✓✓│ 1500/1850│ 8,900 │19.52 │
│ Wed │ 2/5 ✓  │ 1200/1850│ 5,200 │19.51 │
│ Thu │ 4/5 ✓✓ │ 1400/1850│ 7,800 │19.51 │
│ Fri │ 3/5 ✓✓ │ 1100/1850│ 6,500 │19.50 │
│ Sat │ 5/5 ✓✓✓│ 1600/1850│ 9,200 │19.51 │
│ Sun │ 1/5 ✓  │ 0950/1850│ 3,200 │19.53 │
├─────┼────────┼──────────┼───────┼──────┤
│ AVG │ 3.3/5  │ 1306/1850│ 7,042 │19.51 │
│ STD │ ±1.5   │ ±184 kcal│ ±2.2k │±0.01 │
└──────────────────────────────────────────┘

GRAPH FEATURES:
  ✅ Trend lines show direction (↑ ↓ →)
  ✅ Color coding (Green=Good, Orange=Warning, Red=Bad)
  ✅ Hover for exact values (Tooltip)
  ✅ Click legend to toggle data
  ✅ Zoom/Pan on graphs (optional)
  ✅ Export data as CSV (button)
  ✅ Refresh updates in real-time
  ✅ Animated transitions (smooth 500ms)

TOOLS:
  ├─ Date range selector (Last 7/30/90 days)
  ├─ Metric selector (BMI/Weight/Calories/Quests)
  ├─ Comparison mode (Compare weeks)
  ├─ Download report (PDF/CSV)
  └─ Print dashboard
```

### 3.3 Data Visualization Components

```
CHART TYPES USED:

Line Chart (for trends):
  ├─ BMI history (shows weight management)
  ├─ Calorie intake (shows eating patterns)
  ├─ XP progress (shows level progression)
  └─ Health score (shows overall wellness)

Bar Chart (for comparisons):
  ├─ Daily calorie breakdown
  ├─ Stats comparison (STR vs END vs INT)
  ├─ Quests per day (completion rate)
  └─ Weekly summary

Gauge/Radial Chart (for current state):
  ├─ Health score (88/100)
  ├─ Daily progress (%)
  └─ Stress/Fatigue meters

Sparklines (for mini trends):
  ├─ Tiny charts next to numbers
  ├─ Shows direction at a glance
  ├─ Mobile-friendly (no labels needed)
  └─ Use: BMI, Weight, XP, Quest completion

Color Coding:
  🟢 Green: On track / Excellent / Above target
  🟠 Orange: Warning / Below target / At risk
  🔴 Red: Critical / Far below / Emergency
  🔵 Blue: Info / Reference line / Comparison

INTERACTIVE FEATURES:

Hover (Desktop):
  ├─ Show exact value
  ├─ Highlight data point
  ├─ Show timestamp
  ├─ Display comparison to previous
  └─ Cursor becomes pointer

Click (Desktop/Mobile):
  ├─ Open detailed view
  ├─ Toggle data visibility
  ├─ Filter by category
  └─ Compare time periods

Tap (Mobile):
  ├─ Tap legend → Toggle data series
  ├─ Tap point → Show value
  ├─ Tap graph area → Zoom (optional)
  └─ Swipe → Pan across time

RESPONSIVE ADJUSTMENTS:

Mobile (Graphs hidden in tabs):
  ├─ Chart height: Max 200px
  ├─ Simplified legend (text only, no colors)
  ├─ Show last 7 days (not 30 or 90)
  ├─ No hover tooltips (use tap instead)
  └─ Export button available

Tablet (Medium graphs visible):
  ├─ Chart height: 250-300px
  ├─ Show last 14 days
  ├─ Include legend
  ├─ Basic hover support
  └─ 1-2 graphs per section

Desktop (Full visualization):
  ├─ Chart height: 300-400px
  ├─ Show last 30+ days
  ├─ Multiple graphs side-by-side
  ├─ Advanced hover tooltips
  ├─ Zoom/Pan enabled
  └─ Export to PDF available
```

---

## 4. IMPLEMENTATION GUIDELINES

### 4.1 CSS Media Queries

```css
/* Mobile First Approach */

/* Default: Mobile (320px) */
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.navigation {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  width: 100%;
}

/* Tablet: 768px and up */
@media (min-width: 768px) {
  .dashboard {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 24px;
  }

  .navigation {
    position: relative;
    bottom: auto;
    flex-direction: column;
    gap: 12px;
  }
}

/* Desktop: 1200px and up */
@media (min-width: 1200px) {
  .dashboard {
    grid-template-columns: 300px 1fr 300px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .graphs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}
```

### 4.2 Touch vs Hover Interactions

```javascript
// Detect device type
const isMobile = () => window.innerWidth < 768;
const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1200;
const isDesktop = () => window.innerWidth >= 1200;

// Conditional initialization
if (isMobile()) {
  // Mobile: Use touch events, no hover
  element.addEventListener('click', handleTap);
  element.addEventListener('long-press', handleLongPress); // Custom event
  element.addEventListener('swipe-left', handleSwipe);
} else if (isTablet()) {
  // Tablet: Support both
  element.addEventListener('touch-start', handleTouchStart);
  element.addEventListener('mouse-enter', showTooltip);
} else {
  // Desktop: Full hover support
  element.addEventListener('mouse-enter', showDetailedTooltip);
  element.addEventListener('mouse-leave', hideTooltip);
  element.addEventListener('mouse-move', updateTooltipPosition);
}

// Custom long-press handler
function handleLongPress(event) {
  const card = event.target.closest('.card');
  if (card) {
    showDetailModal(card);
  }
}

// Custom swipe handler
function handleSwipe(event) {
  const { direction } = event.detail;
  if (direction === 'left') {
    goToNextCategory();
  } else if (direction === 'right') {
    goToPreviousCategory();
  }
}
```

### 4.3 Performance Optimization

```
MOBILE OPTIMIZATION:
  ✅ Lazy load images (charts, avatars)
  ✅ Defer non-critical CSS
  ✅ Minimize graph complexity (fewer data points)
  ✅ Cache frequently accessed data
  ✅ Use requestAnimationFrame for animations

DESKTOP OPTIMIZATION:
  ✅ Pre-load all data upfront
  ✅ Larger dataset display (30-90 days history)
  ✅ Advanced calculations (trends, predictions)
  ✅ Complex animations (smooth transitions)
  ✅ WebGL for 3D character (optional)

SHARED:
  ✅ Debounce resize events (300ms)
  ✅ Throttle scroll events (60 FPS target)
  ✅ Use CSS transforms for animations
  ✅ Minimize reflows/repaints
  ✅ Virtualize long lists (DOM recycling)
```

---

**STATUS: Responsive Design & Interactions Complete** ✅

All platforms covered:
- ✅ Mobile (single column, bottom nav, touch-optimized)
- ✅ Tablet (hybrid 2-3 column, mixed interactions)
- ✅ Desktop (full dashboard, hover effects, comprehensive data)
- ✅ Touch gestures (tap, swipe, long-press)
- ✅ Mouse interactions (hover, tooltips, focus)
- ✅ Data visualization (tab-based mobile, full graphs desktop)
