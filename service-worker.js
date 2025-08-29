console.log('Service Worker: Loaded.');

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'QuickConvert Hub';
  const options = {
    body: data.body || 'You have a new notification.',
    icon: 'data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%234F46E5\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpath d=\'M13 10V3L4 14h7v7l9-11h-7z\'/%3e%3c/svg%3e',
    badge: 'data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%234F46E5\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpath d=\'M13 10V3L4 14h7v7l9-11h-7z\'/%3e%3c/svg%3e',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // This can be changed to open a specific page of your app
  event.waitUntil(clients.openWindow('/'));
});
