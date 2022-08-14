
const BASE_URL = 'http://127.0.0.1:8000';

// 회원가입
async function SignUp(){
    const SignupData = {
        username : document.getElementById("Username").value,
        nickname : document.getElementById("Nickname").value,
        password : document.getElementById("Password").value,
    }

    const response = await fetch(`${BASE_URL}/user/`, {
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
    const response = await fetch(`${BASE_URL}/user/login`, {
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
            window.location.replace(`../main/main.html`);
            getInfo();
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
const logout = () => {
    alert("로그아웃이 완료 되었습니다.")
    localStorage.clear();
    location.replace('../index.html');

}

// 로그인 엔터키
function login_enterkey(){
    if (window.event.keyCode == 13){
        SignIn();
    }
}

// 회원가입 엔터키
function signup_enterkey(){
    if (window.event.keyCode == 13){
        SignUp();
    }
}

