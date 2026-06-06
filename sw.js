const CACHE = 'qithmiao-v4';
const CORE = [
  './', 'index.html', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'dict/words.json'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isHTML = req.mode === 'navigate' || req.destination === 'document'
    || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  if (isHTML) {
    // network-first：保证应用更新能下发，离线时回退缓存
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('index.html', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('index.html').then((h) => h || caches.match('./')))
    );
    return;
  }
  // 静态资源（字体/图标/CDN）：缓存优先
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      try {
        const cacheable = res.ok && (url.origin === location.origin || /gstatic|jsdelivr|googleapis/.test(url.host));
        if (cacheable) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      } catch (_) {}
      return res;
    }).catch(() => Response.error()))
  );
});
