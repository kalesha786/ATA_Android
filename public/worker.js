console.log("Service worker loaded...");

self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push received:', data);

    const options = {
        body: data.body,
        icon: './img/icon.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
