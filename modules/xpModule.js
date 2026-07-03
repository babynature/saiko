// modules/xpModule.js — XP shop inventory & buff tracking

const SHOP_DATA = {
  power_ups: [
    { id:'strength_boost', name_th:'เพิ่มพลัง',    name_en:'Strength Boost',  desc_th:'+5 Strength 24h', desc_en:'+5 Strength 24h', xp_cost:100, icon:'💪', effect_type:'stat_boost', stat:'strength', amount:5, duration_hours:24, rarity:'common' },
    { id:'endurance_boost',name_th:'เพิ่มความทน',   name_en:'Endurance Boost', desc_th:'+5 Endurance 24h',desc_en:'+5 Endurance 24h',xp_cost:100, icon:'⚡', effect_type:'stat_boost', stat:'endurance',amount:5, duration_hours:24, rarity:'common' },
    { id:'wisdom_surge',   name_th:'เพิ่มปัญญา',    name_en:'Wisdom Surge',    desc_th:'+5 Intelligence 24h',desc_en:'+5 Intelligence 24h',xp_cost:100,icon:'🧠',effect_type:'stat_boost',stat:'intelligence',amount:5,duration_hours:24,rarity:'common' },
    { id:'health_recovery',name_th:'ฟื้นฟูสุขภาพ', name_en:'Health Recovery', desc_th:'+10 Health',      desc_en:'+10 Health',       xp_cost:150, icon:'❤️', effect_type:'stat_instant',stat:'health',  amount:10,duration_hours:0,  rarity:'uncommon' },
  ],
  perks: [
    { id:'double_xp_24h',  name_th:'Double XP 1วัน',name_en:'Double XP 1 Day', desc_th:'XP 2x เป็นเวลา 24h',desc_en:'2x XP for 24h',  xp_cost:250, icon:'🎯', effect_type:'xp_multiplier',multiplier:2.0,duration_hours:24,rarity:'rare' },
    { id:'double_xp_7d',   name_th:'Double XP 7วัน',name_en:'Double XP 7 Days',desc_th:'XP 2x เป็นเวลา 7วัน',desc_en:'2x XP for 7 days',xp_cost:1000,icon:'🎯',effect_type:'xp_multiplier',multiplier:2.0,duration_hours:168,rarity:'legendary' },
    { id:'quest_skip',     name_th:'บัตรข้ามเควสต์',name_en:'Quest Skip Pass',  desc_th:'ข้ามเควสต์ได้ 1 ข้อ',desc_en:'Skip 1 quest',   xp_cost:150, icon:'🚀', effect_type:'quest_skip',rarity:'uncommon' },
    { id:'streak_recover', name_th:'ฟื้น Streak',  name_en:'Streak Recovery',  desc_th:'คืน Streak 1 วัน', desc_en:'Recover 1 streak day',xp_cost:300,icon:'🔥',effect_type:'streak_restore',rarity:'rare' },
  ],
  cosmetics: [
    { id:'color_red',    name_th:'สีแดง',   name_en:'Red Color',    desc_th:'ตัวละครสีแดง',  desc_en:'Red character', xp_cost:50,  icon:'🔴', effect_type:'color',  value:'red',     rarity:'common',    unlock_level:1 },
    { id:'color_green',  name_th:'สีเขียว', name_en:'Green Color',  desc_th:'ตัวละครสีเขียว',desc_en:'Green character',xp_cost:50,  icon:'🟢', effect_type:'color',  value:'green',   rarity:'common',    unlock_level:1 },
    { id:'color_purple', name_th:'สีม่วง',  name_en:'Purple Color', desc_th:'ตัวละครสีม่วง', desc_en:'Purple character',xp_cost:50, icon:'🟣', effect_type:'color',  value:'purple',  rarity:'common',    unlock_level:1 },
    { id:'color_gold',   name_th:'สีทอง',   name_en:'Gold Color',   desc_th:'ตัวละครสีทอง',  desc_en:'Gold character',xp_cost:75,  icon:'🟡', effect_type:'color',  value:'gold',    rarity:'uncommon',  unlock_level:5 },
    { id:'color_rainbow',name_th:'สีรุ้ง',  name_en:'Rainbow',      desc_th:'สีรุ้ง',         desc_en:'Rainbow',       xp_cost:150, icon:'🌈', effect_type:'color',  value:'rainbow', rarity:'legendary', unlock_level:30 },
    { id:'aura_golden',  name_th:'ออร่าทอง',name_en:'Golden Aura',  desc_th:'ออร่าสีทอง',    desc_en:'Golden aura',   xp_cost:75,  icon:'✨', effect_type:'aura',   value:'golden',  rarity:'uncommon',  unlock_level:10 },
    { id:'aura_azure',   name_th:'ออร่าฟ้า', name_en:'Azure Aura',  desc_th:'ออร่าสีฟ้า',    desc_en:'Azure aura',    xp_cost:75,  icon:'🔵', effect_type:'aura',   value:'azure',   rarity:'uncommon',  unlock_level:10 },
    { id:'wings_angel',  name_th:'ปีกเทพ',  name_en:'Angel Wings',  desc_th:'ปีกเทพดุน',     desc_en:'Angel wings',   xp_cost:150, icon:'😇', effect_type:'accessory',value:'wings_angel',rarity:'rare',  unlock_level:20 },
    { id:'crown_gold',   name_th:'มงกุฎทอง',name_en:'Golden Crown', desc_th:'มงกุฎทองคำ',    desc_en:'Golden crown',  xp_cost:200, icon:'👑', effect_type:'accessory',value:'crown',  rarity:'rare',      unlock_level:25 },
    { id:'pet_dragon',   name_th:'มังกรน้อย',name_en:'Dragon Pet',  desc_th:'มังกรขนาดเล็ก', desc_en:'Mini dragon',   xp_cost:250, icon:'🐲', effect_type:'pet',    value:'dragon',  rarity:'legendary', unlock_level:35 },
  ],
};

