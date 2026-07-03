// modules/firebaseModule.js — Firebase Auth + Cloud Save + Leaderboard (Phase 6)
// Requires: firebase-config.js loaded first, Firebase SDK CDN scripts

class FirebaseModule {
  constructor() {
    this.app      = null;
    this.auth     = null;
    this.db       = null;
    this.user     = null;
    this._ready   = false;
    this._syncTimer = null;
  }

  // Returns true if Firebase SDK + config are available
  isAvailable() {
    return typeof firebase !== 'undefined' && window.FIREBASE_ENABLED === true;
  }

  init(onAuthChange) {
    if (!this.isAvailable()) return false;
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      this.auth = firebase.auth();
      this.db   = firebase.firestore();
      this._ready = true;

      this.auth.onAuthStateChanged((user) => {
        this.user = user;
        if (onAuthChange) onAuthChange(user);
      });
      return true;
    } catch (e) {
      console.warn('[Firebase] init failed:', e.message);
      return false;
    }
  }

  isLoggedIn() { return !!this.user; }

  async signInWithGoogle() {
    if (!this._ready) return { success: false, error: 'Firebase not ready' };
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result   = await this.auth.signInWithPopup(provider);
      this.user = result.user;
      return { success: true, user: result.user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async signOut() {
    if (!this._ready) return;
    await this.auth.signOut();
    this.user = null;
  }

  // ─── CLOUD SAVE ───────────────────────────────────────────
  async syncToCloud(stateJSON) {
    if (!this._ready || !this.user) return false;
    try {
      const ref = this.db.collection('saves').doc(this.user.uid);
      await ref.set({
        data:      stateJSON,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        name:      this.user.displayName || '',
        email:     this.user.email || '',
      });
      return true;
    } catch (e) {
      console.warn('[Firebase] sync failed:', e.message);
      return false;
    }
  }

  // Debounced sync — avoid flooding on rapid saves
  scheduleSyncToCloud(stateJSON) {
    if (!this._ready || !this.user) return;
    clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this.syncToCloud(stateJSON), 3000);
  }

  async loadFromCloud() {
    if (!this._ready || !this.user) return null;
    try {
      const ref  = this.db.collection('saves').doc(this.user.uid);
      const snap = await ref.get();
      if (snap.exists) return snap.data().data;
      return null;
    } catch (e) {
      console.warn('[Firebase] load failed:', e.message);
      return null;
    }
  }

  // ─── LEADERBOARD ──────────────────────────────────────────
  // Stores public entry: name, level, streak, achievements
  async updateLeaderboard(entry) {
    if (!this._ready || !this.user) return false;
    try {
      const ref = this.db.collection('leaderboard').doc(this.user.uid);
      await ref.set({
        ...entry,
        uid:       this.user.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      return true;
    } catch (e) {
      console.warn('[Firebase] leaderboard update failed:', e.message);
      return false;
    }
  }

  async getLeaderboard(limit = 10) {
    if (!this._ready) return [];
    try {
      const snap = await this.db.collection('leaderboard')
        .orderBy('level', 'desc')
        .orderBy('streak', 'desc')
        .limit(limit)
        .get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firebase] leaderboard fetch failed:', e.message);
      return [];
    }
  }

  getUserDisplayName() {
    if (!this.user) return null;
    return this.user.displayName || this.user.email?.split('@')[0] || 'ผู้เล่น';
  }

  getUserPhotoURL() {
    return this.user?.photoURL || null;
  }
}

window.firebaseModule = new FirebaseModule();
