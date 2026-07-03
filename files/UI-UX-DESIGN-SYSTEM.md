# UI/UX DESIGN SYSTEM - Student Health & Character Game

**Status:** Design Specification Complete  
**Version:** 1.0  
**Date:** 2026-07-03  
**Purpose:** Visual design standards for all screens

---

## 1. MAIN DASHBOARD LAYOUT

### 1.1 Visual Hierarchy

```
┌──────────────────────────────────────────────────────────┐
│ HEADER (Profile + Navigation)                            │
│ 👤 Sam  [Lv.5]  🔥 12 Days  ⚙️ [Settings]              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                   CHARACTER VISUAL AREA                  │
│                  (2D or 3D Avatar)                       │
│              Size changes with BMI                       │
│           (90%-130% depending on weight)                 │
│                                                          │
│         Idle animation (breathing, mood)                 │
│      Shows current cosmetics + equipment                 │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ HEALTH GAUGES                                            │
│ 🍽️ Hunger:   [████████░░] 75% (SATISFIED)             │
│ ❤️ Health:   [██████████] 95% (EXCELLENT)             │
│ ⚡ Stamina:  [███████░░░] 68% (GOOD)                   │
│ 😴 Fatigue:  [██░░░░░░░░] 15% (RESTED) ⭐ NEW       │
│ 😰 Stress:   [███░░░░░░░░] 28% (CALM) ⭐ NEW         │
├──────────────────────────────────────────────────────────┤
│ DAILY PROGRESS                                           │
│ 🎯 Calories: 950 / 1850 kcal (51%)                     │
│ 💰 EXP: 450 / 500 (90% to Level 6)                     │
│ 🌍 Steps: 5,230 (from pedometer) ⭐ NEW               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [ 🛒 Marketplace ] [ 📋 Quests ] [ 👕 Cosmetics ] ⭐ │
│                                                          │
│ [ 🏃 Exercise ]    [ 📊 Analytics ] [ 💚 Health ] ⭐    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 1.2 Screen Zones (Mobile-First)

```
ZONE 1: HEADER (Height: 56px)
  ├─ Left: Character name + Level badge
  ├─ Center: Streak counter (days 🔥)
  └─ Right: Settings gear icon

ZONE 2: CHARACTER VISUAL (Height: 200-250px)
  └─ 2D/3D avatar centered
     └─ Shows size (BMI-based)
     └─ Shows cosmetics (if equipped)
     └─ Has idle animation

ZONE 3: HEALTH GAUGES (Height: 120px)
  ├─ 4-5 colored progress bars
  ├─ Icons + labels
  └─ Color feedback (green/orange/red)

ZONE 4: DAILY PROGRESS (Height: 80px)
  ├─ Calories tracker
  ├─ XP progress bar
  └─ Steps from pedometer (new)

ZONE 5: NAVIGATION BUTTONS (Height: 100px)
  ├─ 6 main buttons (2 rows × 3)
  ├─ Icons + labels
  └─ Highlight active section

BOTTOM: Spacer for mobile safe zone (20px)
```

---

## 2. KEY UI COMPONENTS

### 2.1 Dynamic Progress Bars (Gauges)

```
Color System:
┌─────────────────────────────────────┐
│ 🟢 GREEN (Safe/Normal)              │
│   └─ Hunger 40-100%                 │
│   └─ Health 70-100%                 │
│   └─ Stamina 50-100%                │
│                                     │
│ 🟠 ORANGE (Warning/Caution)         │
│   └─ Hunger 20-40%                  │
│   └─ Health 40-70%                  │
│   └─ Stamina 20-50%                 │
│   └─ Stress 50-75%                  │
│                                     │
│ 🔴 RED (Critical/Danger)            │
│   └─ Hunger 0-20%                   │
│   └─ Health 0-40%                   │
│   └─ Stamina 0-20%                  │
│   └─ Stress 75-100%                 │
└─────────────────────────────────────┘

