
const backend_base_url = 'http://127.0.0.1:8000';

// 회원가입
async function SignUp(){
    const SignupData = {
        username : document.getElementById("Username").value,
        nickname : document.getElementById("Nickname").value,
        password : document.getElementById("Password").value,
    }

    const response = await fetch(`${backend_base_url}/user/`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-type": "application/json"
        },
        method: "OPTIONS",
        mode: 'cors',
        body: JSON.stringify(SignupData)
    })

    const response_json = await response.json();
    switch(response.status){
        case 200:
            alert(response_json.detail);
            window.location.replace(`../index.html`);
            break;
        case 400:
            alert(response_json.detail);
            break;
    }

}

// 로그인
async function SignIn(){
    const SignupData = {
        username : document.getElementById("Username").value,
        password : document.getElementById("Password").value,
    }
    const response = await fetch(`${backend_base_url}/user/login`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-type": "application/json"
        },
        method: "POST",
        mode: 'cors',
        body: JSON.stringify(SignupData)
    })
    const response_json = await response.json()
    switch(response.status){
        case 200:
            alert("로그인이 완료되었습니다!");
            localStorage.setItem("access", response_json.access);
            localStorage.setItem("refresh", response_json.refresh);
            window.location.replace(`../main/main_intro.html`);
            check_login();
            break;
        case 401:
            alert(response_json.detail);
            break;
        case 400:
            alert("로그인을 실패하였습니다. 다시 입력해주세요");
            break;
    }

}


// 로그아웃
function logout() {
    alert("로그아웃 되었습니다");
    localStorage.clear();
    location.replace('../index.html');
}


function login_enterkey(){
    if (window.event.keyCode == 13){
        SignIn();
    }
}

function signup_enterkey(){
    if (window.event.keyCode == 13){
        SignUp();
    }
}



// //쿠키 할당
// const  get_cookie = (name)  => {
//     let cookie_value = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookie_value = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookie_value;
// }
// const csrftoken = get_cookie('csrftoken')



async function check_login(){

    token = localStorage.getItem('access');
    const response = await fetch(`${backend_base_url}/webpush/`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            "Accept": "application/json",
            "Content-type": "application/json",
            // 'X-CSRFToken': csrftoken,
            "Authorization": `Bearer ${token}`,
        },
        method: "GET",
        mode: 'cors'
    })

    const response_json = await response.json();
    console.log(response_json)
    console.log("DDdd")
    switch(response.status){
        case 200:
            console.log("DDdd")
            alert(response_json.message);
            window.location.replace(`../index.html`);
            break;
        default:
            alert("!!")
    }
}