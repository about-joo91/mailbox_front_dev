
let urlParams = window.location.search
console.log(urlParams)

if (urlParams == "?after_login"){
    
    const getinfo = async () => {
        console.log("getInfo")
        token = localStorage.getItem('access');
        const response = await fetch(`${BASE_URL}/webpush_alarm/getinfo/`, {
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
    
    getinfo().then(response_json => {
        console.log("registerSw")
        const registerSw = async () => {
            if ('serviceWorker' in navigator) {
                const reg = await navigator.serviceWorker.register('../webpush/sw.js');
                initialiseState(reg)
            } else {
                alert("You can't send push notifications ☹️😢")
            }
        };
    
        const initialiseState = (reg) => {
            if (!reg.showNotification) {
                alert('Showing notifications isn\'t supported ☹️😢');
                return
            }
            if (Notification.permission === 'denied') {
                alert('You prevented us from showing notifications ☹️🤔');
                return
            }
            if (!'PushManager' in window) {
                alert("Push isn't allowed in your browser 🤔");
                return
            }
            subscribe(reg);
        }
    
    
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
            if (subscription) {
                sendSubData(subscription);
                return;
            }
    
            const key = response_json.vapid_key
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
    
            token = localStorage.getItem('access');
            const res = await fetch(`${BASE_URL}/webpush/save_information`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "x-csrftoken" : csrftoken,  
                },
                credentials: "include"
            });
    
            if (res.status == 201){
                sendWebpush();
            }
                
        };
        const handleResponse = (res) => {
            console.log(res.status);
        };
        registerSw();
    
    })

    async function sendWebpush() {
        console.log("sendWebpush")
        const res = await fetch(`${BASE_URL}/webpush_alarm/sendpush/`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                "Authorization": `Bearer ${token}`,
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "x-csrftoken" : csrftoken,
            }
        });
        if (res.status == 200){
            console.log("성공")
        }
    }
    
}


