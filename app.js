// app.js — Main Game Orchestrator

const SAVE_KEY = 'shg-v1';

// ═══ PENDING FOOD PURCHASE (for modal) ═══
let _pendingFood = null;
let _currentTabId = 'home';
let _marketFilter = 'all';
let _shopFilter = 'all';

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  // Restore language
  const savedLang = localStorage.getItem('shg-lang');
  if (savedLang) { currentLang = savedLang; }
  document.getElementById(currentLang === 'en' ? 'btn-lang-en' : 'btn-lang-th').classList.add('active');
  document.getElementById(currentLang === 'en' ? 'btn-lang-th' : 'btn-lang-en').classList.remove('active');

  applyTranslations();

  // Phase 7: Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // Phase 6: Init Firebase (if configured)
  firebaseModule.init(onAuthStateChanged);

  const saved = loadGame();
  if (saved) {
    showScreen('game');
    questModule.init();
    streakModule.checkIn(questModule.countCompleted(characterModule.get('dailyCalorie')));
    hungerModule.startTick();
    startStressDrain();
    renderAll();
    // Check streak/days achievements on login
    setTimeout(() => {
      checkAchievements('streak', {});
      checkAchievements('days', {});
    }, 1500);
    // Start scheduled notifications if already enabled
    if (notificationModule.settings.enabled) notificationModule.scheduleAll();
  } else {
    missionModule.init();
    showScreen('onboarding');
    setupBMIPreview();
  }
});

// ═══════════════════════════════════════════
// SAVE / LOAD
// ═══════════════════════════════════════════
function saveGame() {
  hungerModule.lastUpdate = Date.now();
  historyModule.saveSnapshot();
  const state = {
    character: characterModule.toJSON(),
    hunger: hungerModule.toJSON(),
    quests: questModule.toJSON(),
    streak: streakModule.toJSON(),
    xp: xpModule.toJSON(),
    xpBalance: window._xpBalance || 0,
    sleep: sleepModule.toJSON(),
    stress: stressModule.toJSON(),
    weight: weightModule.toJSON(),
    achievements: achievementModule.toJSON(),
    history: historyModule.toJSON(),
    missions: missionModule.toJSON(),
    gear: gearModule.toJSON(),
    water: waterModule.toJSON(),
  };
  const json = JSON.stringify(state);
  localStorage.setItem(SAVE_KEY, json);
  // Phase 6: debounced cloud sync when logged in
  if (firebaseModule.isLoggedIn()) {
    firebaseModule.scheduleSyncToCloud(json);
    updateLeaderboardEntry();
  }
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const state = JSON.parse(raw);
    characterModule.fromJSON(state.character);
    hungerModule.fromJSON(state.hunger);
    questModule.fromJSON(state.quests);
    streakModule.fromJSON(state.streak);
    xpModule.fromJSON(state.xp);
    window._xpBalance = state.xpBalance || 0;
    if (state.sleep)         sleepModule.fromJSON(state.sleep);
    if (state.stress)        stressModule.fromJSON(state.stress);
    if (state.weight)        weightModule.fromJSON(state.weight);
    if (state.achievements)  achievementModule.fromJSON(state.achievements);
    if (state.history)       historyModule.fromJSON(state.history);
    if (state.missions)      missionModule.fromJSON(state.missions);
    else                     missionModule.init();
    if (state.gear)          gearModule.fromJSON(state.gear);
    if (state.water)         waterModule.fromJSON(state.water);
    return true;
  } catch (e) {
    console.error('Load failed', e);
    return false;
  }
}

// Auto-save every 2 minutes
setInterval(saveGame, 120000);

// ═══════════════════════════════════════════
// SCREEN ROUTING
// ═══════════════════════════════════════════
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screenId).classList.add('active');
}

function showTab(tabId) {
  _currentTabId = tabId;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById('tab-' + tabId).classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.getElementById('nav-' + tabId);
  if (navBtn) navBtn.classList.add('active');

  if (tabId === 'home')        { renderGlance(); renderFoodLog(); renderMealSuggest(); renderMacroSummary(); renderWaterTracker(); renderExerciseSuggest(); initFoodSearch(); }
  if (tabId === 'marketplace') renderMarketplace();
  if (tabId === 'quests')      { renderQuests(); renderMissions(); renderExerciseTip(); updateExercisePreview(); }
  if (tabId === 'shop')        renderShop();
  if (tabId === 'profile')     { renderProfile(); renderWeeklySummary(); renderAnalyticsChart(); renderWeightSection(); renderWeightGoal(); renderAchievements(); renderWardrobe(); renderNotifSettings(); }
}

// ═══════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════
function setupBMIPreview() {
  const fields = ['input-height', 'input-weight', 'input-age', 'input-gender', 'input-activity'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateBMIPreview);
  });
  updateBMIPreview();
}

function updateBMIPreview() {
  const h = parseFloat(document.getElementById('input-height').value);
  const w = parseFloat(document.getElementById('input-weight').value);
  const a = parseInt(document.getElementById('input-age').value) || 16;
  const g = document.getElementById('input-gender').value;
  const act = document.getElementById('input-activity').value;

  const preview = bmiModule.previewBMI(h, w, a, g, act);
  const card = document.getElementById('bmi-preview');

  if (!preview) { card.style.display = 'none'; return; }
  card.style.display = 'block';

  document.getElementById('preview-bmi-num').textContent = preview.bmi.toFixed(1);
  document.getElementById('preview-bmi-num').style.color = preview.color;
  document.getElementById('preview-bmi-cat').textContent = preview.label;
  document.getElementById('preview-bmi-cat').style.color = preview.color;
  document.getElementById('preview-calorie').textContent =
    `${t('calorie_goal')}: ${preview.calorie.toLocaleString()} kcal/วัน`;
}

function startGame() {
  const name   = document.getElementById('input-name').value.trim();
  const age    = parseInt(document.getElementById('input-age').value);
  const gender = document.getElementById('input-gender').value;
  const height = parseFloat(document.getElementById('input-height').value);
  const weight = parseFloat(document.getElementById('input-weight').value);
  const act    = document.getElementById('input-activity').value;

  const errEl = document.getElementById('form-error');
  errEl.style.display = 'none';

  if (!name || name.length > 20) { showFormError(t('err_name')); return; }
  if (!age || age < 5 || age > 100) { showFormError(t('err_age')); return; }
  if (!height || height < 100 || height > 220) { showFormError(t('err_height')); return; }
  if (!weight || weight < 20 || weight > 200) { showFormError(t('err_weight')); return; }

  characterModule.initFromSetup(name, age, gender, height, weight, act);
  window._xpBalance = 100; // starting XP bonus
  weightModule.startWeight = weight;
  weightModule.startDate   = new Date().toISOString().slice(0, 10);
  questModule.init();
  hungerModule.hunger = 50;
  streakModule.checkIn(0);
  hungerModule.startTick();
  startStressDrain();
  saveGame();
  showScreen('game');
  renderAll();
  showToast(`🎮 ยินดีต้อนรับ ${name}! เริ่มเกมได้เลย!`, 'success');
}

function showFormError(msg) {
  const el = document.getElementById('form-error');
  el.textContent = msg;
  el.style.display = 'block';
}

// ═══════════════════════════════════════════
// RENDER ALL
// ═══════════════════════════════════════════
window.renderAll = function() {
  renderHUD();
  renderCharacter();
  renderHunger();
  renderFatigue();
  renderStress();
  renderLifeEvents();
  renderStats();
  renderCalorieBar();
  if (_currentTabId === 'home')        { renderGlance(); renderFoodLog(); renderMealSuggest(); renderMacroSummary(); renderWaterTracker(); renderExerciseSuggest(); initFoodSearch(); }
  if (_currentTabId === 'marketplace') renderMarketplace();
  if (_currentTabId === 'quests')      { renderQuests(); renderMissions(); renderExerciseTip(); }
  if (_currentTabId === 'shop')        renderShop();
  if (_currentTabId === 'profile')     { renderProfile(); renderWeeklySummary(); renderAnalyticsChart(); renderWeightSection(); renderWeightGoal(); renderAchievements(); renderWardrobe(); renderNotifSettings(); }
};

// ═══════════════════════════════════════════
// HUD
// ═══════════════════════════════════════════
function renderHUD() {
  const ch = characterModule;
  document.getElementById('hud-name').textContent = ch.get('name');
  document.getElementById('hud-level').textContent = `Lv.${ch.get('level')}`;

  const xpProg = ch.getXPProgress();
  document.getElementById('hud-xp-bar').style.width = xpProg.pct + '%';
  document.getElementById('hud-xp-text').textContent = `${xpProg.current} / ${xpProg.needed} XP`;
  document.getElementById('hud-streak').textContent = `🔥 ${streakModule.currentStreak}`;
}

// ═══════════════════════════════════════════
// CHARACTER
// ═══════════════════════════════════════════
function renderCharacter() {
  const ch = characterModule;
  const scale = ch.getSizeScale();
  document.getElementById('char-body').style.transform = `scale(${scale})`;

  const hun = hungerModule.getHungerPct();
  document.getElementById('char-face').textContent = ch.getEmotionFace(hun);

  document.getElementById('char-name').textContent = ch.get('name');
  document.getElementById('char-title').textContent = ch.getTitle();

  const bmi = ch.get('bmi');
  const bmiLabel = bmiModule.getCategoryLabel(bmi);
  const bmiColor = bmiModule.getCategoryColor(bmi);
  const bmiEl = document.getElementById('char-bmi-badge');
  bmiEl.textContent = `BMI ${bmi.toFixed(1)} • ${bmiLabel}`;
  bmiEl.style.color = bmiColor;
  bmiEl.style.background = bmiColor + '22';

  const aura = document.getElementById('char-aura');
  aura.className = 'char-aura ' + ch.getAuraClass();

  // Apply color cosmetic to torso/legs
  const color = ch.get('cosmetics').color;
  const colorMap = { red:'#ef4444', green:'#22c55e', purple:'#8b5cf6', gold:'#f59e0b', rainbow:'linear-gradient(90deg,#f87171,#fbbf24,#4ade80,#60a5fa,#a78bfa)' };
  const torso = document.getElementById('char-torso');
  const legs  = document.getElementById('char-legs');
  if (color && colorMap[color]) {
    torso.style.background = colorMap[color];
    legs.style.background  = colorMap[color];
  }
}

// ═══════════════════════════════════════════
// HUNGER
// ═══════════════════════════════════════════
function renderHunger() {
  const pct = hungerModule.getHungerPct();
  const status = hungerModule.getHungerStatus();
  document.getElementById('hunger-bar').style.width = pct + '%';
  document.getElementById('hunger-pct').textContent = pct + '%';
  document.getElementById('hunger-status').textContent = t(status.key);
}

// ═══════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════
function renderStats() {
  const hungerMult  = hungerModule.getHungerStatus().multiplier;
  const fatigueMult = sleepModule.getStatMultiplier();
  const stressMult  = stressModule.getStatMultiplier();
  const combined    = hungerMult * fatigueMult * stressMult;
  const stats = characterModule.getEffectiveStats(combined);
  document.getElementById('stat-health').textContent      = stats.health;
  document.getElementById('stat-strength').textContent    = stats.strength;
  document.getElementById('stat-endurance').textContent   = stats.endurance;
  document.getElementById('stat-intelligence').textContent= stats.intelligence;
  document.getElementById('stat-stamina').textContent     = stats.stamina;
}

// ═══════════════════════════════════════════
// CALORIE BAR
// ═══════════════════════════════════════════
function renderCalorieBar() {
  const target = characterModule.get('dailyCalorie');
  const net    = hungerModule.getNetCalories();
  const pct    = hungerModule.getCaloriePct(target);
  document.getElementById('calorie-bar').style.width = pct + '%';
  document.getElementById('calorie-display').textContent =
    `${net.toLocaleString()} / ${target.toLocaleString()} kcal`;
}

