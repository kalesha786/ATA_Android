console.log("Service worker loaded...");

self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push received:', data);
    if (!data || !data.title) {
        console.error('Received WebPush with an empty title. Received body: ', data);
    }
    const options = {
        body: data.body,
        icon: './img/icon.png',
        data: {
            url: "https://ata-production.up.railway.app/notifications.html"
        }
    };

       self.registration.showNotification(data.title, options)
       .then(() => {
        // You can save to your analytics fact that push was shown
        // fetch('https://your_backend_server.com/track_show?message_id=' + pushData.data.message_id);
    });
});

self.addEventListener('notificationclick', function (event) {   
    event.notification.close();

    if (!event.notification.data) {
        console.error('Click on WebPush with empty data, where url should be. Notification: ', event.notification)
        return;
    }
    const urlToOpen = event.notification.data.url;
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Check if there's already a window/tab open with the target URL
            for (let client of windowClients) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window/tab with the target URL
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});