class XPModule {
  constructor() {
    this.inventory = {};  // { itemId: { quantity, equipped } }
    this.totalSpent = 0;
  }

  getAllItems(category) {
    if (category === 'all') return Object.values(SHOP_DATA).flat();
    return SHOP_DATA[category] || [];
  }

  getItem(id) {
    return Object.values(SHOP_DATA).flat().find(i => i.id === id);
  }

  owns(id) { return !!(this.inventory[id] && this.inventory[id].quantity > 0); }

  buy(itemId, currentXP, playerLevel) {
    const item = this.getItem(itemId);
    if (!item) return { success: false, msg: 'Item not found' };
    if (item.unlock_level && playerLevel < item.unlock_level) {
      return { success: false, msg: `Requires Lv.${item.unlock_level}` };
    }
    if (currentXP < item.xp_cost) return { success: false, msg: t('shop_no_xp') };
    if (!this.inventory[itemId]) this.inventory[itemId] = { quantity: 0 };
    this.inventory[itemId].quantity++;
    this.totalSpent += item.xp_cost;
    return { success: true, cost: item.xp_cost, item };
  }

  applyItem(itemId) {
    const item = this.getItem(itemId);
    if (!item || !this.owns(itemId)) return false;
    const ch = window.characterModule;

    if (item.effect_type === 'stat_boost' || item.effect_type === 'stat_instant') {
      ch.addBuff(itemId, item.stat, item.amount, item.duration_hours || 0);
      if (item.effect_type === 'stat_instant') {
        this.inventory[itemId].quantity--;
      }
    }
    if (item.effect_type === 'xp_multiplier') {
      ch.setXPMultiplier(item.multiplier, item.duration_hours);
      this.inventory[itemId].quantity--;
    }
    if (item.effect_type === 'color') {
      ch.equipCosmetic('color', item.value);
      this.inventory[itemId].equipped = true;
    }
    if (item.effect_type === 'aura') {
      ch.equipCosmetic('aura', item.value);
      this.inventory[itemId].equipped = true;
    }
    if (item.effect_type === 'accessory') {
      ch.equipCosmetic('accessory', item.value);
      this.inventory[itemId].equipped = true;
    }
    if (item.effect_type === 'pet') {
      ch.equipCosmetic('pet', item.value);
      this.inventory[itemId].equipped = true;
    }
    return true;
  }

  getItemName(item) {
    return currentLang === 'en' ? item.name_en : item.name_th;
  }

  getItemDesc(item) {
    return currentLang === 'en' ? item.desc_en : item.desc_th;
  }

  toJSON() { return { inventory: this.inventory, totalSpent: this.totalSpent }; }
  fromJSON(d) { this.inventory = d.inventory || {}; this.totalSpent = d.totalSpent || 0; }
}

window.xpModule = new XPModule();
