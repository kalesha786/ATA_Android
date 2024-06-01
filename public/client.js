async function initServiceWorker() {
    let swRegistration = await navigator.serviceWorker.register('./worker.js', {
        scope: '/'
    })
    let pushManager = swRegistration.pushManager;

    if (!isPushManagerActive(pushManager)) {
        return;
    }

    let permissionState = await pushManager.permissionState({userVisibleOnly: true});
    switch (permissionState) {
        case 'prompt':
            alert("click Subscribe Push Notifications");
            break;
        case 'granted':
            displaySubscriptionInfo(await pushManager.getSubscription())
            break;
        case 'denied':
            alert('User denied push permission');
    }
}

function isPushManagerActive(pushManager) {
    if (!pushManager) {
        if (!window.navigator.standalone) {
            alert("For ATA notifications, you may need to add this website to Home Screen at your iPhone or iPad.");
        } else {
            throw new Error('PushManager is not active');
        }
        return false;
    } else {
        return true;
    }
}

async function subscribeToPush() {

    const VAPID_PUBLIC_KEY = "BOd2EQ8LTe3KAgMX9lWwTlHTRzv1Iantw50Mw6pUnsNr3pcxl8iglUs-YlQEQLo4UbJk9oyXs_BxgyAe0TCqKME";

    let swRegistration = await navigator.serviceWorker.getRegistration();
    let pushManager = swRegistration.pushManager;
    if (!isPushManagerActive(pushManager)) {
        return;
    }
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

        testSend(subscription);
        // Here you can send fetch request with subscription data to your backend API for next push sends from there
    } catch (error) {
        alert("User denied push permission");
    }
}


function testSend() {
    const title = "Push title";
    const options = {
        body: "Additional text with some description",
        icon: "https://andreinwald.github.io/webpush-ios-example/images/push_icon.jpg",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/1920px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg",
        data: {
            "url": "https://andreinwald.github.io/webpush-ios-example/?page=success",
            "message_id": "your_internal_unique_message_id_for_tracking"
        },
    };
    navigator.serviceWorker.ready.then(async function (serviceWorker) {
        await serviceWorker.showNotification(title, options);
    });
}

if (navigator.serviceWorker) {
    initServiceWorker();
}
