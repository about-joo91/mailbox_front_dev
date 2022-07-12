api.js
const backend_base_url = "http://127.0.0.1:8000"
async function SignUp(){
    const SignupData = {
        username : document.getElementById("Username").value,
        nickname : document.getElementById("Nickname").value,
        password : document.getElementById("Password").value,
    }
    const response = await fetch(`${backend_base_url}/won_test/`, {
        headers : {
            Accept: "application/json",
            "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(SignupData)
    })
    response_json = await response.json()
    console.log(response_json)
    if (response.status == 200){
        console.log("성공!")
        // window.location.replace(`${frontend_base_url}/login.html`);
    }else {
        alert(response.status)
    }
}
async function SignIn(){
    const SignupData = {
        username : document.getElementById("Username").value,
        password : document.getElementById("Password").value,
    }
    const response = await fetch(`${backend_base_url}/won_test/api/token/`, {
        headers : {
            "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(SignupData)
    })
    response_json = await response.json()
    console.log(response_json)
    if (response.status ==200){
        localStorage.setItem("access", response_json.access)
        localStorage.setItem("refresh", response_json.refresh)
        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        localStorage.setItem("payload", jsonPayload);
        // window.location.replace(`${frontend_base_url}/`);
    }else{
        alert(response.status)
    }
}