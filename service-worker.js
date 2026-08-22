
const CACHE_NAME = "mission-english-home-v1.5.9-practice-sequence-corrected-20260820";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./icon.svg", "./mission-english-home-logo.png", "./mission-english-home-icon-512.png", "./mission-english-home-icon-192.png", "./manifest.webmanifest", "./images/mission6/black.svg", "./images/mission6/blue.svg", "./images/mission6/brown.svg", "./images/mission6/gray.svg", "./images/mission6/green.svg", "./images/mission6/orange.svg", "./images/mission6/pink.svg", "./images/mission6/purple.svg", "./images/mission6/red.svg", "./images/mission6/white.svg", "./images/mission6/yellow.svg", "./images/mission7/balloons-2.svg", "./images/mission7/balloons-3.svg", "./images/mission7/balloons-4.svg", "./images/mission7/balloons-6.svg", "./images/mission7/number-10.svg", "./images/mission7/number-4.svg", "./images/mission7/number-5.svg", "./images/mission7/number-8.svg", "./images/mission7/six-stars.svg", "./images/mission7/stars-5.svg", "./images/mission7/stars-6.svg", "./images/mission7/stars-7.svg", "./images/mission7/stars-9.svg", "./images/mission7/three-balloons.svg", "./images/mission8/cloudy.svg", "./images/mission8/cold.svg", "./images/mission8/cool.svg", "./images/mission8/hot.svg", "./images/mission8/rainy.svg", "./images/mission8/snowy.svg", "./images/mission8/stormy.svg", "./images/mission8/sunny.svg", "./images/mission8/warm.svg", "./images/mission8/windy.svg", "./images/home/landing-cloud-left.png", "./images/home/landing-cloud-right.png", "./images/home/landing-trees-left.png", "./images/home/landing-trees-right.png", "./images/greetings/good-morning.svg", "./images/greetings/good-afternoon.svg", "./images/greetings/good-evening.svg", "./images/greetings/good-night.svg", "./images/approved/home-landing-approved.jpg", "./images/approved/good-morning.jpg", "./images/approved/good-afternoon.jpg", "./images/approved/good-evening.jpg", "./images/approved/good-night.jpg"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match("./index.html")))
  );
});
