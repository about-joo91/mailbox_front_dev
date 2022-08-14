const BASE_URL = 'http://127.0.0.1:8000';

async function getInfo(){
    console.log("들어옴")

    token = localStorage.getItem('access');
    const response = await fetch(`${BASE_URL}/webpush_alarm/test/`, {
        headers:{
            "Authorization": `Bearer ${token}`,
        },
        method: "GET",
    })
    response_json = await response.json()
    if(response.status == 200){
        console.log(response_json)
        return response_json
    }else{
        console.log("Ddd")
        return "dd"
    }
}


getInfo().then(response_json => {
    const registerSw = async () => {
        if ('serviceWorker' in navigator) {
            
            const reg = await navigator.serviceWorker.register('sw.js');
            console.log(reg)
            initialiseState(reg)
            

        } else {
            showNotAllowed("You can't send push notifications ☹️😢")
        }
    };

    const initialiseState = (reg) => {
        if (!reg.showNotification) {
            showNotAllowed('Showing notifications isn\'t supported ☹️😢');
            return
        }
        if (Notification.permission === 'denied') {
            showNotAllowed('You prevented us from showing notifications ☹️🤔');
            return
        }
        if (!'PushManager' in window) {
            showNotAllowed("Push isn't allowed in your browser 🤔");
            return
        }
        subscribe(reg);
    }

    const showNotAllowed = (message) => {
        const button = document.querySelector('form>button');
        button.innerHTML = `${message}`;
        button.setAttribute('disabled', 'true');
    };

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        const outputData = outputArray.map((output, index) => rawData.charCodeAt(index));

        return outputData;
    }

    const subscribe = async (reg) => {
        const subscription = await reg.pushManager.getSubscription();
        console.log(subscription)
        if (subscription) {
            sendSubData(subscription);
            return;
        }

        const key = response_json.vapid_key

        // const vapidMeta = document.querySelector('meta[name="vapid-key"]');
        // const key = vapidMeta.content;
        const options = {
            userVisibleOnly: true,
            // if key exists, create applicationServerKey property
            ...(key && {applicationServerKey: urlB64ToUint8Array(key)})
        };

        const sub = await reg.pushManager.subscribe(options);
        sendSubData(sub)
    };

    const sendSubData = async (subscription) => {
        const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase();
        const data = {
            status_type: 'subscribe',
            subscription: subscription.toJSON(),
            browser: browser,
        };
        console.log(data)

        const res = await fetch(`${BASE_URL}/webpush/save_information`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
            credentials: "include"
        });

        handleResponse(res);
    };

    const handleResponse = (res) => {
        console.log(res.status);
    };

    registerSw();

})


