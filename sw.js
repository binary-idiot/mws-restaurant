const staticCache = 'restaurant-reviews-static-';
const staticVer = 'v2';

self.addEventListener('install', event =>{

	event.waitUntil(
		caches.open(`${staticCache}${staticVer}`).then(cache => {
			return cache.addAll(['/', '/restaurant.html',
				'js/main.js', 'js/dbhelper.js', 'js/swhelper.js', 'js/restaurant_info.js',
				'css/styles.css',
				'data/restaurants.json']);
		})
	);
});

self.addEventListener('activate', event =>{
	event.waitUntil(
		caches.keys().then(cacheNames =>{
			return Promise.all(
				cacheNames.filter(cacheName =>{
					return cacheName.startsWith(staticCache) &&
						cacheName != `${staticCache}${staticVer}`;
				}).map(cacheName =>{
					console.log(`Deleting ${cacheName}`)
					return caches.delete(cacheName);
				}) 
			)
		})
	);
});

self.addEventListener('message', event => {
	if(event.data.action === 'skipWaiting'){
		self.skipWaiting();
	}
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			if(response) return response;
			return fetch(event.request);
		})
	);
});