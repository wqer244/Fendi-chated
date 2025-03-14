// اسم الكاش
const CACHE_NAME = "offline-cache-v2";

// الملفات التي سيتم تخزينها في الكاش لتعمل بدون إنترنت
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/chat.html",
    "/store.html",
    "/what.html",
    "/posts.html",
    "/fndchat.png",
    "/styles.css",   // إن كان هناك ملف CSS
    "/script.js",    // إن كان هناك ملف JavaScript
    "/offline.html"  // صفحة مخصصة عند انقطاع الإنترنت
];

// 📌 تثبيت Service Worker وتخزين الملفات في الكاش
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("📥 يتم تخزين الملفات...");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// 📌 تفعيل Service Worker وتنظيف الكاش القديم
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("🗑️ حذف الكاش القديم:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 📌 اعتراض الطلبات وإرجاع الملفات من الكاش عند عدم توفر الإنترنت
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => caches.match("/offline.html"));
        })
    );
});
