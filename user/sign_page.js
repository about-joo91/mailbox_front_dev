
const backend_base_url = 'http://127.0.0.1:8000';


window.onload = get_certification_request_list

// 본인인증 질문들 가져오기
async function get_certification_request_list(){
    const result = await fetch(`${backend_base_url}/user/question`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            'Accept': "application/json",
            "Content-type": "application/json"
        },
        method: "GET",
        mode: 'cors',
    })
    let res = await result.json()
    switch(result.status){
        case 200:
            const select_question = document.getElementById('Certification_Requestion')
            let tmp_html = ``
            for (i=0; i<res.length; i++){
                tmp_html+=`<option value="${i+1}">${res[i]}</option>`
            }
            select_question.innerHTML+=tmp_html
            break;
        case 401:
            alert(res.detail);
            break;
        default:
            alert(res['detail'])
            break;
    }

}


// 회원가입
async function SignUp(){
    const SignupData = {
        username : document.getElementById("Username").value,
        nickname : document.getElementById("Nickname").value,
        certification_question : document.getElementById("Certification_Requestion").value,
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
            window.location.replace(`../main/main.html`);
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