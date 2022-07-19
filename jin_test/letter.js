const BASE_URL = 'http://127.0.0.1:8000';

function get_cookie(name) {
    let cookie_value = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookie_value = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookie_value;
}
const csrftoken = get_cookie('csrftoken')

window.onload = async function(){
    if (!localStorage.hasOwnProperty('access')) {
        location.replace('/won_test/signin.html')
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams == ""){
        location.replace('/jin_test/main2.html')
    }
    token = localStorage.getItem('access');
    const myposts = await fetch(BASE_URL + "/jin/" +"main/",{
        method:'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${token}`,
        }
    })
    let response = await myposts.json()
    if (myposts.status==200){
        const profile_grade = document.getElementById('profile_grade')
        const porfile_image = document.getElementById('profile_image')
        profile_grade.innerText = `나의 몽글 점수: ${response.profile_grade}`
        porfile_image.src =`${response.porfile_image}`
    }};



async function letter_post(){
    const token = localStorage.getItem('access')
    const title =document.getElementById('title_text').value
    const content = document.getElementById('content_text').value
    const urlParams = new URLSearchParams(window.location.search);
    const worry_board_id = urlParams.get('board_id ');

    const result = await fetch(BASE_URL + '/jin/letter/', {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "title": title,
            "content" : content,
            "worry_board_id" : worry_board_id
        })
    })
    if (result.status == 200) {
        alert("편지를 보냈습니다!")
        location.replace("http://127.0.0.1:5500/jin_test/main2.html")
    }
    else{
        alert("이미 편지를 쓰셨습니다!")
        location.replace("http://127.0.0.1:5500/jin_test/main2.html")
    }
}    

function main_modal(){
    document.getElementById('main_modal').style.visibility ='visible';
}
const main = document.getElementById('main_container')
document.querySelector('.main_container').addEventListener('click', function (e) {
    document.getElementById('main_modal').style.visibility ='hidden';
})

function logout() {
    localStorage.clear();
    location.replace('/user/sign_in.html')
}