// ═══════════════════════════════════════════
// MARKETPLACE
// ═══════════════════════════════════════════
function filterCategory(btn, catId) {
  document.querySelectorAll('#category-filter .cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _marketFilter = catId;
  renderMarketplace();
}

function renderMarketplace() {
  const xp = window._xpBalance || 0;
  document.getElementById('market-xp-balance').textContent = `${xp} XP`;
  document.getElementById('shop-xp-balance').textContent   = `${xp} XP`;

  const special = marketplaceModule.getTodaySpecial();
  const banner  = document.getElementById('daily-special-banner');
  if (special) {
    const food = marketplaceModule.getFood(special.food_id);
    if (food) {
      banner.style.display = 'flex';
      document.getElementById('daily-special-text').textContent =
        `${marketplaceModule.getFoodName(food)} ลด ${Math.round(special.discount * 100)}%!`;
    }
  } else {
    banner.style.display = 'none';
  }

  const bmiCatId = characterModule.get('categoryId') || 'normal';
  const bmiMod   = bmiModule.getPriceModifier(characterModule.get('bmi'));
  const allFoods = marketplaceModule.getAll();
  const netCal   = hungerModule.getNetCalories();
  const dailyGoal= characterModule.get('dailyCalorie');

  // Smart recommendation strip (show only in 'all' view)
  renderFoodRecommendations(bmiCatId, allFoods, netCal, dailyGoal);

  const foods = marketplaceModule.getByCategory(_marketFilter);
  const grid  = document.getElementById('food-grid');
  grid.innerHTML = '';

  foods.forEach(food => {
    const specialPrice = marketplaceModule.getSpecialPrice(food);
    const price    = specialPrice !== null ? specialPrice : marketplaceModule.getAdjustedPrice(food, bmiMod);
    const canAfford = xp >= price;
    const bonus    = marketplaceModule.getBonusSummary(food);
    const name     = marketplaceModule.getFoodName(food);
    const foodTag  = intelligenceModule.getFoodTag(food, bmiCatId);
    const calImpact= intelligenceModule.getCalorieImpact(food.calories || 0, netCal, dailyGoal);

    const card = document.createElement('div');
    card.className = `food-card ${canAfford ? 'can-afford' : 'cant-afford'}`;
    card.style.position = 'relative';
    card.onclick = () => openFoodModal(food);

    const tagHtml = foodTag === 'recommend'
      ? `<span class="food-intel-tag tag-rec">✅ แนะนำ</span>`
      : foodTag === 'warn'
      ? `<span class="food-intel-tag tag-warn">⚠️ หลีกเลี่ยง</span>`
      : '';

    const calClass = `cal-${calImpact}`;
    const calLabel = food.calories ? `${food.calories} kcal` : '';

    card.innerHTML = `
      <span class="food-card-rarity rarity-${food.rarity}">${food.rarity}</span>
      ${tagHtml}
      <div class="food-card-icon">${food.icon}</div>
      <div class="food-card-name">${name}</div>
      <div class="food-card-hunger">+${food.hunger_restore}% อิ่ม</div>
      ${calLabel ? `<div class="food-cal-badge ${calClass}">${calLabel}</div>` : ''}
      ${bonus ? `<div class="food-card-stats">${bonus}</div>` : ''}
      ${food.special_effect ? `<div class="food-card-stats" style="color:#fbbf24">✨ ${food.special_effect}</div>` : ''}
      <div class="food-card-price ${price > food.exp_cost ? 'expensive' : ''}">
        ${specialPrice !== null ? `<s style="color:#666;font-size:11px">${food.exp_cost}</s>&nbsp;` : ''}
        ${price} XP
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderFoodRecommendations(bmiCatId, allFoods, netCal, dailyGoal) {
  const strip = document.getElementById('food-rec-strip');
  if (!strip) return;

  if (_marketFilter !== 'all') {
    strip.style.display = 'none';
    return;
  }

  const intel = intelligenceModule.getFoodIntel(bmiCatId);
  const top   = intelligenceModule.getTopRecommended(bmiCatId, allFoods, 4);
  if (!top.length) { strip.style.display = 'none'; return; }

  strip.style.display = 'block';
  const strategy = currentLang === 'en' ? intel.strategy_en : intel.strategy_th;
  document.getElementById('rec-strategy').textContent = strategy;

  const xp     = window._xpBalance || 0;
  const bmiMod = bmiModule.getPriceModifier(characterModule.get('bmi'));
  const recEl  = document.getElementById('rec-foods');
  recEl.innerHTML = '';

  top.forEach(food => {
    const sp    = marketplaceModule.getSpecialPrice(food);
    const price = sp !== null ? sp : marketplaceModule.getAdjustedPrice(food, bmiMod);
    const canAfford = xp >= price;
    const btn   = document.createElement('button');
    btn.className = `rec-food-btn ${canAfford ? '' : 'rec-cant-afford'}`;
    btn.onclick = () => openFoodModal(food);
    btn.innerHTML = `
      <span class="rec-food-icon">${food.icon}</span>
      <span class="rec-food-name">${marketplaceModule.getFoodName(food)}</span>
      <span class="rec-food-price">${price} XP</span>
    `;
    recEl.appendChild(btn);
  });
}

function renderExerciseTip() {
  const card = document.getElementById('ex-tip-card');
  if (!card) return;
  const bmiCatId = characterModule.get('categoryId') || 'normal';
  const intel    = intelligenceModule.getExerciseIntel(bmiCatId);
  const focus    = currentLang === 'en' ? intel.focus_en : intel.focus_th;
  const tip      = intelligenceModule.getTodayTip(bmiCatId);
  const targetTh = `เป้าหมาย: ${intel.target_min} นาที/วัน × ${intel.target_days} วัน/สัปดาห์`;
  const targetEn = `Target: ${intel.target_min} min/day × ${intel.target_days} days/week`;

  document.getElementById('ex-tip-focus').textContent  = focus;
  document.getElementById('ex-tip-text').textContent   = tip;
  document.getElementById('ex-tip-target').textContent = currentLang === 'en' ? targetEn : targetTh;
}

function updateExercisePreview() {
  const type    = document.getElementById('ex-type')?.value;
  const minutes = parseInt(document.getElementById('ex-minutes')?.value) || 0;
  const bmiCatId = characterModule.get('categoryId') || 'normal';
  const kcal    = intelligenceModule.getExercisePreviewKcal(type, minutes);
  const isRec   = intelligenceModule.isExerciseRecommended(type, bmiCatId);
  const isWarn  = intelligenceModule.isExerciseToAvoid(type, bmiCatId);

  const previewEl = document.getElementById('ex-preview-kcal');
  const tagEl     = document.getElementById('ex-preview-tag');
  if (!previewEl) return;

  previewEl.textContent = `🔥 ~${kcal} kcal`;
  if (isWarn) {
    tagEl.textContent  = currentLang === 'en' ? '⚠️ Not recommended for you' : '⚠️ ไม่แนะนำสำหรับ BMI คุณ';
    tagEl.className    = 'ex-preview-tag tag-warn';
  } else if (isRec) {
    tagEl.textContent  = currentLang === 'en' ? '✅ Great choice!' : '✅ เหมาะสมมาก!';
    tagEl.className    = 'ex-preview-tag tag-rec';
  } else {
    tagEl.textContent  = '';
    tagEl.className    = 'ex-preview-tag';
  }
}

function openFoodModal(food) {
  _pendingFood = food;
  const bmiMod = bmiModule.getPriceModifier(characterModule.get('bmi'));
  const specialPrice = marketplaceModule.getSpecialPrice(food);
  const price = specialPrice !== null ? specialPrice : marketplaceModule.getAdjustedPrice(food, bmiMod);
  const bonus = marketplaceModule.getBonusSummary(food);

  document.getElementById('food-modal-icon').textContent = food.icon;
  document.getElementById('food-modal-name').textContent = marketplaceModule.getFoodName(food);
  document.getElementById('food-modal-detail').innerHTML =
    `+${food.hunger_restore}% อิ่ม${bonus ? `<br>${t('bonuses')} ${bonus}` : ''}${food.special_effect ? `<br>✨ ${food.special_effect}` : ''}`;
  document.getElementById('food-modal-price').textContent = `${price} XP`;

  const canAfford = (window._xpBalance || 0) >= price;
  document.getElementById('btn-food-buy').disabled = !canAfford;
  document.getElementById('btn-food-buy').style.opacity = canAfford ? '1' : '0.4';

  document.getElementById('food-modal').style.display = 'flex';
}

function closeFoodModal() {
  document.getElementById('food-modal').style.display = 'none';
  _pendingFood = null;
}

function confirmBuyFood() {
  if (!_pendingFood) return;
  const food = _pendingFood;
  const bmiMod = bmiModule.getPriceModifier(characterModule.get('bmi'));
  const result = marketplaceModule.buyFood(food, window._xpBalance || 0, bmiMod);

  if (!result.success) { showToast(result.message, 'error'); closeFoodModal(); return; }

  window._xpBalance -= result.cost;
  const eatResult = hungerModule.eatFood(food, bmiMod);

  // Apply stat bonuses
  if (food.stats_bonus) {
    Object.entries(food.stats_bonus).forEach(([stat, val]) => {
      if (characterModule.data[stat] !== undefined) {
        characterModule.data[stat] = Math.min(999, characterModule.data[stat] + Math.round(val * 0.5));
      }
    });
  }

  // Special item effects
  if (food.food_id === 'energy_drink_001') characterModule.setXPMultiplier(2.0, 0.5);

  // XP for logging food (gear bonus)
  const foodXPBase = gearModule.applyFoodXP(5);
  const xpGained = awardXP(foodXPBase, 'log food');
  questModule.update('meal_logged', detectMealType());
  questModule.update('calories_net', hungerModule.getNetCalories());
  checkAchievements('meal', {});
  // Phase 8: mission + gear strength bonus
  const mDoneF = missionModule.onEvent('meal', {});
  mDoneF.forEach(m => { const r = awardXP(m.xp, 'mission'); showToast(t('txt_mission_new', { xp: r.gained }), 'success'); });
  const strBonus = gearModule.getMealStrengthBonus();
  if (strBonus) characterModule.data.strength = Math.min(999, (characterModule.data.strength || 0) + strBonus);

  const name = marketplaceModule.getFoodName(food);
  showToast(`${food.icon} ${name}! +${eatResult.hungerGained}% อิ่ม +${xpGained.gained} XP`, 'success');

  closeFoodModal();
  renderAll();
  saveGame();
}

function detectMealType() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return 'breakfast';
  if (h >= 11 && h < 16) return 'lunch';
  return 'dinner';
}

// ═══════════════════════════════════════════
// QUESTS
// ═══════════════════════════════════════════
function renderQuests() {
  const dailyCal = characterModule.get('dailyCalorie');
  const quests   = questModule.getAll();
  const done     = questModule.countCompleted(dailyCal);
  const xpEarned = questModule.totalXPEarned();

  document.getElementById('quests-done').textContent = done;
  document.getElementById('quests-xp').textContent   = xpEarned;

  const d = new Date();
  document.getElementById('quest-date').textContent =
    d.toLocaleDateString(currentLang === 'th' ? 'th-TH' : 'en-US', { weekday:'long', month:'long', day:'numeric' });

  const list = document.getElementById('quest-list');
  list.innerHTML = '';

  quests.forEach(q => {
    const prog    = questModule.getProgress(q.id);
    const target  = questModule.getTarget(q, dailyCal);
    const complete= questModule.isComplete(q, dailyCal);
    const claimed = questModule.isClaimed(q.id);
    const pct     = Math.min(100, Math.round(prog / target * 100));

    const card = document.createElement('div');
    card.className = 'quest-card' + (complete ? ' completed' : '');

    const diffClass = 'difficulty-' + q.difficulty;
    const progText = q.type === 'threshold'
      ? `${prog.toLocaleString()} / ${target.toLocaleString()} kcal`
      : `${prog} / ${target}`;

    card.innerHTML = `
      <div class="quest-top">
        <div class="quest-emoji">${q.emoji}</div>
        <div class="quest-info">
          <div class="quest-name">${t(q.nameKey)}</div>
          <div class="quest-desc">${t(q.descKey)}</div>
          <div class="quest-reward"><span class="${diffClass}">●</span> +${q.reward_xp} XP</div>
        </div>
        <div class="quest-check">${complete ? (claimed ? '✅' : '🎁') : '⬜'}</div>
      </div>
      <div class="quest-progress-wrap">
        <div class="quest-progress-bar">
          <div class="quest-progress-fill ${complete ? 'complete' : ''}" style="width:${pct}%"></div>
        </div>
        <div class="quest-progress-text">${progText}</div>
      </div>
      ${complete && !claimed ? `<button style="margin-top:8px;width:100%;background:var(--success);border:none;border-radius:8px;padding:8px;color:white;font-weight:700;cursor:pointer" onclick="claimQuestReward('${q.id}')">🎁 ${t('quest_claim')}</button>` : ''}
    `;
    list.appendChild(card);
  });
}

function claimQuestReward(questId) {
  const quest = questModule.getAll().find(q => q.id === questId);
  if (!quest) return;
  const xp = questModule.claimQuest(quest, characterModule.get('dailyCalorie'));
  if (!xp) return;

  const result = awardXP(xp, 'quest');
  stressModule.reduceStress(3);
  checkAchievements('quest', {});
  // Phase 8: mission progress
  const mDoneQ = missionModule.onEvent('quest', {});
  mDoneQ.forEach(m => { const r = awardXP(m.xp, 'mission'); showToast(t('txt_mission_new', { xp: r.gained }), 'success'); });
  showToast(`🎉 ${t(quest.nameKey)} สำเร็จ! +${result.gained} XP`, 'success');
  showXPFloat(result.gained);
  renderAll();
  saveGame();
}

// ═══════════════════════════════════════════
// EXERCISE
// ═══════════════════════════════════════════

// ─── Exercise detail database ────────────────────────────
// totalMins = realistic total duration incl. rest (for XP log)
// kcal      = realistic burn accounting for rest periods
const EXERCISE_DB = [

  // ══ Upper Body ══════════════════════════════════════════
  {
    id: 'pushup', type: 'gym', cat: 'upper', catLabel: 'Upper Body', catColor: '#6366f1',
    name: 'วิดพื้น', emoji: '💪',
    muscles: ['อก (Chest)', 'ไหล่หน้า', 'ไทรเซ็ป'],
    plan: '3 เซต × 10–12 ครั้ง  |  พักเซตละ 60 วิ',
    totalMins: 12, kcal: 40,
    how: 'มือกว้างกว่าไหล่เล็กน้อย หลังตรงเป็นแผ่นกระดาน ลดตัวจนอกเกือบแตะพื้น หายใจออกตอนดัน',
    easier: 'คุกเข่าลงได้ (Knee push-up) ถ้าท่าปกติหนักเกิน',
    harder: 'ยกเท้าขึ้นเก้าอี้ (Decline) หรือเพิ่มเป็น 4 เซต',
  },
  {
    id: 'wide_pushup', type: 'gym', cat: 'upper', catLabel: 'Upper Body', catColor: '#6366f1',
    name: 'วิดพื้นมือกว้าง', emoji: '🤲',
    muscles: ['อกด้านนอก (Outer Chest)', 'ไหล่'],
    plan: '3 เซต × 10–12 ครั้ง  |  พักเซตละ 60 วิ',
    totalMins: 12, kcal: 38,
    how: 'มือกว้างกว่าไหล่มาก ข้อศอกกางออกด้านข้าง เน้นบีบอกตอนดันขึ้น',
    easier: 'ลดจำนวนลงเหลือ 6–8 ครั้ง/เซต หรือคุกเข่า',
    harder: 'ทำช้าลง 3 วิลงมา 1 วิขึ้น (Tempo)',
  },
  {
    id: 'diamond_pushup', type: 'gym', cat: 'upper', catLabel: 'Upper Body', catColor: '#6366f1',
    name: 'Diamond Push-up', emoji: '💎',
    muscles: ['ไทรเซ็ป', 'อกด้านใน', 'ไหล่หน้า'],
    plan: '3 เซต × 8–10 ครั้ง  |  พักเซตละ 60 วิ',
    totalMins: 12, kcal: 38,
    how: 'สองมือชิดกันรูปเพชรใต้อก ข้อศอกพับชิดลำตัว ลดตัวช้าๆ อย่าให้หลังแอ่น',
    easier: 'ใช้มือห่างออกมาก่อน ค่อยๆ ชิดเมื่อแข็งแรงขึ้น',
    harder: 'เพิ่มน้ำหนักถ้ามีเป้หนัก หรือทำแบบช้า 4-0-1',
  },
  {
    id: 'pike_pushup', type: 'gym', cat: 'upper', catLabel: 'Upper Body', catColor: '#6366f1',
    name: 'Pike Push-up', emoji: '🙃',
    muscles: ['ไหล่ (Deltoid)', 'ไทรเซ็ป', 'ทราพีเซียส'],
    plan: '3 เซต × 8–10 ครั้ง  |  พักเซตละ 75 วิ',
    totalMins: 13, kcal: 35,
    how: 'ก้นยกสูงรูปตัว V คว่ำ มือกว้างเท่าไหล่ ลดหัวลงระหว่างสองมือ แล้วดันขึ้น — เหมือน OHP บนพื้น',
    easier: 'ยืนโน้มตัวดันกำแพง (Pike wall push-up)',
    harder: 'ยกเท้าขึ้นเก้าอี้ ใกล้เคียง Handstand push-up',
  },
  {
    id: 'tricep_dip', type: 'gym', cat: 'upper', catLabel: 'Upper Body', catColor: '#6366f1',
    name: 'Tricep Dip (เก้าอี้)', emoji: '🪑',
    muscles: ['ไทรเซ็ป', 'ไหล่หน้า', 'อก (ล่าง)'],
    plan: '3 เซต × 12–15 ครั้ง  |  พักเซตละ 60 วิ',
    totalMins: 12, kcal: 38,
    how: 'มือจับขอบเก้าอี้ไว้ด้านหลัง เท้าวางพื้น ลดก้นลงโดยงอข้อศอก จนแขนขนาน — ดันขึ้น อย่าห่อไหล่',
    easier: 'งอเข่ามากขึ้นเพื่อลดน้ำหนัก',
    harder: 'ยืดขาตรง หรือยกขาข้างหนึ่งขึ้น',
  },

  // ══ Lower Body ══════════════════════════════════════════
  {
    id: 'squat', type: 'gym', cat: 'lower', catLabel: 'Lower Body', catColor: '#f59e0b',
    name: 'สควอท', emoji: '🦵',
    muscles: ['ต้นขาหน้า (Quad)', 'กล้ามก้น (Glute)', 'ต้นขาหลัง (Hamstring)'],
    plan: '3 เซต × 15–20 ครั้ง  |  พักเซตละ 60 วิ',
    totalMins: 14, kcal: 50,
    how: 'เท้ากว้างเท่าไหล่ ปลายเท้าแย้งออกเล็กน้อย ย่อตัวจนต้นขาขนานพื้น หัวเข่าไม่ล้ำปลายเท้า หลังตรง',
    easier: 'ยืนหน้าเก้าอี้ แตะก้นเก้าอี้แล้วลุกขึ้น (Box squat)',
    harder: 'กระโดดขึ้นทุกครั้ง (Jump squat) หรือถือ Dumbbell',
  },
  {
    id: 'lunge', type: 'gym', cat: 'lower', catLabel: 'Lower Body', catColor: '#f59e0b',
    name: 'ลันจ์', emoji: '🚶',
    muscles: ['ต้นขาหน้า', 'กล้ามก้น', 'น่อง'],
    plan: '3 เซต × 10 ครั้ง/ข้าง  |  พักเซตละ 60 วิ',
    totalMins: 14, kcal: 48,
    how: 'ก้าวเท้าข้างหนึ่งไปหน้า ย่อตัวลงจนหัวเข่าหลังเกือบแตะพื้น ลำตัวตั้งตรง แล้วดันกลับ — สลับข้าง',
    easier: 'ลันจ์อยู่กับที่ (Static lunge) ถ้าทรงตัวยาก',
    harder: 'Walking lunge เดินไปข้างหน้า หรือถือ Dumbbell',
  },
  {
    id: 'glute_bridge', type: 'gym', cat: 'lower', catLabel: 'Lower Body', catColor: '#f59e0b',
    name: 'Glute Bridge', emoji: '🌉',
    muscles: ['กล้ามก้น (Glute)', 'ต้นขาหลัง', 'Core ล่าง'],
    plan: '3 เซต × 15 ครั้ง  |  พักเซตละ 45 วิ  |  ค้าง 1 วิที่ยอด',
    totalMins: 10, kcal: 30,
    how: 'นอนหงาย งอเข่า เท้าวางพื้นห่างก้น ยกสะโพกขึ้นจนลำตัวตรง บีบก้นค้าง 1 วิ แล้วลง ช้าๆ',
    easier: 'ไม่ต้องค้าง แค่ขึ้นลงปกติ',
    harder: 'Single-leg: ยกขาข้างหนึ่งขึ้นขนานพื้น',
  },
  {
    id: 'wall_sit', type: 'gym', cat: 'lower', catLabel: 'Lower Body', catColor: '#f59e0b',
    name: 'Wall Sit (นั่งผนัง)', emoji: '🧱',
    muscles: ['ต้นขาหน้า (Quad)', 'น่อง', 'Core'],
    plan: '3 เซต × 30–45 วินาที  |  พักเซตละ 60 วิ',
    totalMins: 8, kcal: 25,
    how: 'ยืนหลังชิดผนัง เลื่อนลงจนต้นขาขนานพื้น เข่า 90° หลังแนบผนังตลอด หายใจสม่ำเสมอ',
    easier: 'ลดเวลาเหลือ 15–20 วินาที หรือนั่งสูงกว่า 90°',
    harder: 'เพิ่มเวลาเป็น 60 วิ หรือยกขาข้างหนึ่ง',
  },
  {
    id: 'calf_raise', type: 'gym', cat: 'lower', catLabel: 'Lower Body', catColor: '#f59e0b',
    name: 'Calf Raise (ยืนปลายเท้า)', emoji: '🦶',
    muscles: ['น่อง (Gastrocnemius)', 'น่องลึก (Soleus)'],
    plan: '3 เซต × 20 ครั้ง  |  พักเซตละ 45 วิ  |  ค้าง 1 วิที่ยอด',
    totalMins: 8, kcal: 22,
    how: 'ยืนตรง ยืนปลายเท้าสูงสุด ค้าง 1 วิ แล้วลงช้าๆ จับผนังเพื่อทรงตัว — ทำบนขอบบันไดได้เพื่อเพิ่ม Range',
    easier: 'สองขาพร้อมกัน จับกำแพงช่วย',
    harder: 'ทำขาเดียว (Single-leg calf raise)',
  },

  // ══ Core / Abs ══════════════════════════════════════════
  {
    id: 'crunch', type: 'gym', cat: 'core', catLabel: 'Core / Abs', catColor: '#10b981',
    name: 'Crunch', emoji: '🌀',
    muscles: ['Rectus Abdominis (หน้าท้อง)', 'Oblique (ด้านข้าง)'],
    plan: '3 เซต × 15–20 ครั้ง  |  พักเซตละ 45 วิ',
    totalMins: 10, kcal: 28, kcalRange: '22–35',
    how: 'นอนหงาย งอเข่า มือวางขมับ (ไม่ดึงคอ) ยกไหล่ขึ้นโดยบีบหน้าท้อง ลงช้าๆ อย่าใช้แรงสะบัด',
    easier: 'แค่ยกหัวขึ้นเล็กน้อย ระยะสั้น',
    harder: 'Bicycle Crunch: สลับศอก-เข่าข้ามลำตัว (ดูท่าด้านล่าง)',
  },
  {
    id: 'plank', type: 'gym', cat: 'core', catLabel: 'Core / Abs', catColor: '#10b981',
    name: 'Plank', emoji: '📏',
    muscles: ['Core ทั้งหมด', 'ไหล่', 'หลังล่าง'],
    plan: '3 เซต × 30–45 วินาที  |  พักเซตละ 45 วิ',
    totalMins: 8, kcal: 20, kcalRange: '15–25',
    how: 'ยันด้วยข้อศอกและปลายเท้า ลำตัวตรงสนิท ก้นไม่โด่งหรือห้อย หน้ามองพื้น หายใจสม่ำเสมอ',
    easier: 'คุกเข่า (Knee plank) ลดน้ำหนัก',
    harder: 'ยกขาสลับ หรือ Plank with shoulder tap',
  },
  {
    id: 'russian_twist', type: 'gym', cat: 'core', catLabel: 'Core / Abs', catColor: '#10b981',
    name: 'Russian Twists', emoji: '🔄',
    muscles: ['Oblique (หน้าท้องด้านข้าง)', 'Core กลาง'],
    plan: '3 เซต × 20 ครั้ง (ซ้าย-ขวานับ 1)  |  พักเซตละ 45 วิ',
    totalMins: 9, kcal: 25, kcalRange: '20–30',
    how: 'นั่งงอเข่าเล็กน้อย ยกเท้าขึ้นเล็กน้อย ลำตัวเอียงหลัง ~45° มือประสานบิดซ้าย-ขวาช้าๆ ไม่สะบัด — ซ้าย+ขวา = 1 ครั้ง',
    easier: 'เท้าวางพื้น ไม่ยกขา',
    harder: 'ถือขวดน้ำ 500ml หรือ Dumbbell เบาๆ',
  },
  {
    id: 'mountain_climber', type: 'gym', cat: 'core', catLabel: 'Core / Abs', catColor: '#10b981',
    name: 'Mountain Climbers', emoji: '🧗',
    muscles: ['Core', 'ไหล่', 'สะโพก', 'ต้นขา', 'คาร์ดิโอ'],
    plan: '3 เซต × 30–40 วินาที  |  พักเซตละ 45 วิ',
    totalMins: 10, kcal: 35, kcalRange: '28–45',
    how: 'ท่า Push-up ขึ้น สลับดึงเข่าเข้าใต้หน้าท้องเร็วๆ สะโพกอย่ายกสูง รักษา Core แน่น — ออกแรงเหมือนวิ่งในที่นอน',
    easier: 'ทำช้าๆ ก้าวเดียวทีละข้าง ควบคุมทุกครั้ง',
    harder: 'เพิ่มความเร็ว หรือ Cross-body: เข่าข้ามไปศอกฝั่งตรงข้าม',
  },
  {
    id: 'leg_raises', type: 'gym', cat: 'core', catLabel: 'Core / Abs', catColor: '#10b981',
    name: 'Leg Raises (นอนหงายยกขาคู่)', emoji: '🦵',
    muscles: ['หน้าท้องล่าง (Lower Abs)', 'สะโพกด้านหน้า (Hip Flexors)'],
    plan: '3 เซต × 12–15 ครั้ง  |  พักเซตละ 45 วิ  |  ไม่วางขาลงพื้น',
    totalMins: 11, kcal: 30, kcalRange: '25–38',
    how: 'นอนหงาย หลังแนบพื้น มือวางข้างลำตัวหรือใต้ก้น ยกขาตึงขึ้นช้าๆ จนตั้งฉาก แล้วลงช้าๆ หยุดก่อนแตะพื้น — ไม่โยกสะบัด',
    easier: 'งอเข่าเล็กน้อย (Bent Knee Raise) ลดแรงดึง Hip Flexors',
    harder: 'หย่อนขาลงแค่ 10 cm จากพื้น ค้างก่อนยกกลับขึ้น',
  },
  {
    id: 'bicycle_crunch', type: 'gym', cat: 'core', catLabel: 'Core / Abs', catColor: '#10b981',
    name: 'Bicycle Crunches', emoji: '🚴',
    muscles: ['Obliques', 'Rectus Abdominis', 'Core ทั้งหมด'],
    plan: '3 เซต × 20 ครั้ง (10/ข้าง)  |  พักเซตละ 45 วิ',
    totalMins: 10, kcal: 28, kcalRange: '22–35',
    how: 'นอนหงาย มือวางขมับ ยกไหล่และเข่าขึ้น บิดศอกซ้ายไปหาเข่าขวา พร้อมยืดขาซ้าย แล้วสลับ — เคลื่อนไหวช้า บีบ Oblique ทุกครั้ง',
    easier: 'ทำช้าๆ 3 วิ/ครั้ง อย่าเร่ง',
    harder: 'เพิ่มเป็น 30 ครั้ง หรือถือขวดน้ำเล็กๆ',
  },
  {
    id: 'bird_dog', type: 'gym', cat: 'core', catLabel: 'Core / Abs', catColor: '#10b981',
    name: 'Bird-Dog (คุกเข่ายกแขนสลับขา)', emoji: '🐦',
    muscles: ['หลังล่าง (Lower Back)', 'Core', 'ก้น (Glute)', 'บาลานซ์'],
    plan: '3 เซต × 10 ครั้ง/ข้าง  |  พักเซตละ 45 วิ  |  ค้าง 2 วิที่ยอด',
    totalMins: 12, kcal: 22, kcalRange: '18–28',
    how: 'คุกเข่าสี่ขา มือใต้ไหล่ เข่าใต้สะโพก ยกแขนขวา+ขาซ้ายพร้อมกัน ค้าง 2 วิ แล้วลงช้าๆ สลับข้าง — หลังตรง ไม่บิดตัว',
    easier: 'ยกแค่แขนก่อน ไม่ยกขา จนทรงตัวได้ดี',
    harder: 'เพิ่มน้ำหนักที่ข้อมือหรือข้อเท้า หรือเพิ่มเป็น 15 ครั้ง',
  },

  // ══ Agility & Power ═════════════════════════════════════
  {
    id: 'jump_squat', type: 'gym', cat: 'agility', catLabel: 'Agility & Power', catColor: '#a855f7',
    name: 'Jump Squats (สควอทกระโดด)', emoji: '🦘',
    muscles: ['ขาโดยรวม', 'พลังระเบิด (Power)', 'หัวใจ'],
    effort: 'Zone 3–4  •  เหนื่อยปานกลาง-สูง', effortColor: '#ff9800',
    plan: '3 เซต × 12–15 ครั้ง  |  พักเซตละ 60 วิ',
    totalMins: 15, kcal: 65, kcalRange: '55–75',
    how: 'ย่อสควอทลงจนต้นขาขนานพื้น แล้วระเบิดกระโดดขึ้นเต็มที่ ลงเท้าเบาๆ ย่อตัวรับน้ำหนักทันที แล้วทำต่อไม่หยุด',
    easier: 'ย่อลงแล้วยืนขึ้นช้าๆ ไม่กระโดด (Box squat)',
    harder: 'เพิ่มเป็น 4 เซต หรือถือ Dumbbell เบาๆ ทั้งสองมือ',
  },
  {
    id: 'lateral_lunge', type: 'gym', cat: 'agility', catLabel: 'Agility & Power', catColor: '#a855f7',
    name: 'Lateral Lunges (ก้าวออกด้านข้าง)', emoji: '↔️',
    muscles: ['ต้นขาด้านใน (Adductor)', 'Quad', 'ก้น', 'ความคล่องตัว'],
    effort: 'Zone 2–3  •  เน้นควบคุม ไม่เร่ง', effortColor: '#8bc34a',
    plan: '3 เซต × 10 ครั้ง/ข้าง  |  พักเซตละ 45 วิ',
    totalMins: 14, kcal: 55, kcalRange: '45–65',
    how: 'ยืนตรง ก้าวขาข้างหนึ่งออกด้านข้างกว้างๆ ย่อตัวลงฝั่งนั้น หัวเข่าไม่ล้ำปลายเท้า ขาอีกข้างตึงตรง ดันกลับมายืน — สลับข้าง',
    easier: 'ก้าวสั้น ย่อตื้น จับกำแพงช่วยทรงตัว',
    harder: 'เพิ่ม Dumbbell หรือทำ Walking Lateral Lunge เดินไปข้างหน้า',
  },
  {
    id: 'burpee_power', type: 'hiit', cat: 'agility', catLabel: 'Agility & Power', catColor: '#a855f7',
    name: 'Burpees (พุ่งหลังกระโดด)', emoji: '💥',
    muscles: ['ทั่วตัว (Full Body)', 'หัวใจ', 'พลังระเบิด'],
    effort: 'Zone 4–5  •  เหนื่อยสูงมาก เผาแคลเร็ว', effortColor: '#f44336',
    plan: '3 เซต × 10–12 ครั้ง  |  พักเซตละ 60 วิ',
    totalMins: 14, kcal: 90, kcalRange: '80–105',
    how: 'ยืน → กระโดดขาออกด้านหลัง → วิดพื้น 1 ครั้ง → กระโดดขาเข้า → กระโดดขึ้นยกแขนเหนือหัว = 1 ครั้ง ทำต่อเนื่อง ไม่หยุด',
    easier: 'ตัดท่าวิดพื้นออก หรือก้าวแทนกระโดดทุกจุด',
    harder: 'เพิ่ม Box jump หลังกระโดดขึ้น หรือเพิ่มเป็น 15 ครั้ง/เซต',
  },
  {
    id: 'high_knees_power', type: 'hiit', cat: 'agility', catLabel: 'Agility & Power', catColor: '#a855f7',
    name: 'High Knees (วิ่งยกเข่าสูง)', emoji: '🏃‍♂️',
    muscles: ['คาร์ดิโอ', 'หน้าท้อง (Core)', 'ต้นขา', 'น่อง'],
    effort: 'Zone 3–4  •  เหนื่อยปานกลาง-สูง', effortColor: '#ff9800',
    plan: '4 เซต × 30 วินาที  |  พักเซตละ 45 วิ',
    totalMins: 9, kcal: 55, kcalRange: '45–65',
    how: 'วิ่งอยู่กับที่ยกเข่าขึ้นสูงถึงระดับสะดือ จังหวะเร็วต่อเนื่อง แขนแกว่งประกอบ ลงปลายเท้าเบาๆ ทุกก้าว',
    easier: 'เดินยกเข่าสูงช้าๆ แทนวิ่ง',
    harder: 'เพิ่มความเร็ว หรือยืดเวลาเป็น 45 วิ/เซต',
  },
  {
    id: 'skaters', type: 'running', cat: 'agility', catLabel: 'Agility & Power', catColor: '#a855f7',
    name: 'Skaters (กระโดดสลับซ้าย-ขวา)', emoji: '⛸️',
    muscles: ['ข้อเท้า', 'เอ็นร้อยหวาย', 'ต้นขาด้านนอก', 'บาลานซ์'],
    effort: 'Zone 3–4  •  เน้น Lateral power และบาลานซ์', effortColor: '#ff9800',
    plan: '3 เซต × 20 ครั้ง (ซ้าย-ขวานับ 1)  |  พักเซตละ 45 วิ',
    totalMins: 12, kcal: 70, kcalRange: '60–80',
    how: 'กระโดดไปด้านซ้าย ลงขาซ้ายเดียว ขาขวาไขว้ไปด้านหลัง แขนแกว่งตามทิศทาง แล้วกระโดดไปขวา — เลียนแบบนักสเก็ต',
    easier: 'ก้าวแทนกระโดด ทำช้าๆ จับกำแพงช่วยถ้าทรงตัวยาก',
    harder: 'เพิ่มระยะกระโดด หรือถือ Dumbbell เบา หรือใส่น้ำหนักข้อเท้า',
  },

  // ══ Posture & Flexibility ════════════════════════════════
  {
    id: 'superman', type: 'gym', cat: 'flexibility', catLabel: 'Posture & Flex', catColor: '#06b6d4',
    name: 'Superman (นอนคว่ำยกแขนและขา)', emoji: '🦸',
    muscles: ['หลังล่าง (Lower Back)', 'ก้น (Glute)', 'ไหล่หลัง (Rear Delt)'],
    effort: 'Zone 1–2  •  เบา เน้นหลังล่างและก้น', effortColor: '#4caf50',
    plan: '3 เซต × 12–15 ครั้ง  |  พักเซตละ 45 วิ  |  ค้าง 2 วิที่ยอด',
    totalMins: 10, kcal: 25, kcalRange: '20–30',
    how: 'นอนคว่ำ แขนเหยียดตรงข้างหัว ยกแขนและขาทั้งสองขึ้นพร้อมกัน ค้าง 2 วิ แล้วลงช้าๆ — ไม่สะบัด บีบก้นทุกครั้ง',
    easier: 'ยกแค่แขนหรือแค่ขา ทีละส่วนก่อน',
    harder: 'ค้างนาน 3–4 วิ หรือสลับยกแขนขวา+ขาซ้าย',
  },
  {
    id: 'cat_cow', type: 'gym', cat: 'flexibility', catLabel: 'Posture & Flex', catColor: '#06b6d4',
    name: 'Cat-Cow (โก่งหลัง-แอ่นหลัง)', emoji: '🐈',
    muscles: ['กระดูกสันหลัง (Spine)', 'คอ (Cervical)', 'หลังล่าง'],
    effort: 'Zone 1  •  เบามาก เน้นลมหายใจ', effortColor: '#4caf50',
    plan: '3 เซต × 10–12 ครั้ง  |  พักเซตละ 30 วิ  |  เคลื่อนไหวตามลมหายใจ',
    totalMins: 8, kcal: 15, kcalRange: '12–20',
    how: 'คุกเข่าสี่ขา หายใจเข้า→แอ่นหลัง มองขึ้น (Cow) หายใจออก→โก่งหลัง มองลง (Cat) เคลื่อนไหวช้าๆ ตามลมหายใจ ไม่เร่ง',
    easier: 'ทำแค่ Cat หรือแค่ Cow ก่อน แล้วค่อยรวมกัน',
    harder: 'เพิ่มเป็น 3 วิ/ท่า เน้นความลึกของการหายใจ',
  },
  {
    id: 'childs_pose', type: 'gym', cat: 'flexibility', catLabel: 'Posture & Flex', catColor: '#06b6d4',
    name: "Child's Pose (ท่านั่งพับเพียบหมอบ)", emoji: '🙏',
    muscles: ['หลัง (ทั้งหมด)', 'ไหล่', 'สะโพก (Stretching)'],
    effort: 'Zone 1  •  ยืดเหยียด ผ่อนคลาย', effortColor: '#4caf50',
    plan: 'ค้างไว้ 60 วินาที × 3 รอบ  |  พักเพียง 20 วิ  |  หายใจลึกตลอด',
    totalMins: 6, kcal: 10, kcalRange: '8–15',
    how: 'คุกเข่า ก้นแตะส้นเท้า เหยียดแขนตรงไปข้างหน้า หน้าผากวางพื้น หายใจลึกๆ รู้สึกยืดหลังและไหล่ ผ่อนคลายทุกกล้ามเนื้อ',
    easier: 'วางหน้าผากบนหมอนถ้าไม่ถึงพื้น หรือกางเข่าออก',
    harder: 'เดินมือไปด้านข้างเพื่อยืดด้านข้างลำตัว (Thread the Needle)',
  },
  {
    id: 'downward_dog', type: 'gym', cat: 'flexibility', catLabel: 'Posture & Flex', catColor: '#06b6d4',
    name: 'Downward Dog (ท่าสุนัขก้มหน้า)', emoji: '🐕',
    muscles: ['น่อง', 'เอ็นร้อยหวาย (Hamstring)', 'หลัง', 'ไหล่'],
    effort: 'Zone 1–2  •  ยืดขาหลังและหลัง', effortColor: '#4caf50',
    plan: 'ค้างไว้ 30–45 วินาที × 3 รอบ  |  พักเพียง 20 วิ',
    totalMins: 7, kcal: 15, kcalRange: '12–20',
    how: 'เริ่มจากสี่ขา ยกก้นขึ้นให้ลำตัวรูปตัว V คว่ำ ส้นเท้ากดลงพื้น (ไม่ต้องแตะได้) หัวอยู่ระหว่างแขน ผ่อนคลายคอ หายใจลึก',
    easier: 'งอเข่าเล็กน้อย ไม่ต้องยืดเข่าตรง',
    harder: 'Three-Legged Dog: ยกขาข้างหนึ่งขึ้นสูง',
  },

  // ══ Cardio — Home / Bodyweight ══════════════════════════
  {
    id: 'jumping_jack', type: 'aerobic', cat: 'cardio', catLabel: 'Cardio', catColor: '#ef4444',
    name: 'Jumping Jack', emoji: '🌟',
    muscles: ['Full Body', 'น่อง', 'ไหล่'],
    effort: 'Zone 2–3  •  เหนื่อยเล็กน้อย จังหวะสม่ำเสมอ', effortColor: '#8bc34a',
    plan: '4 เซต × 30 ครั้ง  |  พักเซตละ 30 วิ',
    totalMins: 10, kcal: 60, kcalRange: '50–70',
    how: 'กระโดดพร้อมกางขาและยกแขนเหนือหัว แล้วกระโดดกลับ จังหวะสม่ำเสมอ ลงเท้าให้นุ่ม',
    easier: 'ทำแบบ Step jack: ก้าวด้านข้างไม่กระโดด',
    harder: 'เพิ่มเป็น 5 เซต หรือสลับกับ Burpee',
  },
  {
    id: 'burpee', type: 'hiit', cat: 'cardio', catLabel: 'Cardio', catColor: '#ef4444',
    name: 'Burpee', emoji: '💥',
    muscles: ['Full Body', 'หัวใจและปอด'],
    effort: 'Zone 4–5  •  เหนื่อยสูงมาก เผาแคลเร็ว', effortColor: '#f44336',
    plan: '3 เซต × 8–10 ครั้ง  |  พักเซตละ 90 วิ',
    totalMins: 14, kcal: 80, kcalRange: '70–90',
    how: 'ยืน→วิดพื้น 1 ครั้ง→กระโดดขาเข้า→กระโดดขึ้นพร้อมปรบมือเหนือหัว — เป็น 1 ครั้ง ทำต่อเนื่อง',
    easier: 'ตัดท่ากระโดดออก แค่ลุกขึ้นยืน',
    harder: 'เพิ่มกระโดดสูง หรือ Box jump ลงมา',
  },
  {
    id: 'high_knees', type: 'aerobic', cat: 'cardio', catLabel: 'Cardio', catColor: '#ef4444',
    name: 'High Knees', emoji: '🏃‍♂️',
    muscles: ['ต้นขา', 'Core', 'น่อง', 'หัวใจ'],
    effort: 'Zone 3–4  •  เหนื่อยปานกลาง-สูง', effortColor: '#ff9800',
    plan: '4 เซต × 30 วินาที  |  พักเซตละ 30 วิ',
    totalMins: 9, kcal: 55, kcalRange: '45–65',
    how: 'วิ่งอยู่กับที่ยกเข่าสูงถึงระดับสะดือ แขนแกว่งประกอบ ลงเท้าส้นแตะพื้นเบาๆ',
    easier: 'เดินยกเข่าสูงช้าๆ แทนวิ่ง',
    harder: 'เพิ่มความเร็ว หรือดึงมือไว้ระดับสะดือให้เข่าแตะมือ',
  },
  {
    id: 'jump_rope', type: 'jump_rope', cat: 'cardio', catLabel: 'Cardio', catColor: '#ef4444',
    name: 'กระโดดเชือก', emoji: '🤸',
    muscles: ['น่อง', 'ไหล่', 'หัวใจ', 'Full Body'],
    effort: 'Zone 3–4  •  ต่อเนื่อง จังหวะคงที่', effortColor: '#ff9800',
    plan: '5 เซต × 60 วินาที  |  พักเซตละ 30 วิ',
    totalMins: 15, kcal: 120, kcalRange: '100–140',
    how: 'กระโดดเบาๆ เท้าห่างนิดเดียว ข้อมือหมุนเชือก ไม่ใช่แขน ลงส้นเท้านุ่มๆ จังหวะคงที่',
    easier: 'กระโดดแค่ 30 วิ/เซต หรือกระโดดไม่มีเชือกก่อน',
    harder: 'Double under: เชือกผ่านใต้เท้า 2 รอบ/กระโดด',
  },
  {
    id: 'aerobic', type: 'aerobic', cat: 'cardio', catLabel: 'Cardio', catColor: '#ef4444',
    name: 'เต้นแอโรบิก', emoji: '💃',
    muscles: ['Full Body', 'หัวใจ'],
    effort: 'Zone 2–3  •  สม่ำเสมอ สนุก ทำได้นาน', effortColor: '#8bc34a',
    plan: 'คลิป 20–30 นาที ต่อเนื่อง  |  มีอบอุ่นและคูลดาวน์ในตัว',
    totalMins: 25, kcal: 160, kcalRange: '140–180',
    how: 'เปิด YouTube "แอโรบิก 30 นาที" เต้นตามได้เลย ไม่ต้องคิดเอง',
    easier: 'เลือกคลิป "ผู้สูงอายุ" หรือ "เบาๆ" ก้าวช้าลง',
    harder: 'เพิ่มเวลาเป็น 45 นาที หรือใส่น้ำหนักที่ข้อมือ',
  },

  // ══ Cardio — Outdoor / Running ══════════════════════════
  {
    id: 'brisk_walk', type: 'walking', cat: 'cardio', catLabel: 'Cardio', catColor: '#ef4444',
    name: 'เดินเร็ว', emoji: '🚶‍♂️',
    muscles: ['ขา', 'น่อง', 'หัวใจและปอด'],
    effort: 'Zone 1–2  •  เดินต่อเนื่อง พูดคุยได้ปกติ', effortColor: '#4caf50',
    plan: 'เดินต่อเนื่อง 30 นาที ไม่หยุดพัก',
    totalMins: 30, kcal: 135, kcalRange: '120–150',
    how: 'ก้าวยาว แกว่งแขนประกอบ หลังตรง เร็วพอให้หัวใจสูบแต่ยังพูดคุยได้ปกติ — ไม่ต้องวิ่ง',
    easier: 'ลดความเร็วลงหรือเดินปกติ 40 นาที',
    harder: 'เพิ่มเป็น 45 นาที หรือเดินขึ้นเนิน/บันได',
  },
  {
    id: 'jog_zone2', type: 'jogging', cat: 'cardio', catLabel: 'Cardio', catColor: '#ef4444',
    name: 'วิ่งจ็อกกิ้ง (Zone 2)', emoji: '🏃',
    muscles: ['ขา', 'Core', 'หัวใจและปอด'],
    effort: 'Zone 2  •  หายใจเป็นจังหวะ พูดได้เป็นประโยคสั้นๆ', effortColor: '#8bc34a',
    plan: 'วิ่งต่อเนื่อง 30 นาที ความเร็วคงที่',
    totalMins: 30, kcal: 275, kcalRange: '250–300',
    how: 'วิ่งเหยาะๆ ให้ HR อยู่ที่ 60–70% ของ Max HR — ถ้ายังพูดเป็นประโยคสั้นได้คือ Zone 2 พอดี',
    easier: 'สลับวิ่ง 3 นาที เดิน 1 นาที จนครบ 30 นาที',
    harder: 'เพิ่มเป็น 45 นาที หรือเพิ่ม pace ขึ้นเล็กน้อย',
  },
  {
    id: 'run_pace', type: 'running', cat: 'cardio', catLabel: 'Cardio', catColor: '#ef4444',
    name: 'วิ่งต่อเนื่อง (Pace 6–7)', emoji: '🏃‍♀️',
    muscles: ['ขา', 'Core', 'หัวใจและปอด'],
    effort: 'Zone 3–4  •  หายใจหนัก พูดได้แค่ไม่กี่คำ', effortColor: '#ff9800',
    plan: 'Warm-up 5 นาที  →  วิ่ง Pace 6–7 min/km  ×  35 นาที  →  Cool-down 5 นาที',
    totalMins: 45, kcal: 475, kcalRange: '450–500',
    how: 'ความเร็ว ~8.5–10 กม./ชม. หรือ Pace 6–7 min/km รักษาจังหวะก้าวสม่ำเสมอ หายใจ 2 ก้าว-เข้า 2 ก้าว-ออก',
    easier: 'ลด Pace เป็น 8–9 min/km (Zone 2) หรือตัด warm-up ลงเหลือ 3 นาที',
    harder: 'ลด Pace เป็น <5:30 min/km หรือเพิ่มระยะทาง',
  },
  {
    id: 'hiit_run', type: 'hiit', cat: 'cardio', catLabel: 'Cardio', catColor: '#ef4444',
    name: 'HIIT วิ่งสลับเดิน', emoji: '⚡',
    muscles: ['Full Body', 'หัวใจ', 'ขา'],
    effort: 'Zone 4–5  •  สปรินต์เต็มที่ สลับพัก', effortColor: '#f44336',
    plan: 'Warm-up 3 นาที  →  สปรินต์ 30 วิ + เดิน 60 วิ  ×  10 รอบ  →  Cool-down 3 นาที',
    totalMins: 20, kcal: 225, kcalRange: '200–250',
    how: 'วิ่งเต็มที่ 30 วิ (เหนื่อยมาก พูดไม่ออก) → เดินช้าๆ 60 วิ (ฟื้นตัว) ซ้ำ 10 รอบ อย่าออกแรงเกินในรอบแรกๆ',
    easier: 'ลดสปรินต์เหลือ 20 วิ หรือจ็อกแทนสปรินต์ และพัก 90 วิ',
    harder: 'เพิ่มเป็น 15 รอบ หรือลด recovery เหลือ 45 วิ',
  },
  {
    id: 'court_sport', type: 'court_sport', cat: 'cardio', catLabel: 'Cardio', catColor: '#ef4444',
    name: 'กีฬาบนคอร์ต', emoji: '🏸',
    muscles: ['Full Body', 'ขา', 'ไหล่', 'หัวใจ'],
    effort: 'Zone 3–4  •  เคลื่อนที่ฉับพลัน Stop & Go สลับ', effortColor: '#ff9800',
    plan: 'เล่นต่อเนื่อง 60 นาที  |  มี Stop & Go และ Lateral movement',
    totalMins: 60, kcal: 400, kcalRange: '350–450',
    how: 'Badminton / Tennis / Basketball / Futsal — วอร์มอัพเบาๆ ก่อนเล่น ระวัง Lateral movement ข้อเท้า ยืดหลังเล่น',
    easier: 'เล่น 30–40 นาที หรือลดความเข้มข้น',
    harder: 'เพิ่ม intensity เล่น Singles หรือเพิ่มจำนวนเซต',
  },
];

// ─── Recommendation engine ────────────────────────────────
function _buildRecommendation(excess, bmiCat, dow, hour) {
  const f  = id => EXERCISE_DB.find(e => e.id === id);
  const mk = (icon, title, reason, ids, note) => ({
    icon, title, reason, note: note || '',
    exercises: ids.map(f).filter(Boolean),
  });

  // ── Wednesday evening → court sports night ──
  if (dow === 3 && hour >= 15) {
    return mk('🏸', 'เตรียมตัวก่อนเล่นคอร์ตคืนนี้',
      'คืนนี้มีกีฬาบนคอร์ต — อบอุ่น Core + Lateral movement ก่อนลงสนาม ลดเสี่ยงบาดเจ็บข้อเท้าและหลัง',
      ['cat_cow', 'lateral_lunge', 'bird_dog', 'court_sport'],
      '💡 ทำ Cat-Cow + Lateral Lunges ก่อนไปสนามอย่างน้อย 30 นาที');
  }

  // ── Late night → stretching only ──
  if (hour >= 21 || hour < 6) {
    return mk('🌙', 'ยืดเหยียดก่อนนอน',
      'ดึกแล้ว ไม่แนะนำออกกำลังกายหนัก — ยืดกล้ามเนื้อลด Cortisol ผ่อนคลาย และนอนหลับดีขึ้น',
      ['childs_pose', 'cat_cow', 'downward_dog'],
      '💡 ค้างท่าละ 60 วิ หายใจลึกๆ ไม่ต้องรีบ');
  }

  // ── Morning (6-10) → day-of-week plan ──
  if (hour >= 6 && hour < 10) {
    if (bmiCat === 'obese' || bmiCat === 'overweight') {
      return mk('🌅', 'เช้านี้: Cardio ก่อนอาหารเช้า',
        'เช้าเผาไขมันได้ดีที่สุด — เดินเร็ว 30 นาทีก่อนกิน ร่างกายใช้ไขมันสะสมเป็นพลังงานตรงๆ',
        ['brisk_walk', 'jumping_jack', 'leg_raises'],
        '💡 ดื่มน้ำ 1 แก้วก่อนออกกำลัง อย่าพึ่งกินอาหาร');
    }
    const plans = {
      1: { ids: ['pushup', 'pike_pushup', 'jog_zone2'],            reason: 'วันจันทร์ต้นสัปดาห์ — เริ่มด้วย Upper Body กล้ามเนื้ออก ไหล่ แขน ตามด้วย Jogging เพิ่ม Cardio' },
      2: { ids: ['squat', 'lunge', 'mountain_climber'],             reason: 'Lower Body + Core วันอังคาร — ขาเป็นกล้ามเนื้อกลุ่มใหญ่สุด เผาแคลสูง เสริม Core ไปด้วย' },
      3: { ids: ['bird_dog', 'lateral_lunge', 'cat_cow'],           reason: 'เช้าวันพุธ — เสริม Core stability และ Lateral movement เพื่อเตรียมร่างกายสำหรับกีฬาคอร์ตช่วงเย็น' },
      4: { ids: ['jump_squat', 'skaters', 'high_knees_power'],      reason: 'Agility วันพฤหัส — Power + ความคล่องตัว เตรียมสำหรับกีฬาสัปดาห์หน้า' },
      5: { ids: ['pushup', 'squat', 'jump_rope'],                   reason: 'Full Body วันศุกร์ปิดสัปดาห์ — ครอบคลุมทุกกลุ่มกล้ามเนื้อก่อนพักสุดสัปดาห์' },
      6: { ids: ['run_pace', 'aerobic'],                            reason: 'วันเสาร์มีเวลา — Cardio ยาว 45-75 นาที เผาแคลได้เต็มที่ที่สุดในสัปดาห์' },
      0: { ids: ['superman', 'childs_pose', 'cat_cow'],             reason: 'Recovery Day อาทิตย์ — ยืดเหยียด ฟื้นฟูกล้ามเนื้อ เตรียมพร้อมสัปดาห์ใหม่' },
    };
    const p = plans[dow] || plans[1];
    const dayTh = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][dow];
    return mk('🌅', `เช้าวัน${dayTh}: ${_planTitle(plans[dow]?.ids || plans[1].ids)}`, p.reason, p.ids);
  }

  // ── Lunch (11-14) → short efficient workout ──
  if (hour >= 11 && hour < 14) {
    if (excess > 300) {
      return mk('☀️', 'พักกลางวัน: HIIT 20 นาทีเผาแคลเร็ว',
        `เกินเป้า +${excess.toLocaleString()} kcal — HIIT 20 นาทีช่วงพักกลางวันประหยัดเวลาและเผาแคลได้สูงสุด`,
        ['hiit_run', 'mountain_climber', 'jumping_jack'],
        '💡 เปลี่ยนเสื้อผ้า อบอุ่น 3 นาทีก่อน อย่าลืมอาบน้ำหลังทำ');
    }
    return mk('☀️', 'พักกลางวัน: Core 15 นาที',
      'ช่วงพักกลางวัน Core เหมาะที่สุด ทำเสร็จไม่ต้องอาบน้ำ ไม่เหนื่อยเกิน กลับมาทำงานต่อได้ปกติ',
      ['plank', 'bicycle_crunch', 'leg_raises'],
      '💡 ทำบนเสื่อในออฟฟิศหรือห้องน้ำก็ได้');
  }

  // ── Afternoon (14-17) → by BMI ──
  if (hour >= 14 && hour < 17) {
    const plans = {
      obese:       { ids: ['brisk_walk', 'glute_bridge', 'childs_pose'], title: 'บ่ายนี้: Low-Impact + ขาเบาๆ',    reason: 'Low-Impact เน้นเดินและ Glute Bridge — เผาแคลโดยไม่กดข้อเข่า เหมาะสุดสำหรับเริ่มต้น' },
      overweight:  { ids: ['brisk_walk', 'squat', 'jumping_jack'],       title: 'บ่ายนี้: Cardio + Lower Body',    reason: `เกินเป้า +${excess.toLocaleString()} kcal — เดิน 30 นาที + สควอท เผาแคลได้ดีและไม่บาดเจ็บ` },
      underweight: { ids: ['pushup', 'squat', 'lunge'],                  title: 'บ่ายนี้: Strength สร้างกล้ามเนื้อ', reason: 'BMI ต่ำ เป้าหมายคือเพิ่มกล้ามเนื้อ — Strength training ไม่ต้อง Cardio หนัก' },
      normal:      { ids: ['squat', 'pushup', 'jump_rope'],              title: 'บ่ายนี้: Balanced Full Body',     reason: `เกินเป้า +${excess.toLocaleString()} kcal — Upper + Lower + กระโดดเชือก ครอบคลุมทุกส่วน` },
    };
    const p = plans[bmiCat] || plans.normal;
    return mk('🌤️', p.title, p.reason, p.ids);
  }

  // ── Evening (17-21) → day-specific full workout ──
  if (hour >= 17 && hour < 21) {
    const plans = {
      1: { ids: ['pushup', 'diamond_pushup', 'tricep_dip', 'jog_zone2'],          title: 'Upper Body Day', reason: 'เย็นวันจันทร์ — Upper Body เต็มที่ กล้ามเนื้ออก ไหล่ ไทรเซ็ป พักมาตั้งแต่อาทิตย์' },
      2: { ids: ['squat', 'lunge', 'glute_bridge', 'calf_raise'],                  title: 'Lower Body Day', reason: 'เย็นวันอังคาร — Leg Day สมบูรณ์ ต้นขา ก้น น่อง เผาแคลสูงสุดใน Strength' },
      3: { ids: ['cat_cow', 'lateral_lunge', 'bird_dog', 'court_sport'],           title: 'คอร์ตคืนนี้!',    reason: 'เตรียมตัวก่อนเล่นคอร์ต — อบอุ่น Core และ Lateral movement ก่อนลงสนาม' },
      4: { ids: ['jump_squat', 'skaters', 'burpee_power', 'high_knees_power'],     title: 'Agility & Power', reason: 'วันพฤหัส — Agility + Power เพิ่มความคล่องตัวและพลังระเบิด ดีสำหรับกีฬา' },
      5: { ids: ['russian_twist', 'bicycle_crunch', 'leg_raises', 'jog_zone2'],    title: 'Core + Cardio',   reason: 'ปิดสัปดาห์วันศุกร์ด้วย Core + Cardio — หน้าท้องแน่น หัวใจแข็งแรง' },
      6: { ids: ['run_pace', 'aerobic'],                                             title: 'Cardio Day ยาว', reason: 'วันเสาร์มีเวลา — วิ่งต่อเนื่องหรือเต้นแอโรบิก 45+ นาที เผาแคลสูงสุดในสัปดาห์' },
      0: { ids: ['superman', 'cat_cow', 'childs_pose', 'downward_dog'],             title: 'Recovery & Flex', reason: 'วันอาทิตย์ Recovery — ยืดเหยียดฟื้นฟูกล้ามเนื้อ ลด DOMS เตรียมสัปดาห์ใหม่' },
    };
    const p = plans[dow] || plans[1];
    const dayTh = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][dow];
    return mk('🌆', `เย็นวัน${dayTh}: ${p.title}`, p.reason, p.ids);
  }

  // Fallback
  return mk('🎯', 'แนะนำวันนี้: Core + Cardio',
    `เกินเป้า +${excess.toLocaleString()} kcal — Core เสริม Stability และ Cardio เผาแคลคืนนี้`,
    ['plank', 'mountain_climber', 'jog_zone2']);
}

function _planTitle(ids) {
  const cats = [...new Set(ids.map(id => { const e = EXERCISE_DB.find(x=>x.id===id); return e ? e.catLabel : ''; }).filter(Boolean))];
  return cats.join(' + ');
}

// ─── Render ───────────────────────────────────────────────
function renderExerciseSuggest() {
  const el = document.getElementById('exercise-suggest');
  if (!el) return;

  const net    = hungerModule.getNetCalories();
  const goal   = characterModule.get('dailyCalorie') || 2000;
  const excess = Math.round(net - goal);

  if (excess < 50) { el.style.display = 'none'; return; }
  el.style.display = 'block';

  const now    = new Date();
  const hour   = now.getHours();
  const dow    = now.getDay();      // 0=Sun … 6=Sat
  const bmiCat = characterModule.get('categoryId') || 'normal';
  const rec    = _buildRecommendation(excess, bmiCat, dow, hour);

  // Summary stats for the recommended plan
  const totalMins = rec.exercises.reduce((s, e) => s + (e.totalMins || 0), 0);
  const totalKcal = rec.exercises.reduce((s, e) => s + (e.kcal || 0), 0);
  const covers    = totalKcal >= excess;
  const planIds   = JSON.stringify(rec.exercises.map(e => e.id));

  // Individual "pick your own" cards — rotate daily, exclude already-shown
  const dayIdx = now.getDate();
  const shownIds = new Set(rec.exercises.map(e => e.id));
  const altPool  = EXERCISE_DB.filter(e => !shownIds.has(e.id));
  const altCats  = ['upper','lower','core','cardio','agility','flexibility'];
  const altPicks = altCats
    .map(cat => { const pool = altPool.filter(e => e.cat === cat); return pool[(dayIdx + altCats.indexOf(cat)) % Math.max(pool.length,1)]; })
    .filter(Boolean).slice(0, 3);

  el.innerHTML = `
    <div class="exs-rec-banner">
      <div class="exs-rec-top">
        <span class="exs-rec-icon">${rec.icon}</span>
        <div class="exs-rec-title-wrap">
          <div class="exs-rec-title">${rec.title}</div>
          <div class="exs-rec-meta">เกินเป้า <b>+${excess.toLocaleString()} kcal</b></div>
        </div>
      </div>
      <div class="exs-rec-reason">${rec.reason}</div>
      ${rec.note ? `<div class="exs-rec-note">${rec.note}</div>` : ''}

      <div class="exs-rec-plan">
        ${rec.exercises.map((e, i) => `
          <div class="exs-rec-item">
            <span class="exs-rec-num">${i+1}</span>
            <span class="exs-rec-emoji">${e.emoji}</span>
            <div class="exs-rec-item-info">
              <span class="exs-rec-item-name">${e.name}</span>
              <span class="exs-rec-item-plan">${e.plan}</span>
            </div>
            <span class="exs-rec-item-cat" style="color:${e.catColor}">${e.catLabel}</span>
          </div>`).join('')}
      </div>

      <div class="exs-rec-footer">
        <div class="exs-rec-stats">
          <span>⏱ ~${totalMins} นาที</span>
          <span>🔥 ~${totalKcal.toLocaleString()} kcal ${covers ? '✅ คุ้มเป้า' : `(ขาดอีก ~${excess-totalKcal} kcal)`}</span>
        </div>
        <button class="exs-rec-log-all" onclick="logAllPlan(${planIds.replace(/"/g,"'")})">
          🔥 บันทึกทั้งแผน (${rec.exercises.length} ท่า)
        </button>
      </div>
    </div>

    <div class="exs-alt-section">
      <div class="exs-alt-title">หรือเลือกทำเองทีละท่า</div>
      <div class="exs-list">
        ${altPicks.map(p => _exsCard(p, excess)).join('')}
      </div>
    </div>`;
}

function logAllPlan(ids) {
  if (!Array.isArray(ids) || !ids.length) return;
  let totalKcal = 0, totalMins = 0;
  ids.forEach(id => {
    const ex = EXERCISE_DB.find(e => e.id === id);
    if (!ex) return;
    const kcal = ex.kcal || questModule.getExerciseKcal(ex.type, ex.totalMins);
    hungerModule.burnCalories(kcal, ex.totalMins);
    hungerModule.decayHunger(ex.totalMins, 'exercise');
    questModule.update('calories_burned', kcal);
    const mDone = missionModule.onEvent('exercise', { minutes: ex.totalMins, kcal, exType: ex.type });
    mDone.forEach(m => { const r = awardXP(m.xp, 'mission'); showToast(t('txt_mission_new', { xp: r.gained }), 'success'); });
    totalKcal += kcal;
    totalMins += ex.totalMins;
  });
  questModule.update('calories_net', hungerModule.getNetCalories());
  stressModule.reduceStress(15);
  const xpRaw  = questModule.getExerciseXP(totalKcal);
  const xpBase = gearModule.applyExerciseXP(xpRaw);
  const result = awardXP(xpBase, 'exercise');
  checkAchievements('exercise', {});
  showToast(`🔥 ออกกำลังกาย ${ids.length} ท่า • ${totalMins} นาที • เผา ${totalKcal} kcal • +${result.gained} XP`, 'success');
  showXPFloat(result.gained);
  if (result.levelUp) showLevelUp();
  renderAll();
  saveGame();
}

function _exsCard(ex, excess) {
  const covers    = ex.kcal >= excess;
  const kcalLabel = ex.kcalRange ? `${ex.kcalRange} kcal` : `~${ex.kcal} kcal`;
  const muscleTags = ex.muscles.map(m => `<span class="exs-muscle-tag">${m}</span>`).join('');

  // Effort zone row — only for entries that have it
  const effortRow = ex.effort ? `
    <div class="exs-effort-row">
      <span class="exs-effort-dot" style="background:${ex.effortColor}"></span>
      <span class="exs-effort-text" style="color:${ex.effortColor}">${ex.effort}</span>
    </div>` : '';

  return `
    <div class="exs-card">
      <div class="exs-card-head">
        <span class="exs-emoji">${ex.emoji}</span>
        <div class="exs-card-title-wrap">
          <span class="exs-card-name">${ex.name}</span>
          <span class="exs-cat-badge" style="background:${ex.catColor}22;color:${ex.catColor};border-color:${ex.catColor}44">${ex.catLabel}</span>
        </div>
        <div class="exs-burn-pill ${covers ? 'covers' : ''}">
          🔥 ${kcalLabel}${covers ? ' ✅' : ''}
        </div>
      </div>

      ${effortRow}

      <div class="exs-muscles">${muscleTags}</div>

      <div class="exs-plan-box">
        <div class="exs-plan-row">
          <span class="exs-plan-icon">📋</span>
          <span class="exs-plan-text">${ex.plan}</span>
        </div>
        <div class="exs-plan-row">
          <span class="exs-plan-icon">⏱</span>
          <span class="exs-plan-text">รวมประมาณ <b>${ex.totalMins} นาที</b></span>
        </div>
      </div>

      <div class="exs-how-box">
        <div class="exs-how-row"><span class="exs-how-icon">🎯</span><span>${ex.how}</span></div>
        <div class="exs-how-row easier"><span class="exs-how-icon">✅</span><span><b>ง่ายกว่า:</b> ${ex.easier}</span></div>
        <div class="exs-how-row harder"><span class="exs-how-icon">⬆️</span><span><b>ยากกว่า:</b> ${ex.harder}</span></div>
      </div>

      <button class="exs-log-btn" onclick="quickLogExercise('${ex.type}',${ex.totalMins},'${ex.name}',${ex.kcal})">
        🔥 บันทึก — ${ex.name} ${ex.totalMins} นาที (~${ex.kcal} kcal)
      </button>
    </div>`;
}

function quickLogExercise(type, minutes, displayName, kcalOverride) {
  const kcal   = kcalOverride || questModule.getExerciseKcal(type, minutes);
  const xpRaw  = questModule.getExerciseXP(kcal);
  const xpBase = gearModule.applyExerciseXP(xpRaw);

  hungerModule.burnCalories(kcal, minutes);
  hungerModule.decayHunger(minutes, 'exercise');
  questModule.update('calories_burned', kcal);
  questModule.update('calories_net', hungerModule.getNetCalories());

  const result = awardXP(xpBase, 'exercise');

  const mDone = missionModule.onEvent('exercise', { minutes, kcal, exType: type });
  mDone.forEach(m => { const r = awardXP(m.xp, 'mission'); showToast(t('txt_mission_new', { xp: r.gained }), 'success'); });

  stressModule.reduceStress(10);
  checkAchievements('exercise', { exerciseType: type });

  showToast(`🔥 ${displayName || type} ${minutes} นาที — เผา ${kcal} kcal  +${result.gained} XP`, 'success');
  showXPFloat(result.gained);
  if (result.levelUp) showLevelUp();
  renderAll();
  saveGame();
}

function logExercise() { showTab('quests'); }

function doLogExercise() {
  const type    = document.getElementById('ex-type').value;
  const minutes = parseInt(document.getElementById('ex-minutes').value);

  if (!minutes || minutes < 1 || minutes > 300) {
    showToast('⚠️ ใส่จำนวนนาทีที่ถูกต้อง', 'error');
    return;
  }

  const kcal = questModule.getExerciseKcal(type, minutes);
  const xpRaw = questModule.getExerciseXP(kcal);
  const xpBase = gearModule.applyExerciseXP(xpRaw);

  hungerModule.burnCalories(kcal, minutes);
  hungerModule.decayHunger(minutes, 'exercise');
  questModule.update('calories_burned', kcal);
  questModule.update('calories_net', hungerModule.getNetCalories());

  const result = awardXP(xpBase, 'exercise');

  // Phase 8: mission progress
  const mDone = missionModule.onEvent('exercise', { minutes, kcal, exType: type });
  mDone.forEach(m => { const r = awardXP(m.xp, 'mission'); showToast(t('txt_mission_new', { xp: r.gained }), 'success'); });

  // Exercise reduces stress
  const stressReduce = stressModule.getActiveEvents().some(e => e.id === 'project_due') ? 15 : 10;
  stressModule.reduceStress(stressReduce);
  checkAchievements('exercise', { exerciseType: type });

  const msg = t('exercise_logged', { min: minutes, kcal, xp: result.gained });
  showToast(msg, 'success');
  showXPFloat(result.gained);

  if (result.levelUp) showLevelUp();

  renderAll();
  saveGame();
}

// ═══════════════════════════════════════════
// SHOP
// ═══════════════════════════════════════════
function filterShop(btn, cat) {
  document.querySelectorAll('#tab-shop .cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _shopFilter = cat;
  renderShop();
}

function renderShop() {
  document.getElementById('shop-xp-balance').textContent = `${window._xpBalance || 0} XP`;
  const level = characterModule.get('level');
  const grid  = document.getElementById('shop-grid');
  grid.innerHTML = '';

  // Render regular XP shop items
  if (_shopFilter !== 'gear') {
    const items = xpModule.getAllItems(_shopFilter);
    items.forEach(item => {
      const owned  = xpModule.owns(item.id);
      const locked = item.unlock_level && level < item.unlock_level;
      const card   = document.createElement('div');
      card.className = `shop-card rarity-${item.rarity}`;
      card.style.opacity = locked ? '0.5' : '1';
      card.innerHTML = `
        ${owned ? `<span class="shop-owned">${t('shop_owned')}</span>` : ''}
        <div class="shop-card-icon">${item.icon}</div>
        <div class="shop-card-name">${xpModule.getItemName(item)}</div>
        <div class="shop-card-desc">${xpModule.getItemDesc(item)}</div>
        ${locked ? `<div style="font-size:11px;color:var(--warning)">🔒 Lv.${item.unlock_level}</div>` : ''}
        <div class="shop-card-price">${item.xp_cost} XP</div>
      `;
      if (!locked) card.onclick = () => buyShopItem(item.id);
      grid.appendChild(card);
    });
  }

  // Phase 8: Gear section
  if (_shopFilter === 'all' || _shopFilter === 'gear') {
    if (_shopFilter === 'all') {
      const sep = document.createElement('div');
      sep.style.cssText = 'grid-column:1/-1;padding:8px 0 2px;font-size:13px;font-weight:700;color:var(--primary)';
      sep.textContent = t('txt_gear_title');
      grid.appendChild(sep);
    }
    gearModule.getAll().forEach(g => {
      const owned    = gearModule.isOwned(g.id);
      const equipped = gearModule.isEquipped(g.id);
      const name     = currentLang === 'en' ? g.name_en : g.name_th;
      const desc     = currentLang === 'en' ? g.desc_en : g.desc_th;
      const slotLabel = gearModule.getSlotLabel(g.slot);

      const card = document.createElement('div');
      card.className = `gear-card gear-rarity-${g.rarity}${equipped ? ' equipped' : ''}`;

      let btnHtml = '';
      if (!owned) {
        btnHtml = `<button class="gear-btn gear-btn-buy" onclick="buyGear('${g.id}')">${t('txt_gear_buy')} ${g.cost} XP</button>`;
      } else if (equipped) {
        btnHtml = `<button class="gear-btn gear-btn-unequip" onclick="toggleGear('${g.id}')">${t('txt_gear_unequip')}</button>`;
      } else {
        btnHtml = `<button class="gear-btn gear-btn-equip" onclick="toggleGear('${g.id}')">${t('txt_gear_equip')}</button>`;
      }

      card.innerHTML = `
        ${equipped ? `<span class="gear-equipped-tag">${t('txt_gear_equipped')}</span>` : ''}
        <div class="gear-icon">${g.icon}</div>
        <div class="gear-name">${name}</div>
        <div class="gear-desc">${desc}</div>
        <div class="gear-slot-badge">${slotLabel}</div>
        ${btnHtml}
      `;
      grid.appendChild(card);
    });
  }
}

function buyShopItem(itemId) {
  const item = xpModule.getItem(itemId);
  if (!item) return;

  const result = xpModule.buy(itemId, window._xpBalance || 0, characterModule.get('level'));
  if (!result.success) {
    showToast(result.msg, 'error');
    return;
  }

  window._xpBalance -= result.cost;
  xpModule.applyItem(itemId);

  const name = xpModule.getItemName(item);
  showToast(`${item.icon} ${t('shop_bought', { name })}`, 'success');
  renderAll();
  saveGame();
}

// ═══════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════
function renderProfile() {
  const ch = characterModule;
  const bmi = ch.get('bmi');

  document.getElementById('profile-avatar').textContent = ch.get('gender') === 'M' ? '🧑' : '👧';
  document.getElementById('profile-name').textContent = ch.get('name');
  document.getElementById('profile-title-text').textContent = ch.getTitle();
  document.getElementById('profile-bmi').textContent = bmi.toFixed(1);
  document.getElementById('profile-category').innerHTML =
    `<span style="color:${bmiModule.getCategoryColor(bmi)}">${bmiModule.getCategoryLabel(bmi)}</span>`;
  document.getElementById('profile-calorie').textContent = `${ch.get('dailyCalorie').toLocaleString()} kcal`;
  document.getElementById('profile-level').textContent = ch.get('level');
  document.getElementById('profile-totalxp').textContent = ch.get('totalExp').toLocaleString();
  document.getElementById('profile-streak').textContent = `${streakModule.currentStreak} วัน`;
  document.getElementById('profile-playdays').textContent = `${streakModule.totalDaysPlayed} วัน`;
  const latestW = weightModule.getLatest();
  document.getElementById('profile-weight').textContent = latestW ? `${latestW.weight} kg` : `${characterModule.get('weightKg')} kg`;
  document.getElementById('advice-content').textContent = t(bmiModule.getAdviceKey(bmi));
}

// ═══════════════════════════════════════════
// XP AWARD
// ═══════════════════════════════════════════
function awardXP(amount, source) {
  const sleepMult  = sleepModule.getXPMultiplier();
  const eventBonus = stressModule.getXPBonus(source || 'all');
  const final = Math.max(1, Math.round(amount * sleepMult * eventBonus));

  const result = characterModule.addExp(final);
  window._xpBalance = (window._xpBalance || 0) + final;
  checkAchievements('xp', {});
  if (result.levelUp) {
    checkAchievements('level', {});
    setTimeout(() => { showLevelUp(); renderAll(); }, 200);
  }
  renderHUD();
  return { gained: final, levelUp: result.levelUp };
}

// ═══════════════════════════════════════════
// LEVEL UP MODAL
// ═══════════════════════════════════════════
function showLevelUp() {
  const ch = characterModule;
  document.getElementById('levelup-num').textContent = `Lv.${ch.get('level')}`;
  document.getElementById('levelup-title').textContent = ch.getTitle();
  document.getElementById('levelup-stats').innerHTML =
    `+5 ❤️ &nbsp; +2 💪 &nbsp; +2 🏃 &nbsp; +1 🧠 &nbsp; +3 ⚡`;
  document.getElementById('levelup-modal').style.display = 'flex';
}

function closeLevelUp() {
  document.getElementById('levelup-modal').style.display = 'none';
}

// TOAST — handled by Phase 7 queue below

// ═══════════════════════════════════════════
// XP FLOAT ANIMATION
// ═══════════════════════════════════════════
function showXPFloat(xp) {
  const el = document.createElement('div');
  el.className = 'xp-gain-float';
  el.textContent = `+${xp} XP`;
  el.style.left = '50%';
  el.style.top  = '40%';
  el.style.transform = 'translateX(-50%)';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

// ═══════════════════════════════════════════
// RESET
// ═══════════════════════════════════════════
function confirmReset() {
  if (confirm('เริ่มเกมใหม่? ข้อมูลทั้งหมดจะถูกลบ')) {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }
}

// ═══════════════════════════════════════════
// PHASE 6: FIREBASE AUTH + CLOUD
// ═══════════════════════════════════════════

function onAuthStateChanged(user) {
  const btn        = document.getElementById('auth-btn');
  const statusBar  = document.getElementById('cloud-status-bar');
  const lbSection  = document.getElementById('leaderboard-section');
  const statusText = document.getElementById('cloud-status-text');

  if (user) {
    if (btn) {
      btn.textContent = firebaseModule.getUserPhotoURL()
        ? `<img src="${firebaseModule.getUserPhotoURL()}" style="width:18px;height:18px;border-radius:50%">`
        : '👤';
      btn.title = firebaseModule.getUserDisplayName();
    }
    if (statusBar) statusBar.style.display = 'flex';
    if (lbSection) lbSection.style.display = 'block';
    if (statusText) {
      statusText.textContent = (currentLang === 'en')
        ? `Connected: ${firebaseModule.getUserDisplayName()}`
        : `เชื่อมต่อ: ${firebaseModule.getUserDisplayName()}`;
    }
    // Try restoring from cloud if localStorage is empty
    const local = localStorage.getItem(SAVE_KEY);
    if (!local) {
      firebaseModule.loadFromCloud().then(cloudData => {
        if (cloudData) {
          localStorage.setItem(SAVE_KEY, cloudData);
          showToast(currentLang === 'en' ? '☁️ Loaded from cloud!' : '☁️ โหลดจาก Cloud แล้ว!', 'success');
          location.reload();
        }
      });
    }
    updateCloudStatusIcon('synced');
    loadLeaderboard();
  } else {
    if (btn) { btn.textContent = '☁️'; btn.title = 'Cloud Save'; }
    if (statusBar) statusBar.style.display = 'none';
    if (lbSection) lbSection.style.display = 'none';
  }
}

function updateCloudStatusIcon(state) {
  const icon = document.getElementById('cloud-status-icon');
  if (!icon) return;
  const icons = { synced: '☁️✅', syncing: '☁️⏳', error: '☁️❌' };
  icon.textContent = icons[state] || '☁️';
}

async function toggleAuth() {
  if (!firebaseModule.isAvailable()) {
    showToast(currentLang === 'en'
      ? '☁️ Firebase not configured yet'
      : '☁️ ยังไม่ได้ตั้งค่า Firebase', 'error');
    return;
  }
  if (firebaseModule.isLoggedIn()) {
    showTab('profile');
  } else {
    showToast(currentLang === 'en' ? '☁️ Signing in...' : '☁️ กำลังเข้าสู่ระบบ...', 'success');
    const result = await firebaseModule.signInWithGoogle();
    if (!result.success) {
      showToast(`❌ ${result.error}`, 'error');
    }
  }
}

async function doSignOut() {
  await firebaseModule.signOut();
  showToast(currentLang === 'en' ? '👋 Signed out' : '👋 ออกจากระบบแล้ว', 'success');
}

function updateLeaderboardEntry() {
  if (!firebaseModule.isLoggedIn()) return;
  firebaseModule.updateLeaderboard({
    name:         characterModule.get('name') || 'ผู้เล่น',
    level:        characterModule.get('level'),
    streak:       streakModule.currentStreak,
    achievements: achievementModule.getCount(),
    bmiCategory:  characterModule.get('categoryId') || 'normal',
    daysPlayed:   streakModule.totalDaysPlayed || 0,
  });
}

async function loadLeaderboard() {
  const list = document.getElementById('lb-list');
  if (!list) return;
  if (!firebaseModule.isLoggedIn()) return;

  list.innerHTML = `<div class="lb-loading">${currentLang === 'en' ? '⏳ Loading...' : '⏳ กำลังโหลด...'}</div>`;
  const entries = await firebaseModule.getLeaderboard(10);

  if (!entries.length) {
    list.innerHTML = `<div class="lb-empty">${currentLang === 'en' ? 'No entries yet' : 'ยังไม่มีข้อมูล'}</div>`;
    return;
  }

  list.innerHTML = '';
  const myUid = firebaseModule.user?.uid;
  entries.forEach((entry, i) => {
    const isMe = entry.uid === myUid;
    const row  = document.createElement('div');
    row.className = `lb-row${isMe ? ' lb-me' : ''}`;
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
    row.innerHTML = `
      <span class="lb-rank">${medal}</span>
      <span class="lb-name">${_escHtml(entry.name || 'ผู้เล่น')}</span>
      <span class="lb-stats">Lv.${entry.level} • 🔥${entry.streak} • 🏆${entry.achievements}</span>
    `;
    list.appendChild(row);
  });
}

// XSS-safe HTML escape for leaderboard names
function _escHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ═══════════════════════════════════════════
// PHASE 5: EXPORT & BACKUP
// ═══════════════════════════════════════════

function _downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportCSV() {
  const days = historyModule.getRecent(30);
  if (!days.length) {
    showToast(currentLang === 'en' ? '⚠️ No history data yet' : '⚠️ ยังไม่มีข้อมูลประวัติ', 'error');
    return;
  }
  const headers = ['Date','CaloriesEaten','CaloriesBurned','CalorieGoal','SleepHours','SleepQuality','Stress','ExerciseMin','QuestsDone','WaterGlasses','WeightKg','BMI','Level'];
  const rows = days.map(d => [
    d.date, d.caloriesEaten, d.caloriesBurned, d.calorieGoal,
    d.sleepHours, d.sleepQuality, d.stress, d.exerciseMin,
    d.questsDone, d.waterDrank, d.weight || '', d.bmi || '', d.level
  ].join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const name = characterModule.get('name') || 'player';
  const date = new Date().toISOString().slice(0, 10);
  _downloadFile(csv, `health-${name}-${date}.csv`, 'text/csv;charset=utf-8;');
  showToast(currentLang === 'en' ? '📊 CSV downloaded!' : '📊 ดาวน์โหลด CSV แล้ว!', 'success');
}

function exportSaveJSON() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) { showToast('⚠️ ไม่พบข้อมูล', 'error'); return; }
  const name = characterModule.get('name') || 'save';
  const date = new Date().toISOString().slice(0, 10);
  _downloadFile(raw, `shg-backup-${name}-${date}.json`, 'application/json');
  showToast(currentLang === 'en' ? '💾 Backup saved!' : '💾 บันทึกสำรองแล้ว!', 'success');
}

function triggerImport() {
  document.getElementById('import-file-input').click();
}

function importSaveJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const state = JSON.parse(e.target.result);
      // Basic validation — must have character key
      if (!state.character) throw new Error('invalid save');
      if (!confirm(currentLang === 'en'
        ? 'Replace current save with this backup?'
        : 'แทนที่ข้อมูลปัจจุบันด้วยไฟล์สำรองนี้?')) return;
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      showToast(currentLang === 'en' ? '✅ Imported! Reloading...' : '✅ นำเข้าสำเร็จ! กำลังโหลดใหม่...', 'success');
      setTimeout(() => location.reload(), 1200);
    } catch {
      showToast(currentLang === 'en' ? '❌ Invalid file' : '❌ ไฟล์ไม่ถูกต้อง', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function copyHealthCard() {
  const ch    = characterModule;
  const name  = ch.get('name') || 'Player';
  const level = ch.get('level');
  const bmi   = ch.get('bmi');
  const bmiLabel = bmiModule.getCategoryLabel(bmi);
  const streak   = streakModule.currentStreak || 0;
  const achCount = achievementModule.getCount();
  const ws       = historyModule.getWeeklySummary();
  const isTh     = currentLang === 'th';
  const div      = '══════════════════════';

  let card;
  if (isTh) {
    card = [
      `📊 รายงานสุขภาพ — ${name}`,
      div,
      `⚖️ BMI: ${bmi} (${bmiLabel})`,
      `🎯 เลเวล: ${level} | XP รวม: ${window._xpBalance || 0}`,
      `🔥 Streak: ${streak} วัน`,
      ws ? `🍽️ เฉลี่ยแคลอรี่: ${ws.avgCalories} kcal/วัน` : '',
      ws ? `😴 เฉลี่ยนอน: ${ws.avgSleep} ชม./คืน` : '',
      ws ? `🏃 ออกกำลัง: ${ws.totalExMin} นาที/สัปดาห์` : '',
      `🏆 ความสำเร็จ: ${achCount}/21`,
      div,
      `#StudentHealthGame 🎮`,
    ].filter(Boolean).join('\n');
  } else {
    card = [
      `📊 Health Report — ${name}`,
      div,
      `⚖️ BMI: ${bmi} (${bmiLabel})`,
      `🎯 Level: ${level} | XP: ${window._xpBalance || 0}`,
      `🔥 Streak: ${streak} days`,
      ws ? `🍽️ Avg Calories: ${ws.avgCalories} kcal/day` : '',
      ws ? `😴 Avg Sleep: ${ws.avgSleep} hrs/night` : '',
      ws ? `🏃 Exercise: ${ws.totalExMin} min/week` : '',
      `🏆 Achievements: ${achCount}/21`,
      div,
      `#StudentHealthGame 🎮`,
    ].filter(Boolean).join('\n');
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(card).then(() => {
      showToast(isTh ? '📋 คัดลอกแล้ว!' : '📋 Copied to clipboard!', 'success');
    }).catch(() => _fallbackCopy(card));
  } else {
    _fallbackCopy(card);
  }
}

