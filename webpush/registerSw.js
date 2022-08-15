
let urlParams = window.location.search

if (urlParams == "?after_login"){
    
    const getinfo = async () => {
        token = localStorage.getItem('access');
        const response = await fetch(`${BASE_URL}/webpush_alarm/getinfo/`, {
            headers:{
                "Authorization": `Bearer ${token}`,
            },
            method: "GET",
        })
        response_json = await response.json()
        switch(response.status){
            case 200:
                return response_json
                break;
            default:
                break;
        }
    }

    getinfo().then(response_json => {
        const registerSw = async () => {
            if ('serviceWorker' in navigator) {
                const reg = await navigator.serviceWorker.register('../webpush/sw.js');
                initialiseState(reg)
            } else {
                alert("푸시 알람을 받으실 수 없습니다. 다시 시도해주세요 😢")
            }
        };
    
        const initialiseState = (reg) => {
            if (!reg.showNotification) {
                alert('이 브라우저에서 푸시알람은 지원하지 않습니다.😢');
                return
            }
            if (Notification.permission === 'denied') {
                alert('푸시 알람을 받으시려면 로그인을 다시 해주세요');
                return
            }
            if (!'PushManager' in window) {
                alert("브라우저에서 푸시알람 설정을 허용해주세요! 🤔");
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

        registerSw();
    
    })

    async function sendWebpush() {
        const res = await fetch(`${BASE_URL}/webpush_alarm/sendpush/`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                "Authorization": `Bearer ${token}`,
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "x-csrftoken" : csrftoken,
            }
        })
        switch (res.status){
            case 200:
                break;
            default:
                break;
        }
    }
    
}


