
const backend_base_url = 'http://127.0.0.1:8000';

// 회원가입
async function SignUp(){
    const SignupData = {
        username : document.getElementById("Username").value,
        nickname : document.getElementById("Nickname").value,
        certification_requestion : document.getElementById("Certification_Requestion").value,
        certification_answer : document.getElementById("Certification_Answer").value,
        password : document.getElementById("Password").value,
        check_password : document.getElementById("Check_Password").value,
    }

    const response = await fetch(`${backend_base_url}/user/`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-type": "application/json"
        },
        method: "POST",
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
const logout = async() => {
    const token = localStorage.getItem('access')
    const response = await fetch(`${backend_base_url}/main_page/cachedelete`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Bearer ${token}`
        },
    })
    switch(response.status){
        case 200:
            alert("로그아웃 되었습니다");
            localStorage.clear();
            location.replace('../index.html');
            break;
    }

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