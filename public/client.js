async function initServiceWorker() {
    let swRegistration = await navigator.serviceWorker.register('./worker.js', {
        scope: '/'
    })
    let pushManager = swRegistration.pushManager;

    let permissionState = await pushManager.permissionState({userVisibleOnly: true});
    switch (permissionState) {
        case 'prompt':
            alert("Click Subscribe Push Notifications Button from Menu");
            break;
        case 'granted':
            break;
        case 'denied':
            alert('User denied push permission');
    }
}

async function subscribeToPush() {

    const VAPID_PUBLIC_KEY = "BOd2EQ8LTe3KAgMX9lWwTlHTRzv1Iantw50Mw6pUnsNr3pcxl8iglUs-YlQEQLo4UbJk9oyXs_BxgyAe0TCqKME";

    let swRegistration = await navigator.serviceWorker.getRegistration();
    let pushManager = swRegistration.pushManager;
    
    let subscriptionOptions = {
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
    };
    try {
        let subscription = await pushManager.subscribe(subscriptionOptions);

        await fetch("/subscribe", {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: {
                "Content-Type": "application/json",
            }
        });

    } catch (error) {
       // alert("User denied push permission");
    }
}

if ((new URLSearchParams(window.location.search)).get('page') === 'success') {
    document.getElementById('content').innerHTML = 'You successfully opened page from WebPush! (this url was that was set in json data param)';
}

if (navigator.serviceWorker) {
        initServiceWorker();
}