function _fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try {
    document.execCommand('copy');
    showToast(currentLang === 'en' ? '📋 Copied!' : '📋 คัดลอกแล้ว!', 'success');
  } catch {
    showToast('⚠️ ไม่สามารถคัดลอกได้', 'error');
  }
  document.body.removeChild(ta);
}

// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// PHASE 8: DAILY MISSIONS + GEAR
// ═══════════════════════════════════════════

function renderMissions() {
  const list = document.getElementById('mission-list');
  if (!list) return;

  const missions = missionModule.getMissions();
  const netCal   = hungerModule.getNetCalories ? hungerModule.getNetCalories() : 0;
  const dailyGoal = characterModule.get('dailyCalorie') || 2000;
  const stress    = stressModule.level || 0;

  // Auto-check state-based missions (calorie_goal, low_stress)
  const autoDone = missionModule.autoCheck({ netCalories: netCal, dailyGoal, stress });
  if (autoDone.length) {
    autoDone.forEach(m => {
      const r = awardXP(m.xp, 'mission');
      showToast(t('txt_mission_new', { xp: r.gained }), 'success');
    });
    saveGame();
  }

  list.innerHTML = '';
  missions.forEach(m => {
    const p   = missionModule.getProgress(m.id);
    const pct = Math.min(100, Math.round((p.count / m.target) * 100));
    const done = p.completed;

    const diff_th = m.diff === 'easy' ? 'ง่าย' : m.diff === 'medium' ? 'กลาง' : 'ยาก';
    const diffLabel = currentLang === 'en' ? m.diff : diff_th;

    const item = document.createElement('div');
    item.className = 'mission-item' + (done ? ' done' : '');
    item.innerHTML = `
      <div class="mission-emoji">${m.emoji}</div>
      <div class="mission-info">
        <div class="mission-title">${currentLang === 'en' ? m.title_en : m.title_th}</div>
        <div class="mission-prog-row">
          <div class="mission-prog-bar"><div class="mission-prog-fill" style="width:${pct}%"></div></div>
          <span class="mission-prog-text">${p.count}/${m.target}</span>
          <span class="mission-diff diff-${m.diff}">${diffLabel}</span>
        </div>
      </div>
      ${done
        ? '<div class="mission-done-icon">✅</div>'
        : `<div class="mission-xp">+${m.xp} XP</div>`
      }
    `;
    list.appendChild(item);
  });

  // Show chest
  const chest   = document.getElementById('mission-chest');
  const chestBtn = document.getElementById('mission-chest-btn');
  if (chest && chestBtn) {
    const allDone = missionModule.isAllDone();
    const claimed = missionModule.getBonusClaimed();
    if (allDone) {
      chest.classList.remove('hidden');
      if (claimed) {
        chestBtn.textContent = t('txt_chest_claimed');
        chestBtn.disabled = true;
      } else {
        chestBtn.textContent = t('txt_chest_claim', { xp: missionModule.getBonusXP() });
        chestBtn.disabled = false;
      }
    } else {
      chest.classList.add('hidden');
    }
  }
}

