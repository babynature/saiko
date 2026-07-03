// modules/achievementModule.js — Achievement & Badge System

const ACHIEVEMENTS = [
  // First-time actions
  { id:'first_meal',   icon:'🍽️', trigger:'meal',     xp:20,  name_th:'มื้อแรก',          name_en:'First Bite',       desc_th:'กินอาหารครั้งแรก',              desc_en:'Eat your first food'           },
  { id:'first_water',  icon:'💧', trigger:'water',    xp:10,  name_th:'แก้วแรก',           name_en:'First Sip',        desc_th:'ดื่มน้ำครั้งแรก',               desc_en:'Log your first glass of water' },
  { id:'first_ex',     icon:'🏃', trigger:'exercise', xp:30,  name_th:'ก้าวแรก',           name_en:'First Step',       desc_th:'ออกกำลังกายครั้งแรก',           desc_en:'Exercise for the first time'   },
  { id:'first_sleep',  icon:'😴', trigger:'sleep',    xp:20,  name_th:'นอนครั้งแรก',       name_en:'Lights Out',       desc_th:'บันทึกการนอนครั้งแรก',          desc_en:'Log your first sleep'          },
  { id:'first_weight', icon:'⚖️', trigger:'weight',   xp:25,  name_th:'ชั่งน้ำหนัก',       name_en:'Step On Scale',    desc_th:'บันทึกน้ำหนักครั้งแรก',         desc_en:'Log weight for the first time' },
  { id:'first_quest',  icon:'✅', trigger:'quest',    xp:30,  name_th:'ภารกิจสำเร็จ!',     name_en:'Quest Complete!',  desc_th:'ทำเควสต์แรกสำเร็จ',             desc_en:'Complete your first quest'     },
  // Exercise milestones
  { id:'burn_300',     icon:'🔥', trigger:'exercise', xp:50,  name_th:'ไฟลุก',             name_en:'Calorie Burner',   desc_th:'เผา 300+ kcal ในวันเดียว',      desc_en:'Burn 300+ kcal in one day'     },
  { id:'swim_first',   icon:'🏊', trigger:'exercise', xp:25,  name_th:'นักว่ายน้ำ',        name_en:'Swimmer',          desc_th:'ว่ายน้ำเป็นครั้งแรก',           desc_en:'Log swimming for first time'   },
  { id:'cycle_first',  icon:'🚴', trigger:'exercise', xp:25,  name_th:'นักปั่น',            name_en:'Cyclist',          desc_th:'ปั่นจักรยานเป็นครั้งแรก',       desc_en:'Log cycling for first time'    },
  // Sleep
  { id:'sleep_good',   icon:'🌙', trigger:'sleep',    xp:30,  name_th:'นอนหลับสนิท',       name_en:'Sweet Dreams',     desc_th:'นอน 7-9 ชม. ครั้งแรก',          desc_en:'Log 7-9 hours quality sleep'   },
  // Quests
  { id:'all_quests',   icon:'🏆', trigger:'quest',    xp:100, name_th:'วันสมบูรณ์',         name_en:'Perfect Day',      desc_th:'ทำครบ 5 เควสต์ใน 1 วัน',       desc_en:'Complete all 5 quests today'   },
  { id:'hydrated_day', icon:'🌊', trigger:'water',    xp:40,  name_th:'ดื่มน้ำครบ',         name_en:'Hydrated',         desc_th:'ดื่มน้ำ 8 แก้วใน 1 วัน',        desc_en:'Drink 8 glasses of water'      },
  // Level milestones
  { id:'level_5',      icon:'⭐', trigger:'level',    xp:50,  name_th:'เลเวล 5',            name_en:'Level 5 Hero',     desc_th:'ขึ้นเลเวล 5',                   desc_en:'Reach Level 5'                 },
  { id:'level_10',     icon:'🌟', trigger:'level',    xp:100, name_th:'เลเวล 10',           name_en:'Level 10 Legend',  desc_th:'ขึ้นเลเวล 10',                  desc_en:'Reach Level 10'                },
  { id:'level_20',     icon:'💎', trigger:'level',    xp:200, name_th:'เลเวล 20',           name_en:'Level 20 Master',  desc_th:'ขึ้นเลเวล 20',                  desc_en:'Reach Level 20'                },
  // XP milestones
  { id:'xp_1000',      icon:'💰', trigger:'xp',       xp:50,  name_th:'นักสะสม XP',         name_en:'XP Hoarder',       desc_th:'สะสม XP รวม 1,000',             desc_en:'Accumulate 1,000 total XP'     },
  { id:'xp_5000',      icon:'🏦', trigger:'xp',       xp:100, name_th:'เศรษฐี XP',          name_en:'XP Tycoon',        desc_th:'สะสม XP รวม 5,000',             desc_en:'Accumulate 5,000 total XP'     },
  // Weight milestones
  { id:'lost_1kg',     icon:'📉', trigger:'weight',   xp:75,  name_th:'น้ำหนักลด!',         name_en:'Slimming Down!',   desc_th:'น้ำหนักลด 1 kg จากจุดเริ่ม',   desc_en:'Lose 1 kg from starting weight'},
  { id:'gained_1kg',   icon:'📈', trigger:'weight',   xp:75,  name_th:'น้ำหนักเพิ่ม!',      name_en:'Bulk Up!',         desc_th:'น้ำหนักเพิ่ม 1 kg จากจุดเริ่ม',desc_en:'Gain 1 kg from starting weight'},
  // Streak & longevity
  { id:'streak_3',     icon:'🔥', trigger:'streak',   xp:30,  name_th:'ต่อเนื่อง 3 วัน',    name_en:'On Fire',          desc_th:'Streak 3 วันติดต่อกัน',          desc_en:'3-day login streak'            },
  { id:'days_10',      icon:'📅', trigger:'days',     xp:50,  name_th:'10 วันแล้ว!',         name_en:'10 Days Strong',   desc_th:'เล่นเกมมาแล้ว 10 วัน',          desc_en:'Play for 10 days total'        },
];

