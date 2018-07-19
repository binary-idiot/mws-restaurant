const staticCache = 'restaurant-reviews-static-';
const staticVer = 'v4';

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
		caches.open(`${staticCache}${staticVer}`).then(cache =>{
			return cache.match(event.request).then(response => {

				if(!response){
					console.log(`${event.request.url} not in cache, fetching...`)
					fetch(event.request).then(response =>{
						console.log(response);
						if(!response.ok)
							throw new TypeError('Bad response status');

						cache.put(event.request, response);
					});
				}

				//console.log(event.request);
				//console.log(response);

				return response;

			})
		})
	);
});