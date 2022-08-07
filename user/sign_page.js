
const backend_base_url = "https://www.api-mongle.shop"

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
            location.reload()
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
            location.reload();
            break;
        case 400:
            alert("로그인을 실패하였습니다. 다시 입력해주세요");
            location.reload();
            break;
    }

}


// 로그아웃
function logout() {
    alert("로그아웃 되었습니다");
    localStorage.clear();
    location.replace('../index.html');
}