Visual Design:
┌───────────────────────────────────────┐
│ 🍽️ Hunger                            │
│ [████████░░] 75% (SATISFIED)         │
│  └─ Color: Green                     │
│  └─ Fill animation: Smooth           │
│  └─ Label: Shows percentage + status  │
│  └─ Changes color based on value     │
└───────────────────────────────────────┘

Implementation:
  ├─ Use CSS linear gradient
  ├─ Color transitions: green → orange → red
  ├─ Smooth animation on value change (0.5s)
  ├─ Show numeric value next to bar
  └─ Show status text (EXCELLENT/GOOD/WARNING/CRITICAL)
```

### 2.2 Floating Damage/Reward Numbers

```
When action completes:

    +50 EXP
      ↑
      ↑ (animates upward)
      ↑
   [Action]

Mechanics:
  ├─ Appear at character/action location
  ├─ Rise smoothly for 1 second
  ├─ Fade out at end
  ├─ Color by type:
  │  ├─ Green: +Health, +Stamina
  │  ├─ Yellow: +XP
  │  ├─ Purple: +Stats
  │  └─ Red: -Health, Damage
  └─ Font: Bold, 24px+

Examples:
  +50 EXP         (Yellow)
  +10 Health      (Green)
  +20 Strength    (Purple)
  -5 HP           (Red)
  "Great job!"    (Text compliment)
```

### 2.3 Card-Based Marketplace (Food)

```
Grid Layout: 2 columns on mobile, 3 on tablet

┌──────────────────┐ ┌──────────────────┐
│                  │ │                  │
│     🍗          │ │     🥗          │
│  Chicken Rice   │ │   Pad Thai      │
│                  │ │                  │
│  50 EXP         │ │  60 EXP         │
│  +50 Hunger     │ │  +55 Hunger     │
│                  │ │                  │
│  ⭐ +10 STR     │ │  ⭐ +8 STR      │
│  ⭐ +15 HP      │ │  ⭐ +10 END     │
│                  │ │                  │
│ [ BUY ]         │ │ [ BUY ]         │
│                  │ │                  │
└──────────────────┘ └──────────────────┘

Card Elements:
  ├─ Large icon (emoji or sprite)
  ├─ Item name (bold)
  ├─ Price (EXP) - EMPHASIZED
  ├─ Hunger restore value
  ├─ Stat bonus tags
  ├─ BMI price modifier note (if changed)
  ├─ Highlight/glow if on sale (-20%)
  └─ Action button [ BUY ] or [ SOLD OUT ]

Interactions:
  ├─ Tap card → Preview details
  ├─ Tap [ BUY ] → Confirmation dialog
  ├─ Long press → Show full description
  └─ Swipe left/right → Browse categories
```

### 2.4 Cosmetics Wardrobe Display

```
Tab Layout:
┌──────────────────────────────────────┐
│ [👕 Clothing] [👜 Accessories] [💇 Hair] │
├──────────────────────────────────────┤
│                                      │
│ CHARACTER PREVIEW (Update in real-time)
│ ┌──────────────────────────────────┐ │
│ │        👦 Sam                    │ │
│ │  (Shows current cosmetics)       │ │
│ │  Wearing: Gym Outfit            │ │
│ │  + Nerd Glasses                 │ │
│ │  + Blue Hair                    │ │
│ └──────────────────────────────────┘ │
│                                      │
│ AVAILABLE ITEMS:                     │
│ ┌────────────┐  ┌────────────┐      │
│ │ 👕        │  │ 👕        │      │
│ │ School    │  │ Gym       │      │
│ │ Uniform   │  │ Outfit    │      │
│ │ 0 EXP ✓  │  │ 150 EXP  │      │
│ │[Equipped] │  │ [BUY]     │      │
│ └────────────┘  └────────────┘      │
│                                      │
│ ┌────────────┐  ┌────────────┐      │
│ │ 👕        │  │ 👕        │      │
│ │ Formal    │  │ Magical   │      │
│ │ Suit      │  │ Robe      │      │
│ │ 500 EXP  │  │ 1000 EXP │      │
│ │ [BUY]     │  │ [BUY]     │      │
│ └────────────┘  └────────────┘      │
│                                      │
│ Current EXP: 450 / 500              │
│                                      │
└──────────────────────────────────────┘