function claimMissionChest() {
  const bonus = missionModule.claimBonus();
  if (!bonus) return;
  const result = awardXP(bonus, 'mission-chest');
  showToast(`🎁 ${t('txt_mission_all_done')} +${result.gained} XP!`, 'success');
  showXPFloat(result.gained);
  if (result.levelUp) showLevelUp();
  renderMissions();
  saveGame();
}

// ─── Gear ────────────────────────────────

function buyGear(id) {
  const g = gearModule.getById(id);
  if (!g) return;
  if (gearModule.isOwned(id)) { showToast('มีแล้ว!', 'info'); return; }
  const cost = g.cost;
  if ((window._xpBalance || 0) < cost) {
    showToast(`❌ XP ไม่พอ (ต้องการ ${cost} XP)`, 'error');
    return;
  }
  window._xpBalance -= cost;
  gearModule.buy(id);
  gearModule.toggle(id); // auto-equip on purchase
  const name = currentLang === 'en' ? g.name_en : g.name_th;
  showToast(`${g.icon} ซื้อและสวมใส่ ${name} แล้ว!`, 'success');
  renderShop();
  saveGame();
}

function toggleGear(id) {
  if (!gearModule.isOwned(id)) return;
  gearModule.toggle(id);
  const g = gearModule.getById(id);
  const name = currentLang === 'en' ? g.name_en : g.name_th;
  const msg = gearModule.isEquipped(id) ? `✓ สวมใส่ ${name}` : `ถอด ${name}`;
  showToast(`${g.icon} ${msg}`, 'info');
  renderShop();
  saveGame();
}

