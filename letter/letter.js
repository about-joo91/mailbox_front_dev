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
        location.replace('/user/signin.html')
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams == ""){
        location.replace('/main/main2.html')
    }
    token = localStorage.getItem('access');
    const myposts = await fetch(BASE_URL + "/main_page/" +"main/",{
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
        const mongle_image = document.getElementById('mongle_img')
        profile_grade.innerText = `나의 몽글 점수: ${response.main_page_data_and_user_profile.user_profile_data.grade}`
        porfile_image.style.backgroundImage =`url(${response.main_page_data_and_user_profile.user_profile_data.profile_img})`
        mongle_image.style.backgroundImage = `url(${response.main_page_data_and_user_profile.user_profile_data.mongle_img})`
    }};



async function letter_post(){
    const token = localStorage.getItem('access')
    const title =document.getElementById('title_text').value
    const content = document.getElementById('content_text').value
    const urlParams = new URLSearchParams(window.location.search);
    const worry_board_id = urlParams.get('board_id ');

    const result = await fetch(BASE_URL + '/main_page/letter/', {
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
        location.replace("http://127.0.0.1:5500/main/main2.html")
    }
    else{
        alert("이미 편지를 쓰셨습니다!")
        location.replace("http://127.0.0.1:5500/main/main2.html")
    }
}    

function main_modal(){
    document.querySelector('.drawer_wrapper').style.display ='flex';
    document.getElementById('drawer').style.display ='flex';
}

document.querySelector('.main_container').addEventListener('click', function (e) {
    if (window.innerWidth <= 850){
    document.getElementById('drawer').style.display ='none';
    document.querySelector('.drawer_wrapper').style.display ='none';
    }
})

document.querySelector('.nav_container').addEventListener('click', function (e) {
    if (window.innerWidth <= 850){
        document.getElementById('drawer').style.display ='none';
        document.querySelector('.drawer_wrapper').style.display ='none';
        }
})