Features:
  ├─ Real-time preview updates
  ├─ Show equipped items with checkmark
  ├─ Highlight items on sale
  ├─ Show buff descriptions on hover
  └─ Price in large text
```

### 2.5 Quest Card Display

```
┌─────────────────────────────────────┐
│ 📋 DAILY QUESTS (3/5 completed)     │
├─────────────────────────────────────┤
│                                     │
│ ✅ LOG MEALS (Completed)           │
│    Goal: Log 3 meals               │
│    Progress: ████████ 3/3          │
│    Reward: 50 XP                   │
│                                     │
│ ⏳ STAY WITHIN GOAL (In Progress) │
│    Goal: Keep ≤ 1850 kcal         │
│    Progress: 950/1850 kcal (51%)  │
│    Reward: 100 XP                  │
│                                     │
│ ⏳ EXERCISE CHALLENGE (In Progress)│
│    Goal: Burn 300+ kcal            │
│    Progress: ████░░░░░░░ 120/300  │
│    Reward: 150 XP                  │
│                                     │
│ ❌ DRINK WATER (Not Started)       │
│    Goal: Drink 8 glasses           │
│    Progress: 0/8                   │
│    Reward: 25 XP                   │
│    [START] button available        │
│                                     │
│ ⏳ BALANCE NUTRITION (In Progress) │
│    Goal: Eat all 3 meals           │
│    Progress: 2/3 meals             │
│    Reward: 75 XP                   │
│                                     │
└─────────────────────────────────────┘

Design Elements:
  ├─ Emoji/icon status indicator
  ├─ Quest name (bold)
  ├─ Goal description
  ├─ Progress bar with percentage
  ├─ Reward badge (XP amount)
  ├─ Action button (when applicable)
  └─ Sort: Completed first, then active
```

### 2.6 Health Dashboard View

```
┌──────────────────────────────────────┐
│ 💚 HEALTH OVERVIEW                   │
├──────────────────────────────────────┤
│                                      │
│ TODAY'S SUMMARY:                     │
│ ├─ Hunger: 75% (Good)               │
│ ├─ Fatigue: 15% (Well-rested)      │
│ ├─ Stress: 28% (Calm)               │
│ ├─ Health: 95/100 (Excellent)      │
│ └─ Overall Score: 88/100 ⭐ NEW    │
│                                      │
│ SLEEP LAST NIGHT: 8.5 hours ✓      │
│ └─ Bonus: +10% XP today            │
│                                      │
│ THIS WEEK'S EVENTS: ⭐ NEW          │
│ 🎓 Exam Week (3/5 days remaining)  │
│ └─ Hunger +50% | Stress +5/hr      │
│                                      │
│ RECOMMENDATIONS:                     │
│ ✓ Sleep well tonight (8 hours)      │
│ ✓ Eat more balanced meals           │
│ ⚠️ Stress building (try relax!)     │
│ ✓ Good exercise progress!           │
│                                      │
└──────────────────────────────────────┘
```

---

## 3. INTERACTION DESIGN & ANIMATIONS

### 3.1 Micro-Interactions

```
Purchase Action:
  1. User taps [ BUY ]
  2. Dialog appears: "Spend 50 EXP for Chicken Rice?"
  3. User confirms
  4. Animation:
     └─ EXP icon flies from counter to character
     └─ Food icon appears at character
     └─ Floating text "+50 Hunger" rises up
     └─ Hunger gauge animates upward
     └─ Character animation: eating/happy
     └─ Success sound plays
  5. Toast notification: "Enjoyed delicious meal! +15 HP"

