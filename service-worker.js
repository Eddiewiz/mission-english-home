
const CACHE_NAME = "mission-english-home-v1.6.10-mobile-hotfix-20260828";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./icon.svg", "./mission-english-home-logo.png", "./mission-english-home-icon-512.png", "./mission-english-home-icon-192.png", "./manifest.webmanifest", "./images/mission6/black.svg", "./images/mission6/blue.svg", "./images/mission6/brown.svg", "./images/mission6/gray.svg", "./images/mission6/green.svg", "./images/mission6/orange.svg", "./images/mission6/pink.svg", "./images/mission6/purple.svg", "./images/mission6/red.svg", "./images/mission6/white.svg", "./images/mission6/yellow.svg", "./images/mission7/balloons-2.svg", "./images/mission7/balloons-3.svg", "./images/mission7/balloons-4.svg", "./images/mission7/balloons-6.svg", "./images/mission7/number-10.svg", "./images/mission7/number-4.svg", "./images/mission7/number-5.svg", "./images/mission7/number-8.svg", "./images/mission7/six-stars.svg", "./images/mission7/stars-5.svg", "./images/mission7/stars-6.svg", "./images/mission7/stars-7.svg", "./images/mission7/stars-9.svg", "./images/mission7/three-balloons.svg", "./images/mission8/cloudy.svg", "./images/mission8/cold.svg", "./images/mission8/cool.svg", "./images/mission8/hot.svg", "./images/mission8/rainy.svg", "./images/mission8/snowy.svg", "./images/mission8/stormy.svg", "./images/mission8/sunny.svg", "./images/mission8/warm.svg", "./images/mission8/windy.svg", "./images/home/landing-cloud-left.png", "./images/home/landing-cloud-right.png", "./images/home/landing-trees-left.png", "./images/home/landing-trees-right.png", "./images/greetings/good-morning.svg", "./images/greetings/good-afternoon.svg", "./images/greetings/good-evening.svg", "./images/greetings/good-night.svg", "./images/approved/home-landing-approved.jpg", "./images/approved/good-morning.jpg", "./images/approved/good-afternoon.jpg", "./images/approved/good-evening.jpg", "./images/approved/good-night.jpg", "./images/home-missions/good-evening-sunset.svg", "./images/home-missions/good-morning-sunrise.svg", "./images/home-missions/m1-date.svg", "./images/home-missions/m1-date-grade6.svg", "./images/home-missions/m2-greetings.svg", "./images/home-missions/m2-greetings-grade6.svg", "./images/home-missions/m3-classroom.svg", "./images/home-missions/m3-classroom-grade6.svg", "./images/home-missions/m4-permission.svg", "./images/home-missions/m4-permission-grade6.svg", "./images/home-missions/m5-review.svg", "./images/home-missions/m5-review-grade6.svg", "./images/ui/headphones.svg",
  "./images/ui/megaphone.svg",
  "./images/ui/target.svg",
  "./images/ui/video.svg",
  "./images/ui/kahoot.svg",
  "./images/ui/rocket.svg", "./images/ui/home-tab-house.png",
  "./images/home-missions/m6-colors-card.svg",
  "./images/home-missions/m7-numbers-card.svg",
  "./images/home-missions/m8-weather-card.svg",
  "./images/home-missions/m9-numbers-card.svg",
  "./images/home-missions/m10-review-card.svg",
  "./images/home-missions/approved-cards/m1-date.jpg",
  "./images/home-missions/approved-cards/m2-greetings.jpg", "./images/home-missions/approved-cards/m2-greetings-grade6.jpg",
  "./images/home-missions/approved-cards/m3-classroom.jpg",
  "./images/home-missions/approved-cards/m4-permission.jpg",
  "./images/home-missions/approved-cards/m5-review.jpg",
  "./images/home-missions/approved-cards/m6-colors.jpg",
  "./images/home-missions/approved-cards/m7-numbers.jpg",
  "./images/home-missions/approved-cards/m8-weather.jpg",
  "./images/home-missions/approved-cards/m9-numbers.jpg",
  "./images/home-missions/approved-cards/m10-review.jpg",
  "./images/home-missions/approved-cards/future-locked.jpg",
  "./images/ui/default-avatar.png",
  "./images/approved/good-morning-final.jpg",
  "./images/approved/good-afternoon-final.jpg",
  "./images/approved/good-evening-final.jpg",
  "./images/approved/good-night-final.jpg",
  "./Cloudy.mp4",
  "./parts-head-face-card.jpg",
  "./parts-body-card.jpg"
, "./images/home-missions/approved-cards/m3-classroom-dashboard.jpg", "./images/home-missions/approved-cards/m4-permission-dashboard.jpg", "./images/home-missions/approved-cards/m6-colors-dashboard.jpg", "./images/home-missions/approved-cards/m7-numbers-dashboard.jpg", "./images/home-missions/approved-cards/m8-weather-dashboard.jpg", "./images/home-missions/approved-cards/m9-numbers-11-20-dashboard.jpg", "./images/home-missions/approved-cards/m11-days-dashboard.jpg", "./images/home-missions/approved-cards/m12-months-dashboard.jpg", "./images/home-missions/approved-cards/m13-face-dashboard.jpg", "./images/home-missions/approved-cards/m14-body-dashboard.jpg", "./images/home-missions/approved-cards/m15-review-11-14.jpg", "./images/home-missions/approved-cards/m16-size-dashboard.jpg", "./images/home-missions/approved-cards/m17-this-that.jpg", "./images/home-missions/approved-cards/m20-review-16-19.jpg", "./images/home-missions/approved-cards/m21-to-be.jpg", "./images/home-missions/approved-cards/m14-it.jpg", "./images/home-missions/approved-cards/mission3-actions.svg"];

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
