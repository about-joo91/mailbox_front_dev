
const backend_base_url = 'http://127.0.0.1:8000';
const urlParams = new URLSearchParams(window.location.search);
let url_username = urlParams.get('username');

if (url_username){
    window.onload = get_user_data()
}

let checked_username = ''
// 유저 아이디 체크
async function is_user_data(){
    const chek_is_user_data = {
        username : document.getElementById("Username").value
    }

    const response = await fetch(`${backend_base_url}/user/checkuser`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-type": "application/json"
        },
        method: "POST",
        mode: 'cors',
        body: JSON.stringify(chek_is_user_data)
    })

    const response_json = await response.json();
    switch(response.status){
        case 200:
            let url_username = document.getElementById("Username").value
            alert(response_json.detail);
            location.href = '../../user/new_password_page.html?username=' +  url_username 
            break;
        case 400:
            alert(response_json.detail);
            break;
    }

}

// 로그인
async function get_user_data(){
    const result = await fetch(`${backend_base_url}/user/user_certification?username=` + url_username, {
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
            document.querySelector('.page_1').style.display="none"
            document.querySelector('.page_2').style.display="flex"
            document.querySelector('.page_2-1').style.display="flex"
            const mb_sub_2 = document.querySelector('.mb_sub_2')
            mb_sub_2.innerHTML = `<div class="form-control" id="cerfitication_question">${res.certification_request.certification_question}</div>`
            
            const mb_sub_4 = document.querySelector('.mb_sub_4')
            mb_sub_4.innerHTML = `<button class="w-100 btn btn-lg btn-primary" type="button" onclick="check_user_certification_answer()">입력</button>`
            break;
        case 401:
            alert(res.detail);
            break;
        default:
            alert(res['detail'])
            break;
    }

}

// 유저 질문 답 체크
async function check_user_certification_answer(){
    const chek_users_answer = {
        username: url_username,
        certification_answer : document.getElementById("certification_answer").value
    }

    const response = await fetch(`${backend_base_url}/user/user_certification`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-type": "application/json"
        },
        method: "POST",
        mode: 'cors',
        body: JSON.stringify(chek_users_answer)
    })

    const response_json = await response.json();
    switch(response.status){
        case 200:
            alert(response_json.detail);
            const mb_sub_2 = document.querySelector('.mb_sub_2')
            const mb_sub_2_1 = document.querySelector('.page_2-1')
            const mb_sub_2_2 = document.querySelector('.page_2-2')
            const mb_sub_4 = document.querySelector('.mb_sub_4')
            mb_sub_2.innerHTML = `<div class="form-control" id="cerfitication_question">"비밀번호 재설정"</div>`
            mb_sub_2_1.innerHTML = `<input type="password" class="form-control" id="password" placeholder="새로운 비밀번호를 입력해주세요."/>`
            mb_sub_2_2.innerHTML = `<input type="password" class="form-control" id="check_password" placeholder="새로운 비밀번호를 재입력해주세요." onkeyup="set_new_password_enterkey();"/>`
            mb_sub_4.innerHTML = `<button class="w-100 btn btn-lg btn-primary" type="button" onclick="set_new_password()">재설정</button>`
            break;
        case 400:
            alert(response_json.detail);
            break;
    }

}
// 비밀번호 재설정
async function set_new_password(){
    const set_new_password_data = {
        username: url_username,
        password : document.getElementById("password").value,
        check_password : document.getElementById("check_password").value,
    }

    const response = await fetch(`${backend_base_url}/user/`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            'Accept': "application/json",
            "Content-type": "application/json"
        },
        method: "PUT",
        mode: 'cors',
        body: JSON.stringify(set_new_password_data)
    })

    const response_json = await response.json();
    switch(response.status){
        case 200:
            alert(response_json.detail);
            location.href = "../index.html"
            break;
        case 400:
            alert(response_json.detail);
            break;
    }

}



function check_user_certification_answer_enterkey(){
    if (window.event.keyCode == 13){
        check_user_certification_answer();
    }
}
function is_user_data_enterkey(){
    if (window.event.keyCode == 13){
        is_user_data();
    }
}
function set_new_password_enterkey(){
    if (window.event.keyCode == 13){
        set_new_password();
    }
}

