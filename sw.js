const CACHE = 'sb-shell-v5';
const SHELL = ['./', './index.html', './manifest.webmanifest', './lume-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('secondbrain-v1', 2);
    r.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('items')) d.createObjectStore('items', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('areas')) d.createObjectStore('areas', { keyPath: 'n' });
      if (!d.objectStoreNames.contains('tags')) d.createObjectStore('tags', { keyPath: 'n' });
      if (!d.objectStoreNames.contains('pending')) d.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

async function savePending(o) {
  const db = await idb();
  return new Promise((res, rej) => {
    const t = db.transaction('pending', 'readwrite');
    t.objectStore('pending').add(o);
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  });
}

async function handleShare(req) {
  try {
    const f = await req.formData();
    const files = f.getAll('files').filter(x => x && x.size);
    await savePending({
      title: f.get('title') || '',
      text: f.get('text') || '',
      url: f.get('url') || '',
      file: files[0] || null,
      at: Date.now()
    });
  } catch (err) {
    // se qualcosa va storto apriamo comunque l'app
  }
  return Response.redirect('./?share=1', 303);
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method === 'POST' && url.pathname.endsWith('/share')) {
    e.respondWith(handleShare(e.request));
    return;
  }
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