class AchievementModule {
  constructor() {
    this.unlocked = {};  // { achievementId: isoDateString }
  }

  check(triggerType, ctx) {
    ctx = ctx || {};
    const newly = [];
    const ch = window.characterModule;
    const hm = window.hungerModule;
    const qm = window.questModule;
    const sk = window.streakModule;

    for (const ach of ACHIEVEMENTS) {
      if (this.unlocked[ach.id]) continue;
      if (ach.trigger !== triggerType) continue;

      let passes = false;
      switch (ach.id) {
        case 'first_meal':   passes = true; break;
        case 'first_water':  passes = true; break;
        case 'first_ex':     passes = true; break;
        case 'first_sleep':  passes = true; break;
        case 'first_weight': passes = true; break;
        case 'first_quest':  passes = true; break;
        case 'burn_300':     passes = (hm.caloriesBurned || 0) >= 300; break;
        case 'swim_first':   passes = ctx.exerciseType === 'swimming'; break;
        case 'cycle_first':  passes = ctx.exerciseType === 'cycling'; break;
        case 'sleep_good':   passes = ctx.hours >= 7 && ctx.hours <= 9; break;
        case 'all_quests':   passes = qm.countCompleted(ch.get('dailyCalorie')) >= 5; break;
        case 'hydrated_day': passes = (hm.waterDrank || 0) >= 8; break;
        case 'level_5':      passes = ch.get('level') >= 5; break;
        case 'level_10':     passes = ch.get('level') >= 10; break;
        case 'level_20':     passes = ch.get('level') >= 20; break;
        case 'xp_1000':      passes = ch.get('totalExp') >= 1000; break;
        case 'xp_5000':      passes = ch.get('totalExp') >= 5000; break;
        case 'lost_1kg':     passes = ctx.change <= -1; break;
        case 'gained_1kg':   passes = ctx.change >= 1; break;
        case 'streak_3':     passes = sk.currentStreak >= 3; break;
        case 'days_10':      passes = sk.totalDaysPlayed >= 10; break;
      }

      if (passes) {
        this.unlocked[ach.id] = new Date().toISOString();
        newly.push(ach);
      }
    }
    return newly;
  }

  getAll()   { return ACHIEVEMENTS; }
  getCount() { return Object.keys(this.unlocked).length; }

  toJSON()    { return { unlocked: this.unlocked }; }
  fromJSON(d) { if (d) this.unlocked = d.unlocked || {}; }
}

window.achievementModule = new AchievementModule();
window.ACHIEVEMENTS      = ACHIEVEMENTS;