// PHASE 7: POLISH
// ═══════════════════════════════════════════

function renderGlance() {
  const hm  = hungerModule;
  const sm  = sleepModule;
  const qm  = questModule;
  const wm  = weightModule;
  const ch  = characterModule;
  const dailyCal = ch.get('dailyCalorie');

  // Calories: eaten / goal, color-coded
  const calPct = Math.round(hm.caloriesEaten / dailyCal * 100);
  const calEl  = document.getElementById('glance-cal');
  if (calEl) {
    calEl.textContent = `${hm.caloriesEaten} kcal`;
    calEl.style.color = calPct > 110 ? 'var(--danger)' : calPct > 85 ? 'var(--warning)' : 'var(--success)';
  }

  // Sleep
  const sleepEl = document.getElementById('glance-sleep');
  if (sleepEl) sleepEl.textContent = sm.lastSleepHours ? `${sm.lastSleepHours} ชม.` : '—';

  // Exercise minutes today
  const exEl = document.getElementById('glance-ex');
  if (exEl) exEl.textContent = hm.exerciseMinutes ? `${hm.exerciseMinutes} นาที` : '—';

  // Water
  const waterEl = document.getElementById('glance-water');
  if (waterEl) {
    const wg = waterModule.getGlasses(), wgg = waterModule.getGoalGlasses();
    waterEl.textContent = `${wg}/${wgg}`;
    waterEl.style.color = waterModule.isGoalMet() ? 'var(--success)' : '';
  }

  // Quests
  const questEl = document.getElementById('glance-quests');
  if (questEl) {
    const done = qm.countCompleted(dailyCal);
    questEl.textContent = `${done}/5`;
    questEl.style.color = done >= 3 ? 'var(--success)' : '';
  }

  // Weight
  const wtEl = document.getElementById('glance-weight');
  if (wtEl) {
    const latest = wm.getLatest();
    wtEl.textContent = latest ? `${latest.weight} kg` : '—';
  }
}

