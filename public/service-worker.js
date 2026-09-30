
/** Fix for a caching issue
 * There is a non-HTTP caching issue, previous build of FLL in a box used React Scripts,
 * The service worker was created with: react-scripts@3.4.3 & calling 'registerServiceWorker()'
 * We moved from a react-scripts to a vite build system, which no longer included the service worker
 * Without de-registering the service worker, it has been left, doing it's job
 *
 * The service worker provides immediate caching hits, before even registering on the HTTP layer
 *
 * The below file should help any affected users, and have their browsers de-register their orphaned service workers
 *
 * Commit with the service worker: d36536a1d45d356fa2dcb1b527757c5a6b2faa11
 * Commit moving to the vite build system: 2227fbcf4f0d2d11ccaae7c3eaa5d1f78b86027a
 *      (on the branch: 2025-season-unearthed)
 *      this branch / commmit is moving from react-scripts to vite, and bypassed master -> gh-pages
 */

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    // Mozilla doc of unregister: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/unregister
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url)); // reload open tabs
  })());
});
