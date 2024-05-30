
const publicVapidKey = "BOd2EQ8LTe3KAgMX9lWwTlHTRzv1Iantw50Mw6pUnsNr3pcxl8iglUs-YlQEQLo4UbJk9oyXs_BxgyAe0TCqKME";

if('serviceWorker' in navigator) {
    registerServiceWorker().catch(console.log)
    document.getElementById('subscribeButton').addEventListener('click', async () => {
        registerServiceWorker();
    });
}

async function registerServiceWorker() {
    const register = await navigator.serviceWorker.register('./worker.js', {
        scope: '/'
    });

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey,
    });

    await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json",
        }
    })
} else {
    throw new Error('Push permission denied');
}
}