// ─── Toast Queue ──────────────────────────────────────────
let _toastQueue = [];
let _toastActive = false;

function showToast(msg, type = 'success', duration = 2800) {
  _toastQueue.push({ msg, type, duration });
  if (!_toastActive) _processToastQueue();
}

function _processToastQueue() {
  if (!_toastQueue.length) { _toastActive = false; return; }
  _toastActive = true;
  const { msg, type, duration } = _toastQueue.shift();
  _showToastNow(msg, type, duration);
}

function _showToastNow(msg, type, duration) {
  let el = document.getElementById('toast-el');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast-el';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className   = `toast toast-${type} toast-in`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => {
    el.classList.replace('toast-in', 'toast-out');
    setTimeout(() => {
      el.className = 'toast';
      _processToastQueue();
    }, 350);
  }, duration);
}

// ═══════════════════════════════════════════
// PHASE 1.5: FATIGUE RENDER
// ═══════════════════════════════════════════
function renderFatigue() {
  const f = sleepModule.getCurrentFatigue();
  const bar = document.getElementById('fatigue-bar');
  if (!bar) return;
  bar.style.width = f + '%';
  bar.style.background = f >= 70 ? '#4ade80' : f >= 40 ? '#fbbf24' : '#f87171';
  document.getElementById('fatigue-pct').textContent = f + '%';
  document.getElementById('fatigue-status').textContent = t(sleepModule.getStatusKey());
}

// ═══════════════════════════════════════════
// PHASE 1.5: STRESS RENDER
// ═══════════════════════════════════════════
function renderStress() {
  const s = stressModule.stress;
  const bar = document.getElementById('stress-bar');
  if (!bar) return;
  bar.style.width = s + '%';
  bar.style.background = s <= 30 ? '#4ade80' : s <= 60 ? '#fbbf24' : '#f87171';
  document.getElementById('stress-pct').textContent = s + '%';
  document.getElementById('stress-status').textContent = t(stressModule.getStatusKey());
}

// ═══════════════════════════════════════════
// PHASE 1.5: LIFE EVENTS BANNER
// ═══════════════════════════════════════════
function renderLifeEvents() {
  const events  = stressModule.getActiveEvents();
  const section = document.getElementById('life-events-banner');
  if (!section) return;

  if (events.length === 0) { section.style.display = 'none'; return; }
  section.style.display = 'flex';
  // Clear previous tags (keep only .event-tag children)
  section.querySelectorAll('.event-tag').forEach(t => t.remove());
  events.forEach(ev => {
    const name = currentLang === 'en' ? ev.name_en : ev.name_th;
    const tag  = document.createElement('span');
    tag.className = 'event-tag';
    tag.style.color       = ev.color;
    tag.style.borderColor = ev.color;
    tag.textContent = `${ev.icon} ${name}`;
    section.appendChild(tag);
  });
}

// ═══════════════════════════════════════════
// PHASE 1.5: STRESS HUNGER DRAIN
// ═══════════════════════════════════════════
let _stressDrainInterval = null;
function startStressDrain() {
  if (_stressDrainInterval) clearInterval(_stressDrainInterval);
  _stressDrainInterval = setInterval(() => {
    const extra = stressModule.getHungerDrainBonus();
    if (extra > 0) {
      hungerModule.hunger = Math.max(0, hungerModule.hunger - extra);
    }
  }, 60000);
}

// ═══════════════════════════════════════════
// PHASE 1.5: SLEEP MODAL
// ═══════════════════════════════════════════
function showSleepModal() {
  document.getElementById('sleep-modal').style.display = 'flex';
}

function closeSleepModal() {
  document.getElementById('sleep-modal').style.display = 'none';
}

function confirmLogSleep() {
  const hours   = parseFloat(document.getElementById('sleep-hours').value);
  const quality = document.getElementById('sleep-quality').value;

  if (isNaN(hours) || hours < 0 || hours > 12) {
    showToast('⚠️ ใส่ชั่วโมงนอน 0–12', 'error');
    return;
  }

  sleepModule.logSleep(hours, quality);
  checkAchievements('sleep', { hours });

  // Good sleep reduces stress
  const stressReduce = quality === 'good' ? 15 : quality === 'poor' ? 0 : 8;
  if (stressReduce > 0) stressModule.reduceStress(stressReduce);

  // XP reward: bonus for hitting the 7–9h sweet spot + gear bonus
  const xpSleepBase = (hours >= 7 && hours <= 9) ? 30 : 15;
  const xpReward = gearModule.applySleepXP(xpSleepBase);
  const result   = awardXP(xpReward, 'sleep');
  // Phase 8: mission progress
  const mDoneS = missionModule.onEvent('sleep', { hours });
  mDoneS.forEach(m => { const r = awardXP(m.xp, 'mission'); showToast(t('txt_mission_new', { xp: r.gained }), 'success'); });

  closeSleepModal();
  const statusMsg = t(sleepModule.getStatusKey());
  showToast(`😴 นอน ${hours}ชม. ${statusMsg} +${result.gained} XP`, 'success');
  renderAll();
  saveGame();
}

// ═══════════════════════════════════════════
// PHASE 1.5: LIFE EVENT MODAL
// ═══════════════════════════════════════════
function showLifeEventModal() {
  const grid = document.getElementById('life-events-grid');
  grid.innerHTML = '';

  const activeIds = new Set(stressModule.getActiveEvents().map(e => e.id));

  LIFE_EVENTS.forEach(ev => {
    const active = activeIds.has(ev.id);
    const card   = document.createElement('div');
    card.className = 'life-event-card' + (active ? ' active' : '');
    card.onclick   = () => selectLifeEvent(ev.id);

    const name = currentLang === 'en' ? ev.name_en : ev.name_th;
    const desc = currentLang === 'en' ? ev.desc_en : ev.desc_th;

    card.innerHTML = `
      <div class="le-icon">${ev.icon}</div>
      <div class="le-name" style="color:${ev.color}">${name}</div>
      <div class="le-desc">${desc}</div>
      ${active ? '<div class="le-active">✓ กำลังดำเนินอยู่</div>' : ''}
    `;
    grid.appendChild(card);
  });

  document.getElementById('life-event-modal').style.display = 'flex';
}

function closeLifeEventModal() {
  document.getElementById('life-event-modal').style.display = 'none';
}

function selectLifeEvent(eventId) {
  const ev = stressModule.triggerEvent(eventId);
  if (!ev) return;

  const name = currentLang === 'en' ? ev.name_en : ev.name_th;
  const type = ev.stress_change > 0 ? 'warning' : 'success';
  const sign = ev.stress_change > 0 ? '+' : '';
  showToast(`${ev.icon} ${name}! ความเครียด ${sign}${ev.stress_change}`, type);

  closeLifeEventModal();
  renderAll();
  saveGame();
}

// ═══════════════════════════════════════════
// PHASE 1.5: WATER LOG
// ═══════════════════════════════════════════
// ─── Food Search Autocomplete ────────────────────────────

function initFoodSearch() {
  const input = document.getElementById('food-log-name');
  const drop  = document.getElementById('food-search-dropdown');
  if (!input || !drop || input._fsInit) return;
  input._fsInit = true;

  let _activeIdx = -1;

  function openDrop(items) {
    _activeIdx = -1;
    if (!items.length) {
      drop.innerHTML = '<div class="fsd-no-result">ไม่พบอาหาร — พิมพ์ชื่อเองได้เลย</div>';
      drop.classList.add('open');
      return;
    }
    drop.innerHTML = items.map((f, i) =>
      `<div class="fsd-item" data-idx="${i}" onclick="selectFood(${i})">
        <span class="fsd-emoji">${f.emoji || '🍽️'}</span>
        <div class="fsd-info">
          <div class="fsd-name">${f.name}</div>
          <div class="fsd-portion">${f.portion || ''}</div>
        </div>
        <span class="fsd-kcal">${f.kcal} kcal</span>
      </div>`
    ).join('');
    drop.classList.add('open');
    drop._items = items;
  }

  function closeDrop() {
    drop.classList.remove('open');
    drop._items = null;
    _activeIdx = -1;
  }

  function setActive(idx) {
    const rows = drop.querySelectorAll('.fsd-item');
    rows.forEach(r => r.classList.remove('active'));
    if (idx >= 0 && idx < rows.length) {
      rows[idx].classList.add('active');
      rows[idx].scrollIntoView({ block: 'nearest' });
    }
    _activeIdx = idx;
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q || !window.FOOD_DB) { closeDrop(); return; }
    const lower = q.toLowerCase();
    const starts  = FOOD_DB.filter(f => f.name.toLowerCase().startsWith(lower));
    const contains = FOOD_DB.filter(f => !f.name.toLowerCase().startsWith(lower) && f.name.toLowerCase().includes(lower));
    const results = [...starts, ...contains].slice(0, 8);
    openDrop(results);
  });

  input.addEventListener('keydown', e => {
    if (!drop.classList.contains('open')) return;
    const items = drop._items || [];
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(_activeIdx + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(_activeIdx - 1, 0));
    } else if (e.key === 'Enter' && _activeIdx >= 0) {
      e.preventDefault();
      fillFood(items[_activeIdx]);
      closeDrop();
    } else if (e.key === 'Escape') {
      closeDrop();
    }
  });

  document.addEventListener('click', e => {
    if (!drop.contains(e.target) && e.target !== input) closeDrop();
  });

  // Store items reference for onclick handler
  window._foodSearchItems = null;
  drop.addEventListener('mouseover', e => {
    const row = e.target.closest('.fsd-item');
    if (row) {
      drop.querySelectorAll('.fsd-item').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      _activeIdx = parseInt(row.dataset.idx);
    }
  });
}

