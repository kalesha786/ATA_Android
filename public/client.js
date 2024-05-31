const publicVapidKey = "BOd2EQ8LTe3KAgMX9lWwTlHTRzv1Iantw50Mw6pUnsNr3pcxl8iglUs-YlQEQLo4UbJk9oyXs_BxgyAe0TCqKME";

if ('serviceWorker' in navigator) {
    document.getElementById('subscribeButton').addEventListener('click', async () => {
        try {
            const register = await registerServiceWorker();
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                const subscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: publicVapidKey,
                });

                await fetch("http://localhost:3000/subscribe", {
                    method: "POST",
                    body: JSON.stringify(subscription),
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                alert("Subscription successful!");
            } else {
                alert('Push permission denied');
                throw new Error('Push permission denied');
            }
        } catch (error) {
            console.error('Error during service worker registration or push subscription:', error);
            alert(`Error: ${error.message}`);
        }
    });
}

async function registerServiceWorker() {
    return await navigator.serviceWorker.register('./worker.js', {
        scope: '/'
    });
}
