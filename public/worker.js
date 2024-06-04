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
            url: "/notifications.html"
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
    alert(event.notification.data.url);
    if (!event.notification.data) {
        console.error('Click on WebPush with empty data, where url should be. Notification: ', event.notification)
        return;
    }
    event.waitUntil(
        clients.openWindow('/')
      );
});