function selectFood(idx) {
  const drop = document.getElementById('food-search-dropdown');
  if (!drop || !drop._items) return;
  fillFood(drop._items[idx]);
  drop.classList.remove('open');
  drop._items = null;
}

function fillFood(f) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('food-log-name',    f.name);
  set('food-log-kcal',    f.kcal);
  set('food-log-protein', f.protein || '');
  set('food-log-carbs',   f.carbs   || '');
  set('food-log-fat',     f.fat     || '');
  document.getElementById('food-log-kcal').focus();
}

// ─── Custom Food Log ─────────────────────────────────────

function logCustomFood() {
  const nameEl    = document.getElementById('food-log-name');
  const kcalEl    = document.getElementById('food-log-kcal');
  const mealEl    = document.getElementById('food-log-meal');
  const proteinEl = document.getElementById('food-log-protein');
  const carbsEl   = document.getElementById('food-log-carbs');
  const fatEl     = document.getElementById('food-log-fat');

  const name     = (nameEl.value || '').trim();
  const kcal     = parseFloat(kcalEl.value);
  const mealType = mealEl.value;
  const macros   = {
    protein: parseFloat(proteinEl.value) || 0,
    carbs:   parseFloat(carbsEl.value)   || 0,
    fat:     parseFloat(fatEl.value)     || 0,
  };

  if (!kcal || kcal < 1 || kcal > 5000) {
    showToast('⚠️ ใส่แคลอรี่ให้ถูกต้อง (1–5000)', 'error');
    return;
  }

  const entry = hungerModule.logCustomFood(name || 'อาหาร', kcal, mealType, macros);
  questModule.update('meal_logged', mealType);
  questModule.update('calories_net', hungerModule.getNetCalories());
  checkAchievements('meal', {});
  const mDoneF = missionModule.onEvent('meal', {});
  mDoneF.forEach(m => { const r = awardXP(m.xp, 'mission'); showToast(t('txt_mission_new', { xp: r.gained }), 'success'); });

  const xpGained = awardXP(gearModule.applyFoodXP(5), 'log food');
  const strBonus = gearModule.getMealStrengthBonus();
  if (strBonus) characterModule.data.strength = Math.min(999, (characterModule.data.strength || 0) + strBonus);

  // Clear form
  nameEl.value = ''; kcalEl.value = '';
  proteinEl.value = ''; carbsEl.value = ''; fatEl.value = '';

  const macroStr = entry.hasMacros
    ? ` P:${entry.protein}g C:${entry.carbs}g F:${entry.fat}g`
    : '';
  showToast(`🍽️ ${entry.name} ${entry.kcal} kcal${macroStr} +${xpGained.gained} XP`, 'success');
  renderFoodLog();
  renderMacroSummary();
  renderCalorieBar();
  renderHunger();
  renderGlance();
  saveGame();
}

function removeFoodLog(index) {
  hungerModule.removeCustomFood(index);
  renderFoodLog();
  renderMacroSummary();
  renderCalorieBar();
  renderGlance();
  saveGame();
}

const MEAL_LABELS = { breakfast: '🌅 เช้า', lunch: '☀️ กลางวัน', dinner: '🌙 เย็น', snack: '🍪 ว่าง' };

function renderFoodLog() {
  const listEl  = document.getElementById('food-log-list');
  const totalEl = document.getElementById('food-log-total');
  if (!listEl) return;

  const log   = hungerModule.getTodayFoodLog();
  const total = log.reduce((s, e) => s + e.kcal, 0);
  const goal  = characterModule.get('dailyCalorie') || 2000;

  if (totalEl) totalEl.textContent = `${total.toLocaleString()} / ${goal.toLocaleString()} kcal`;

  if (!log.length) {
    listEl.innerHTML = '<div class="food-log-empty">ยังไม่มีรายการ — บันทึกอาหารด้านบน</div>';
    return;
  }

  listEl.innerHTML = '';
  log.forEach((entry, i) => {
    const row = document.createElement('div');
    const pct      = Math.min(100, Math.round(entry.kcal / goal * 100));
    const barColor = pct > 30 ? '#ef4444' : pct > 15 ? '#f59e0b' : '#22c55e';

    const macroHtml = entry.hasMacros
      ? `<div class="flog-macros">
           <span class="flog-macro-p">P ${entry.protein}g</span> &nbsp;
           <span class="flog-macro-c">C ${entry.carbs}g</span> &nbsp;
           <span class="flog-macro-f">F ${entry.fat}g</span>
         </div>`
      : '';

    row.className = 'food-log-row' + (entry.hasMacros ? ' has-macros' : '');
    row.innerHTML = `
      <span class="flog-meal">${MEAL_LABELS[entry.mealType] || '🍽️'}</span>
      <span class="flog-name">${_escHtml(entry.name)}</span>
      <span class="flog-time">${entry.time}</span>
      <span class="flog-kcal" style="color:${barColor}">${entry.kcal} kcal</span>
      <button class="flog-del" onclick="removeFoodLog(${i})" title="ลบ">✕</button>
      ${macroHtml}
    `;
    listEl.appendChild(row);
  });
}

function renderMacroSummary() {
  const el = document.getElementById('macro-summary');
  if (!el) return;

  if (!hungerModule.hasMacroData()) { el.style.display = 'none'; return; }
  el.style.display = 'block';

  const totals  = hungerModule.getMacroTotals();
  const dailyCal = characterModule.get('dailyCalorie') || 2000;
  const bmiCat   = characterModule.get('categoryId') || 'normal';
  const targets  = hungerModule.getDailyMacroTargets(dailyCal, bmiCat);

  const set = (barId, valId, val, target) => {
    const pct = target > 0 ? Math.min(100, Math.round(val / target * 100)) : 0;
    const barEl = document.getElementById(barId);
    const valEl = document.getElementById(valId);
    if (barEl) barEl.style.width = pct + '%';
    if (valEl) valEl.textContent = `${val}/${target}g`;
  };

  set('bar-protein', 'val-protein', totals.protein, targets.protein);
  set('bar-carbs',   'val-carbs',   totals.carbs,   targets.carbs);
  set('bar-fat',     'val-fat',     totals.fat,     targets.fat);

  // Cross-check: macros → kcal estimate vs actual kcal logged
  const macroKcal = totals.protein * 4 + totals.carbs * 4 + totals.fat * 9;
  const actual    = hungerModule.caloriesEaten;
  const checkEl  = document.getElementById('macro-kcal-check');
  if (checkEl && macroKcal > 0) {
    const diff = Math.abs(macroKcal - actual);
    const icon = diff <= actual * 0.1 ? '✅' : diff <= actual * 0.25 ? '⚠️' : '❌';
    checkEl.textContent = `${icon} แมโครคำนวณได้ ${macroKcal} kcal (บันทึก ${actual} kcal)`;
  } else if (checkEl) {
    checkEl.textContent = '';
  }
}

// ═══════════════════════════════════════════
// MEAL SUGGESTION
// ═══════════════════════════════════════════
window._mealSuggestPicks = [];

function renderMealSuggest() {
  const el = document.getElementById('meal-suggest');
  if (!el) return;

  const eaten  = hungerModule.caloriesEaten || 0;
  const goal   = characterModule.get('dailyCalorie') || 2000;
  const remain = goal - eaten;

  if (remain < 100 || !window.FOOD_DB || !FOOD_DB.length) {
    el.style.display = 'none';
    return;
  }

  const macros  = hungerModule.macroTotals || { protein: 0, carbs: 0, fat: 0 };
  const targets = hungerModule.getDailyMacroTargets
    ? hungerModule.getDailyMacroTargets(goal, characterModule.get('categoryId') || 'normal')
    : { protein: 60, carbs: 250, fat: 55 };

  const pDef = Math.max(0, targets.protein - macros.protein);
  const cDef = Math.max(0, targets.carbs   - macros.carbs);
  const fDef = Math.max(0, targets.fat     - macros.fat);

  const ideal      = remain * 0.5;
  const candidates = FOOD_DB.filter(f => f.kcal > 0 && f.kcal <= remain * 0.95);
  if (!candidates.length) { el.style.display = 'none'; return; }

  const scored = candidates.map(f => {
    let score = 100 - Math.abs(f.kcal - ideal) / 12;
    if (pDef > 10 && (f.protein || 0) > 0) score += Math.min(25, (f.protein || 0));
    if (cDef > 20 && (f.carbs   || 0) > 0) score += Math.min(12, (f.carbs   || 0) * 0.25);
    if (fDef > 5  && (f.fat     || 0) > 0) score += Math.min(8,  (f.fat     || 0));
    return { food: f, score };
  });
  scored.sort((a, b) => b.score - a.score);
  window._mealSuggestPicks = scored.slice(0, 3).map(s => s.food);

  const picks = window._mealSuggestPicks;
  const reasons = [];
  if (pDef > 15) reasons.push(`โปรตีนยังขาด ~${Math.round(pDef)}g`);
  if (cDef > 30) reasons.push(`คาร์บยังขาด ~${Math.round(cDef)}g`);
  const hint = reasons.length ? ` · ${reasons.join(' · ')}` : '';

  el.style.display = 'block';
  el.innerHTML = `
    <div class="ms-card">
      <div class="ms-header">
        <span class="ms-title">🍽️ แนะนำมื้อถัดไป</span>
        <span class="ms-sub">เหลือ ${remain.toLocaleString()} kcal${hint}</span>
      </div>
      <div class="ms-list">
        ${picks.map((f, i) => `
          <div class="ms-item" onclick="fillFoodFromSuggest(${i})">
            <span class="ms-emoji">${f.emoji || '🍽️'}</span>
            <div class="ms-info">
              <span class="ms-name">${_escHtml(f.name)}</span>
              ${f.portion ? `<span class="ms-portion">${_escHtml(f.portion)}</span>` : ''}
            </div>
            <span class="ms-kcal">${f.kcal} kcal</span>
            <span class="ms-plus">+</span>
          </div>`).join('')}
      </div>
    </div>`;
}