Quest Completion:
  1. Quest condition met (e.g., 3 meals logged)
  2. Quest card briefly highlights (pulse animation)
  3. Checkmark appears: ✅
  4. Floating text: "+50 XP" rises from quest
  5. XP gauge animates upward
  6. Toast: "Quest completed! Great job!"

Level Up:
  1. XP reaches threshold
  2. Screen shakes slightly
  3. Full-screen effect: Fireworks/celebration
  4. Character animates: jumping/celebrating
  5. Large text: "LEVEL UP! Lv 5 → Lv 6"
  6. Character stats glow briefly
  7. Confetti falls (optional)
  8. Victory sound plays
```

### 3.2 Character Feedback & Animations

```
IDLE ANIMATION (Always Playing):
  └─ Gentle breathing (scale 0.98-1.02)
  └─ Period: 3 seconds
  └─ Repeat continuously

HUNGER FEEDBACK:
  High (70-100%): 
    └─ Character smiles/glows
    └─ Happy facial expression
    └─ Bright colors
  
  Normal (40-70%):
    └─ Neutral expression
    └─ Normal colors
  
  Low (20-40%):
    └─ Sad/tired face
    └─ Slightly dim colors
    └─ Slower animations
  
  Critical (0-20%):
    └─ Distressed face
    └─ Reduced color saturation
    └─ Shaking animation every 2 sec
    └─ Character appears weak

STRESS FEEDBACK:
  High Stress (75-100%):
    └─ Character shows worry lines
    └─ Red tint around edges (vignette)
    └─ Slightly faster animations (edgy)
    └─ Occasional flinching animation
  
  Moderate Stress (50-75%):
    └─ Character looks concerned
    └─ Slightly tense posture

FATIGUE FEEDBACK:
  High Fatigue (80-100%):
    └─ Character sways/sleepy eyes
    └─ Slower animations
    └─ Reduced color saturation

COSMETICS DISPLAY:
  └─ Equipment shows on character
  └─ Clothing changes appearance
  └─ Hair style/color visible
  └─ Accessories render on top
  └─ Buffs show as small icons
```

### 3.3 Screen Transitions

```
Navigation Animations:
  ├─ Tap Marketplace → Slide in from right
  ├─ Tap Quests → Fade in
  ├─ Tap Health → Slide up from bottom
  └─ Go back → Reverse animation

Tab Switching:
  └─ Content fades out
  └─ New content fades in
  └─ Animation duration: 300ms

Dialog/Modal:
  ├─ Appears: Scale up from center
  ├─ Background: Fade to black 40% opacity
  ├─ Animation: 250ms ease-out
  └─ Disappears: Scale down (reverse)
```

### 3.4 Visual Feedback Colors

```
BMI-Based Color Scheme:

