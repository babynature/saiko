// sw.js — Service Worker (Phase 11c)
const CACHE = 'shg-v11k';
const ASSETS = [
  '/', '/index.html', '/styles.css', '/i18n.js', '/app.js',
  '/firebase-config.js',
  '/modules/bmiModule.js', '/modules/characterModule.js',
  '/modules/hungerModule.js', '/modules/marketplaceModule.js',
  '/modules/questModule.js', '/modules/xpModule.js',
  '/modules/streakModule.js', '/modules/sleepModule.js',
  '/modules/stressModule.js', '/modules/weightModule.js',
  '/modules/achievementModule.js', '/modules/historyModule.js',
  '/modules/intelligenceModule.js', '/modules/firebaseModule.js',
  '/modules/missionModule.js', '/modules/gearModule.js', '/modules/notificationModule.js',
  '/modules/barcodeModule.js', '/modules/waterModule.js',
  '/modules/shareModule.js', '/modules/customFoodModule.js', '/modules/nutritionGuideModule.js',
  '/data/foodDatabase.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Bring app to focus when notification is clicked
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});

// Network-first for Firebase CDN, cache-first for local
self.addEventListener('fetch', e => {
  if (e.request.url.includes('firebasejs') || e.request.url.includes('googleapis')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