function fillFoodFromSuggest(idx) {
  const f = window._mealSuggestPicks?.[idx];
  if (!f) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('food-log-name',    f.name);
  set('food-log-kcal',    f.kcal);
  set('food-log-protein', f.protein || '');
  set('food-log-carbs',   f.carbs   || '');
  set('food-log-fat',     f.fat     || '');
  document.getElementById('food-log-kcal')?.focus();
  document.getElementById('food-log-name')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function logWater() { addWater(250); }

function addWater(ml) {
  const waterBonus = gearModule.getWaterBonus();
  const totalMl    = ml + waterBonus * 250;
  waterModule.add(totalMl);
  hungerModule.waterDrank = waterModule.getGlasses();
  questModule.update('water_drank', Math.round(totalMl / 250));
  checkAchievements('water', {});
  const result = awardXP(Math.max(1, Math.round(totalMl / 125)), 'food');
  const mDone  = missionModule.onEvent('water', {});
  mDone.forEach(m => { const r = awardXP(m.xp, 'mission'); showToast(t('txt_mission_new', { xp: r.gained }), 'success'); });
  const goalBadge = waterModule.isGoalMet() ? ' 🎉 ครบเป้าแล้ว!' : '';
  showToast(`💧 +${totalMl}ml น้ำ • +${result.gained} XP${goalBadge}`, 'info');
  renderAll();
  saveGame();
}

// ═══════════════════════════════════════════
// PHASE 3: HISTORY — WEEKLY SUMMARY
// ═══════════════════════════════════════════
function renderWeeklySummary() {
  const sumEl = document.getElementById('week-summary-card');
  if (!sumEl) return;
  const s = historyModule.getWeeklySummary();
  if (!s) {
    document.getElementById('ws-avg-cal').textContent   = '—';
    document.getElementById('ws-avg-sleep').textContent = '—';
    document.getElementById('ws-total-ex').textContent  = '—';
    document.getElementById('ws-quest-days').textContent= '—';
    return;
  }
  document.getElementById('ws-avg-cal').textContent    = `${s.avgCalories.toLocaleString()} kcal`;
  document.getElementById('ws-avg-sleep').textContent  = `${s.avgSleep} ชม.`;
  document.getElementById('ws-total-ex').textContent   = `${s.totalExMin} นาที`;
  document.getElementById('ws-quest-days').textContent = `${s.questDays}/${s.days} วัน`;
}

// ═══════════════════════════════════════════
// PHASE 3: HISTORY — ANALYTICS CHART
// ═══════════════════════════════════════════
let _analyticsTab = 'calories';

function switchAnalyticsTab(btn, type) {
  document.querySelectorAll('.atab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _analyticsTab = type;
  renderAnalyticsChart();
}

function renderAnalyticsChart() {
  const container = document.getElementById('analytics-chart');
  if (!container) return;
  container.innerHTML = '';

  const days = historyModule.getRecent(7);
  if (!days.length) {
    container.innerHTML = `<div class="ac-empty">${t('no_history')}</div>`;
    return;
  }

  const type = _analyticsTab;

  // ── Macro stacked chart (separate render path) ──
  if (type === 'macro') {
    const hasAny = days.some(d => (d.macroProtein || 0) + (d.macroCarbs || 0) + (d.macroFat || 0) > 0);
    if (!hasAny) {
      container.innerHTML = `<div class="ac-empty">ยังไม่มีข้อมูลแมโคร — บันทึกอาหารพร้อมระบุ P/C/F</div>`;
      return;
    }
    const maxG = Math.max(...days.map(d => (d.macroProtein||0)+(d.macroCarbs||0)+(d.macroFat||0)), 150);
    days.forEach(day => {
      const p  = day.macroProtein || 0;
      const c  = day.macroCarbs   || 0;
      const f  = day.macroFat     || 0;
      const total = p + c + f;
      const barH  = 56; // fixed total height for the stack
      const pH = total > 0 ? Math.round((p / maxG) * barH) : 0;
      const cH = total > 0 ? Math.round((c / maxG) * barH) : 0;
      const fH = total > 0 ? Math.round((f / maxG) * barH) : 0;
      const mm = day.date.slice(5).replace('-', '/');
      const col = document.createElement('div');
      col.className = 'ac-col';
      col.innerHTML = `
        <div class="ac-macro-stack" style="height:${barH}px">
          ${f > 0 ? `<div class="acm-f" style="height:${fH}px" title="ไขมัน ${f}g"></div>` : ''}
          ${c > 0 ? `<div class="acm-c" style="height:${cH}px" title="คาร์บ ${c}g"></div>` : ''}
          ${p > 0 ? `<div class="acm-p" style="height:${pH}px" title="โปรตีน ${p}g"></div>` : ''}
        </div>
        <div class="ac-date">${mm}</div>`;
      container.appendChild(col);
    });
    // Legend row
    const leg = document.createElement('div');
    leg.className = 'ac-macro-legend';
    leg.innerHTML = `
      <span><span class="acm-dot" style="background:#38bdf8"></span>P โปรตีน</span>
      <span><span class="acm-dot" style="background:#fbbf24"></span>C คาร์บ</span>
      <span><span class="acm-dot" style="background:#f87171"></span>F ไขมัน</span>`;
    container.appendChild(leg);
    container.classList.remove('has-goal');
    return;
  }

  let vals, maxVal, getColor, getLabel, goalVal;

  if (type === 'calories') {
    vals     = days.map(d => d.caloriesEaten || 0);
    goalVal  = days[days.length - 1].calorieGoal;
    maxVal   = Math.max(...vals, goalVal || 1) * 1.1;
    getColor = (d) => {
      const ratio = (d.caloriesEaten || 0) / (d.calorieGoal || 2000);
      if (ratio <= 1.05) return '#4ade80';
      if (ratio <= 1.2)  return '#fbbf24';
      return '#f87171';
    };
    getLabel = (d) => d.caloriesEaten ? `${d.caloriesEaten}` : '0';
  } else if (type === 'sleep') {
    vals     = days.map(d => d.sleepHours || 0);
    maxVal   = Math.max(...vals, 9);
    getColor = (d) => {
      const h = d.sleepHours || 0;
      if (h >= 7 && h <= 9) return '#4ade80';
      if (h >= 5)            return '#fbbf24';
      return '#f87171';
    };
    getLabel = (d) => d.sleepHours ? `${d.sleepHours}h` : '—';
  } else {
    vals     = days.map(d => d.exerciseMin || 0);
    maxVal   = Math.max(...vals, 30);
    getColor = (d) => (d.exerciseMin || 0) > 0 ? '#4ade80' : 'var(--bg3)';
    getLabel = (d) => d.exerciseMin ? `${d.exerciseMin}m` : '0';
  }

  days.forEach(day => {
    const val   = type === 'calories' ? (day.caloriesEaten || 0) :
                  type === 'sleep'    ? (day.sleepHours || 0) :
                                        (day.exerciseMin || 0);
    const barH  = Math.round((val / maxVal) * 52) + 4;
    const color = getColor(day);
    const label = getLabel(day);
    const mm    = day.date.slice(5).replace('-', '/');

    const col = document.createElement('div');
    col.className = 'ac-col';
    col.innerHTML = `
      <div class="ac-val">${label}</div>
      <div class="ac-bar" style="height:${barH}px;background:${color}"></div>
      <div class="ac-date">${mm}</div>
    `;
    container.appendChild(col);
  });

  // Goal line indicator for calories
  if (type === 'calories' && goalVal) {
    const lineH = Math.round((goalVal / maxVal) * 52) + 4;
    container.style.setProperty('--goal-h', lineH + 'px');
    container.classList.add('has-goal');
  } else {
    container.classList.remove('has-goal');
  }
}

// ═══════════════════════════════════════════
// PHASE 2: ACHIEVEMENT SYSTEM
// ═══════════════════════════════════════════
let _achChecking = false;
function checkAchievements(triggerType, ctx) {
  if (_achChecking) return [];
  _achChecking = true;
  const newly = achievementModule.check(triggerType, ctx || {});
  _achChecking = false;
  newly.forEach((ach, i) => {
    const name = currentLang === 'en' ? ach.name_en : ach.name_th;
    setTimeout(() => {
      showToast(`🏆 ${name}! +${ach.xp} XP`, 'success');
      // Award XP directly to avoid recursive check
      const r = characterModule.addExp(ach.xp);
      window._xpBalance = (window._xpBalance || 0) + ach.xp;
      renderHUD();
      if (r.levelUp) setTimeout(showLevelUp, 300);
      saveGame();
    }, (i + 1) * 1100);
  });
  return newly;
}

let _achFilter = 'all';
function filterAchievements(btn, filter) {
  document.querySelectorAll('#ach-filter-bar .cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _achFilter = filter;
  renderAchievements();
}

function renderAchievements() {
  const grid    = document.getElementById('achievement-grid');
  const countEl = document.getElementById('achievement-count');
  if (!grid) return;

  const all      = achievementModule.getAll();
  const unlocked = achievementModule.unlocked;
  const total    = all.length;
  const done     = achievementModule.getCount();
  countEl.textContent = `${done}/${total}`;

  let items = all;
  if (_achFilter === 'unlocked') items = all.filter(a => unlocked[a.id]);
  if (_achFilter === 'locked')   items = all.filter(a => !unlocked[a.id]);

  grid.innerHTML = '';
  items.forEach(ach => {
    const isUnlocked = !!unlocked[ach.id];
    const name = currentLang === 'en' ? ach.name_en : ach.name_th;
    const desc = currentLang === 'en' ? ach.desc_en : ach.desc_th;

    const card = document.createElement('div');
    card.className = 'ach-card ' + (isUnlocked ? 'unlocked' : 'locked');

    const dateStr = isUnlocked && unlocked[ach.id]
      ? unlocked[ach.id].slice(0, 10) : '';

    card.innerHTML = `
      <div class="ach-icon">${ach.icon}</div>
      <div class="ach-name">${name}</div>
      <div class="ach-desc">${isUnlocked ? desc : '???'}</div>
      <div class="ach-xp">+${ach.xp} XP</div>
      ${dateStr ? `<div class="ach-date">${dateStr}</div>` : ''}
    `;
    grid.appendChild(card);
  });
}

// ═══════════════════════════════════════════
// PHASE 2: WEIGHT TRACKING
// ═══════════════════════════════════════════
function showWeightModal() {
  const latest = weightModule.getLatest();
  const input  = document.getElementById('weight-log-input');
  input.value  = latest ? latest.weight : characterModule.get('weightKg');
  document.getElementById('weight-modal').style.display = 'flex';
}

function closeWeightModal() {
  document.getElementById('weight-modal').style.display = 'none';
}

function confirmLogWeight() {
  const w = parseFloat(document.getElementById('weight-log-input').value);
  if (isNaN(w) || w < 20 || w > 200) {
    showToast('⚠️ น้ำหนักต้องอยู่ระหว่าง 20-200 kg', 'error');
    return;
  }

  const result = weightModule.logWeight(w);

  // Sync characterModule with new weight & BMI
  characterModule.data.weightKg    = w;
  characterModule.data.bmi         = result.bmi;
  characterModule.data.categoryId  = bmiModule.getCategory(result.bmi).id;
  characterModule.data.dailyCalorie = bmiModule.calculateDailyCalorie(
    characterModule.get('age'),
    characterModule.get('heightCm'),
    w,
    characterModule.get('gender'),
    characterModule.get('activity')
  );

  const change = weightModule.getChange();
  const arrow  = change < -0.05 ? '↓' : change > 0.05 ? '↑' : '→';
  const bmiLabel = bmiModule.getCategoryLabel(result.bmi);
  checkAchievements('weight', { change });
  // Phase 8: mission progress
  const mDoneW = missionModule.onEvent('weight', {});
  mDoneW.forEach(m => { const r = awardXP(m.xp, 'mission'); showToast(t('txt_mission_new', { xp: r.gained }), 'success'); });

  closeWeightModal();
  showToast(t('weight_logged', { w, bmi: result.bmi, arrow }) + ` (${bmiLabel})`, 'success');
  renderAll();
  saveGame();
}

// ══════════════════════════════════════════════
// WATER TRACKER
// ══════════════════════════════════════════════
function renderWaterTracker() {
  const el = document.getElementById('water-tracker');
  if (!el) return;
  const ml   = waterModule.getMl();
  const goal = waterModule.getGoalMl();
  const pct  = waterModule.getPct();
  const glasses    = waterModule.getGlasses();
  const goalGlasses= waterModule.getGoalGlasses();
  const done = waterModule.isGoalMet();

  el.innerHTML = `
    <div class="wt2-card">
      <div class="wt2-header">
        <span class="wt2-title">💧 น้ำดื่มวันนี้</span>
        <span class="wt2-count ${done ? 'wt2-done' : ''}">${glasses}/${goalGlasses} แก้ว ${done ? '✅' : ''}</span>
      </div>
      <div class="wt2-bar-wrap">
        <div class="wt2-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="wt2-ml">${ml.toLocaleString()} / ${goal.toLocaleString()} ml</div>
      <div class="wt2-btns">
        <button class="wt2-btn" onclick="addWater(150)">🥤 +150ml<br><small>แก้วเล็ก</small></button>
        <button class="wt2-btn wt2-btn-main" onclick="addWater(250)">🥛 +250ml<br><small>1 แก้ว</small></button>
        <button class="wt2-btn" onclick="addWater(500)">🍶 +500ml<br><small>ขวดเล็ก</small></button>
        <button class="wt2-btn" onclick="addWater(1000)">🍾 +1L<br><small>ขวดใหญ่</small></button>
        <button class="wt2-btn wt2-btn-goal" onclick="showWaterGoalModal()">⚙️<br><small>เป้าหมาย</small></button>
      </div>
    </div>`;
}

function showWaterGoalModal() {
  const cur = waterModule.getGoalMl();
  const val = prompt(`ตั้งเป้าหมายน้ำ (ml/วัน)\nค่าปัจจุบัน: ${cur} ml\nแนะนำ: 2000 ml (8 แก้ว)`, cur);
  if (!val) return;
  const ml = parseInt(val);
  if (isNaN(ml) || ml < 500 || ml > 5000) { showToast('กรุณากรอก 500–5000 ml', 'error'); return; }
  waterModule.setGoal(ml);
  showToast(`💧 ตั้งเป้าน้ำ ${ml.toLocaleString()} ml/วัน แล้ว`, 'success');
  renderAll();
  saveGame();
}

// ══════════════════════════════════════════════
// WEIGHT GOAL
// ══════════════════════════════════════════════
function renderWeightGoal() {
  const el = document.getElementById('weight-goal-section');
  if (!el) return;
  const goal    = weightModule.goalWeight;
  const latest  = weightModule.getLatest()?.weight ?? characterModule.get('weightKg');
  const start   = weightModule.startWeight || latest;
  const pct     = weightModule.getGoalProgress();
  const days    = weightModule.getEstimatedDays();
  const losing  = goal !== null && goal < start;

  if (goal === null) {
    el.innerHTML = `
      <div class="wg-card wg-empty">
        <div class="wg-empty-text">🎯 ยังไม่ได้ตั้งเป้าหมายน้ำหนัก</div>
        <button class="wg-set-btn" onclick="showWeightGoalModal()">ตั้งเป้าหมาย</button>
      </div>`;
    return;
  }

  const done    = pct >= 100;
  const changed = Math.abs(latest - start);
  const remain  = Math.abs(goal - latest);
  const dir     = losing ? 'ลด' : 'เพิ่ม';

  el.innerHTML = `
    <div class="wg-card">
      <div class="wg-header">
        <span class="wg-title">🎯 เป้าหมายน้ำหนัก</span>
        <button class="wg-edit-btn" onclick="showWeightGoalModal()">เปลี่ยน</button>
      </div>
      <div class="wg-route">
        <span class="wg-num">${start} kg</span>
        <span class="wg-arrow">→</span>
        <span class="wg-num wg-goal-num">${goal} kg</span>
      </div>
      <div class="wg-bar-wrap">
        <div class="wg-bar-fill ${done ? 'wg-done' : ''}" style="width:${pct}%"></div>
      </div>
      <div class="wg-stats">
        <span>${dir}แล้ว <b>${changed.toFixed(1)} kg</b></span>
        <span class="wg-pct">${pct}%</span>
        <span>ต้อง${dir}อีก <b>${remain.toFixed(1)} kg</b></span>
      </div>
      ${done
        ? '<div class="wg-congrats">🎉 ถึงเป้าหมายแล้ว! ยอดเยี่ยมมาก</div>'
        : days !== null
          ? `<div class="wg-eta">⏳ คาดถึงเป้า ~<b>${days} วัน</b> (ที่อัตราปัจจุบัน)</div>`
          : '<div class="wg-eta">ชั่งน้ำหนักอย่างน้อย 2 วัน เพื่อคาดการณ์</div>'}
    </div>`;
}

function showWeightGoalModal() {
  const cur = weightModule.goalWeight ?? '';
  const latest = weightModule.getLatest()?.weight ?? characterModule.get('weightKg');
  const val = prompt(`ตั้งเป้าหมายน้ำหนัก (kg)\nน้ำหนักปัจจุบัน: ${latest} kg\n\nกรอก 0 เพื่อลบเป้าหมาย`, cur);
  if (val === null) return;
  const kg = parseFloat(val);
  if (isNaN(kg) || (kg !== 0 && (kg < 20 || kg > 300))) { showToast('กรุณากรอกน้ำหนักที่ถูกต้อง (20–300 kg)', 'error'); return; }
  weightModule.setGoal(kg === 0 ? null : kg);
  showToast(kg === 0 ? '🎯 ลบเป้าหมายแล้ว' : `🎯 ตั้งเป้า ${kg} kg แล้ว`, 'success');
  renderAll();
  saveGame();
}

function renderWeightSection() {
  const chart    = document.getElementById('weight-chart');
  if (!chart) return;

  const latest   = weightModule.getLatest();
  const change   = weightModule.getChange();
  const trend    = weightModule.getTrend();
  const trendIcon  = trend === 'losing' ? '↓' : trend === 'gaining' ? '↑' : '→';
  const trendColor = trend === 'losing' ? 'var(--success)' : trend === 'gaining' ? 'var(--danger)' : 'var(--text3)';

  const curEl = document.getElementById('weight-current');
  const stEl  = document.getElementById('weight-start');
  const chEl  = document.getElementById('weight-change');
  const trEl  = document.getElementById('weight-trend');
  if (!curEl) return;

  curEl.textContent = latest ? `${latest.weight} kg` : `${characterModule.get('weightKg')} kg`;
  stEl.textContent  = weightModule.startWeight ? `${weightModule.startWeight} kg` : '—';

  chEl.textContent  = latest && weightModule.startWeight
    ? `${change >= 0 ? '+' : ''}${change} kg` : '—';
  chEl.style.color  = change < -0.05 ? 'var(--success)' : change > 0.05 ? 'var(--danger)' : 'var(--text)';

  trEl.textContent  = latest ? trendIcon : '—';
  trEl.style.color  = trendColor;

  // Mini bar chart (7 days)
  chart.innerHTML = '';
  const recent = weightModule.getRecent(7);
  if (recent.length < 1) { chart.style.display = 'none'; return; }
  chart.style.display = 'flex';

  const weights = recent.map(l => l.weight);
  const minW    = Math.min(...weights);
  const maxW    = Math.max(...weights);
  const range   = maxW - minW || 0.01;

  recent.forEach(log => {
    const barH = Math.round(((log.weight - minW) / range) * 44 + 12);
    const mm   = log.date.slice(5).replace('-', '/');
    const col  = document.createElement('div');
    col.className = 'wc-col';
    col.innerHTML = `
      <div class="wc-weight">${log.weight}</div>
      <div class="wc-bar" style="height:${barH}px"></div>
      <div class="wc-date">${mm}</div>
    `;
    chart.appendChild(col);
  });
}

// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// NOTIFICATION REMINDERS
// ═══════════════════════════════════════════

const NOTIF_META = {
  breakfast: { label: '🌅 มื้อเช้า',        type: 'time' },
  lunch:     { label: '☀️ มื้อกลางวัน',    type: 'time' },
  dinner:    { label: '🌙 มื้อเย็น',        type: 'time' },
  exercise:  { label: '🏃 ออกกำลังกาย',    type: 'time' },
  water:     { label: '💧 ดื่มน้ำ',      type: 'interval', unit: 'นาที' },
  sleep:     { label: '😴 เวลานอน',      type: 'time' },
  weight:    { label: '⚖️ ชั่งน้ำหนัก',  type: 'time' },
};

function renderNotifSettings() {
  const badge   = document.getElementById('notif-permission-badge');
  const hint    = document.getElementById('notif-permission-hint');
  const master  = document.getElementById('notif-master-toggle');
  const listEl  = document.getElementById('notif-list');
  if (!listEl) return;

  const perm    = notificationModule.getPermission();
  const enabled = notificationModule.settings.enabled;

  // Permission badge
  if (badge) {
    const labelMap = { granted: 'อนุญาตแล้ว', denied: 'ถูกบล็อก', default: 'ยังไม่ได้เปิด', unsupported: 'ไม่รองรับ' };
    badge.textContent = labelMap[perm] || perm;
    badge.className   = `notif-permission-badge ${perm}`;
  }

  // Hint text
  if (hint) {
    if (perm === 'denied')
      hint.textContent = '⚠️ กรุณาเปิดอนุญาตในการตั้งค่าเบราว์เซอร์';
    else if (perm === 'default')
      hint.textContent = 'เปิดสวิตช์เพื่อขออนุญาตแจ้งเตือน';
    else if (perm === 'granted' && enabled)
      hint.textContent = '✅ การแจ้งเตือนทำงานขณะแท็บเปิดอยู่';
    else
      hint.textContent = '';
  }

  // Master toggle
  if (master) master.checked = enabled;

  // Reminder items
  listEl.innerHTML = '';
  const reminders = notificationModule.settings.reminders;
  Object.entries(NOTIF_META).forEach(([key, meta]) => {
    const rem = reminders[key];
    if (!rem) return;

    const isTime = meta.type === 'time';
    const nextLabel = enabled && rem.on ? notificationModule.getNextFireLabel(key) : '';

    const item = document.createElement('div');
    item.className = 'notif-item';

    const inputHtml = isTime
      ? `<input type="time" class="notif-time-input" value="${rem.time}"
           ${!enabled ? 'disabled' : ''}
           onchange="setNotifReminder('${key}', 'time', this.value)">`
      : `<input type="number" class="notif-time-input notif-interval-input"
           value="${rem.interval || 120}" min="30" max="480"
           ${!enabled ? 'disabled' : ''}
           onchange="setNotifReminder('${key}', 'interval', +this.value)"> <span style="font-size:10px;color:var(--text-dim)">${meta.unit}</span>`;

    item.innerHTML = `
      <div class="notif-item-left">
        <div class="notif-item-title">${meta.label}</div>
        ${nextLabel ? `<div class="notif-item-meta">${nextLabel}</div>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:5px">
        ${inputHtml}
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        <button class="notif-test-btn" onclick="testNotif('${key}')"
          ${perm !== 'granted' ? 'disabled' : ''}>ทดสอบ</button>
        <label class="toggle-switch">
          <input type="checkbox" ${rem.on ? 'checked' : ''} ${!enabled ? 'disabled' : ''}
            onchange="setNotifReminder('${key}', 'on', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>
    `;
    listEl.appendChild(item);
  });
}

async function setNotifEnabled(checked) {
  if (checked) {
    const perm = await notificationModule.requestPermission();
    if (perm !== 'granted') {
      document.getElementById('notif-master-toggle').checked = false;
      showToast('⚠️ กรุณาอนุญาตการแจ้งเตือนในเบราว์เซอร์', 'error');
      renderNotifSettings();
      return;
    }
  }
  notificationModule.setEnabled(checked);
  showToast(checked ? '🔔 เปิดการแจ้งเตือนแล้ว' : '🔕 ปิดการแจ้งเตือนแล้ว', 'info');
  renderNotifSettings();
}

function setNotifReminder(key, field, value) {
  notificationModule.setReminder(key, { [field]: value });
  renderNotifSettings();
}

function testNotif(key) {
  const perm = notificationModule.getPermission();
  if (perm !== 'granted') {
    showToast('⚠️ ต้องอนุญาตการแจ้งเตือนก่อน', 'error');
    return;
  }
  notificationModule.sendTest(key);
  showToast('🔔 ส่งการแจ้งเตือนทดสอบแล้ว', 'info');
}

// PHASE 1.5: WARDROBE
// ═══════════════════════════════════════════
function renderWardrobe() {
  const equippedEl = document.getElementById('equipped-items');
  const ownedEl    = document.getElementById('owned-items');
  if (!equippedEl || !ownedEl) return;

  const cosmetics    = characterModule.get('cosmetics');
  const allCosmetics = xpModule.getAllItems('cosmetics');

  // Equipped chips
  const slotDefs = [
    { key: 'color',     fallback: '🎨 —' },
    { key: 'aura',      fallback: '✨ —' },
    { key: 'accessory', fallback: '🪄 —' },
    { key: 'pet',       fallback: '🐾 —' },
  ];
  equippedEl.innerHTML = '';
  slotDefs.forEach(({ key, fallback }) => {
    const val  = cosmetics[key];
    const item = val ? allCosmetics.find(i => i.effect_type === key && i.value === val) : null;
    const chip = document.createElement('span');
    chip.className   = 'equipped-chip';
    chip.textContent = item ? `${item.icon} ${xpModule.getItemName(item)}` : fallback;
    equippedEl.appendChild(chip);
  });

  // Owned items grid
  const owned = allCosmetics.filter(item => xpModule.owns(item.id));
  ownedEl.innerHTML = '';
  if (owned.length === 0) {
    ownedEl.innerHTML = `<div style="color:var(--text2);font-size:12px;padding:10px 0;text-align:center;grid-column:1/-1">${t('wardrobe_empty')}</div>`;
    return;
  }
  owned.forEach(item => {
    const isEquipped = cosmetics[item.effect_type] === item.value;
    const card = document.createElement('div');
    card.className = 'wardrobe-item' + (isEquipped ? ' equipped' : '');
    card.onclick = () => {
      xpModule.applyItem(item.id);
      renderWardrobe();
      renderCharacter();
      saveGame();
      showToast(`${item.icon} ${xpModule.getItemName(item)} ใส่แล้ว!`, 'success');
    };
    card.innerHTML = `
      <div class="witem-icon">${item.icon}</div>
      <div class="witem-name">${xpModule.getItemName(item)}</div>
      ${isEquipped ? '<div class="witem-active">✓</div>' : ''}
    `;
    ownedEl.appendChild(card);
  });
}