UNDERWEIGHT:
  └─ Primary: Cool Blue (#4A90E2)
  └─ Accent: Light Blue (#B3D9FF)
  └─ Text: Dark Blue (#1A3A5C)

NORMAL:
  └─ Primary: Fresh Green (#2ECC71)
  └─ Accent: Light Green (#A8E6C1)
  └─ Text: Dark Green (#1A5C3A)

OVERWEIGHT:
  └─ Primary: Warm Orange (#F39C12)
  └─ Accent: Light Orange (#FFD89B)
  └─ Text: Dark Orange (#6B3A0D)

OBESE:
  └─ Primary: Alert Red (#E74C3C)
  └─ Accent: Light Red (#FADBD8)
  └─ Text: Dark Red (#7B2B1F)

Universal:
  └─ Success: Green (#2ECC71)
  └─ Warning: Orange (#F39C12)
  └─ Critical: Red (#E74C3C)
  └─ Info: Blue (#3498DB)
  └─ Background: Light Gray (#ECF0F1)
  └─ Text: Dark Gray (#2C3E50)
```

---

## 4. RESPONSIVE DESIGN (Mobile-First)

### 4.1 Breakpoints

```
Mobile (320px - 480px):
  └─ Single column layout
  └─ Full-width buttons
  └─ Stacked sections
  └─ Large touch targets (min 44px)

Tablet (481px - 768px):
  └─ 2-column layouts where applicable
  └─ Grid marketplace (2x2)
  └─ Larger fonts

Desktop (769px+):
  └─ 3-column marketplace grid
  └─ Side panels
  └─ More detailed views
```

### 4.2 Touch-Friendly Design

```
Button Sizing:
  └─ Minimum: 44px × 44px
  └─ Padding: 12px minimum
  └─ Spacing between buttons: 8px minimum

Text Sizing:
  └─ Body text: 16px
  └─ Headings: 20-28px
  └─ Labels: 14px
  └─ All readable without zoom

Spacing:
  └─ Use 8px grid for consistency
  └─ Margin between sections: 16-24px
  └─ Padding inside containers: 12-16px
```

---

## 5. TYPOGRAPHY & ICONOGRAPHY

### 5.1 Font System

```
Font Family: System fonts (iOS San Francisco, Android Roboto)
  └─ Ensures consistency across platforms
  └─ Better performance

Hierarchy:
  ├─ H1 (Title): 28px, Bold
  ├─ H2 (Section): 20px, Bold
  ├─ H3 (Label): 16px, Medium
  ├─ Body: 14-16px, Regular
  └─ Caption: 12px, Regular

Examples:
  ├─ "Sam" (character name) → H2
  ├─ "Marketplace" (section) → H2
  ├─ "Hunger" (meter label) → H3
  ├─ "Chicken Rice" (item name) → H3
  └─ "50 EXP" (price) → Body Bold
```

### 5.2 Icon System

```
Emoji as Icons (Simple & Universal):
  └─ 👤 Profile/Character
  └─ 🍽️ Hunger/Food
  └─ ❤️ Health
  └─ ⚡ Stamina/Energy
  └─ 😴 Fatigue
  └─ 😰 Stress
  └─ 🛒 Marketplace
  └─ 📋 Quests
  └─ 👕 Cosmetics
  └─ 📊 Analytics
  └─ 💰 EXP/Currency
  └─ 🌟 Star/Rating
  └─ 🔥 Fire/Streak

Custom Icons (If needed):
  └─ Use simple SVG designs
  └─ Keep line thickness consistent (2px)
  └─ Use same color palette as UI
  └─ Size: 24px or multiples
```

---

## 6. DARK MODE & LIGHT MODE

```
Light Mode (Default):
  ├─ Background: #FFFFFF
  ├─ Text: #2C3E50
  ├─ Borders: #BDC3C7
  ├─ Card: #ECF0F1
  └─ Accent: BMI-based color

Dark Mode (Optional):
  ├─ Background: #1A1A1A
  ├─ Text: #ECF0F1
  ├─ Borders: #404040
  ├─ Card: #2C2C2C
  └─ Accent: Brighter BMI-based color
```

---

## 7. ACCESSIBILITY STANDARDS

```
✅ Color Contrast:
  └─ Text vs Background: 4.5:1 minimum (WCAG AA)
  └─ UI vs Background: 3:1 minimum

✅ Text Size:
  └─ Minimum: 14px
  └─ Body: 16px recommended

✅ Touch Targets:
  └─ Minimum: 44px × 44px

✅ Color Independence:
  └─ Don't rely on color alone
  └─ Use icons + labels
  └─ Use patterns (solid, striped, etc)

✅ Screen Reader Support:
  └─ All buttons have labels
  └─ Images have alt text
  └─ Forms labeled properly
  └─ Dynamic content announced
```

---

**STATUS: UI/UX Design System Complete** ✅

All screens designed with:
- Mobile-first approach
- Clear visual hierarchy
- Smooth interactions
- Accessibility standards
- Responsive design
- Dark mode support
