// modules/streakModule.js — Daily streak tracking & milestones

const STREAK_MILESTONES = [
  { days:7,   badge:'🔥', xp:100,  key:'7' },
  { days:14,  badge:'🌟', xp:200,  key:'14' },
  { days:30,  badge:'💪', xp:500,  key:'30' },
  { days:100, badge:'🏆', xp:2000, key:'100' },
  { days:365, badge:'👑', xp:10000,key:'365' },
];

class StreakModule {
  constructor() {
    this.currentStreak = 0;
    this.longestStreak = 0;
    this.lastActiveDate = '';
    this.claimedMilestones = [];
    this.totalDaysPlayed = 0;
  }

  _dateKey(d = new Date()) {
    return window._localDate(d);
  }

  // Call once per session on load
  checkIn(questsCompleted) {
    const today = this._dateKey();
    const yesterday = this._dateKey(new Date(Date.now() - 86400000));

    if (this.lastActiveDate === today) return { alreadyCheckedIn: true };

    let streakBroke = false;
    if (this.lastActiveDate === yesterday) {
      // Consecutive day — streak only counts if 2+ quests done
      if (questsCompleted >= 2) this.currentStreak++;
      else { this.currentStreak = 0; streakBroke = true; }
    } else if (this.lastActiveDate !== '') {
      // Missed a day
      this.currentStreak = questsCompleted >= 2 ? 1 : 0;
      streakBroke = true;
    } else {
      // First ever check-in
      this.currentStreak = 1;
    }

    this.lastActiveDate = today;
    this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
    this.totalDaysPlayed++;

    const milestone = this._checkMilestone();
    return { newStreak: this.currentStreak, milestone, streakBroke };
  }

  _checkMilestone() {
    for (const m of STREAK_MILESTONES) {
      if (this.currentStreak >= m.days && !this.claimedMilestones.includes(m.key)) {
        this.claimedMilestones.push(m.key);
        return m;
      }
    }
    return null;
  }

  getBonus() {
    // Streak XP bonus: 10 per day capped at 100
    return Math.min(100, this.currentStreak * 10);
  }

  getBadge() {
    for (const m of [...STREAK_MILESTONES].reverse()) {
      if (this.currentStreak >= m.days) return m.badge;
    }
    return '';
  }

  // Used when user buys streak_recover from shop
  restoreStreak() {
    this.currentStreak = Math.max(1, this.currentStreak + 1);
    this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
  }

  toJSON() {
    return {
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      lastActiveDate: this.lastActiveDate,
      claimedMilestones: this.claimedMilestones,
      totalDaysPlayed: this.totalDaysPlayed,
    };
  }

  fromJSON(d) {
    this.currentStreak    = d.currentStreak    || 0;
    this.longestStreak    = d.longestStreak    || 0;
    this.lastActiveDate   = d.lastActiveDate   || '';
    this.claimedMilestones= d.claimedMilestones|| [];
    this.totalDaysPlayed  = d.totalDaysPlayed  || 0;
  }
}

window.streakModule = new StreakModule();
