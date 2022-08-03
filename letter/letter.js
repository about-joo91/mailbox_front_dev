const BASE_URL = 'http://127.0.0.1:8000';

const get_cookie = (name) => {
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

window.onload = async () => {
    if (!localStorage.hasOwnProperty('access')) {
        location.replace('/user/signin.html')
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams == ""){
        location.replace('/main/main2.html')
    }
    token = localStorage.getItem('access');
    const result = await fetch(BASE_URL + "/main_page/" +"main/",{
        method:'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${token}`,
        }
    })
    let response = await result.json()
    const nav_profile = (response) =>{
        const profile_grade = document.getElementById('profile_grade')
        const porfile_image = document.getElementById('profile_image')
        const mongle_image = document.getElementById('mongle_img')
        profile_grade.innerText = `나의 몽글 점수: ${response.main_page_data_and_user_profile.user_profile_data.grade}`
        porfile_image.style.backgroundImage =`url(${response.main_page_data_and_user_profile.user_profile_data.profile_img})`
        mongle_image.style.backgroundImage = `url(${response.main_page_data_and_user_profile.user_profile_data.mongle_img})`
    }
    const unauthorized = (response) => {
        alert(response.detail)
        location.replace('/user/signin.html');
    }
    switch(result.status){
        case 200:
            nav_profile(response)
            break;
        case 401:
            unauthorized(response)
            break;
        default:
            alert(response['detail'])
        }
    };


const letter_post = async() => {
    const token = localStorage.getItem('access')
    const title =document.getElementById('title_text').value
    const content = document.getElementById('content_text').value
    const urlParams = new URLSearchParams(window.location.search);
    const worry_board_id = urlParams.get('board_id');

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

    const unauthorized = (response) => {
        alert(response['detail'])
        location.replace('/user/signin.html');
    }
    const overlap = (response) =>{
        alert(response['detail'])
    }
    const response = await result.json();
    switch(result.status){
        case 200:
            alert(response['detail'])
            break;
        case 401:
            unauthorized(response)
            break;
        case 400:
            overlap(response)
            break;
        default:
            alert(response['detail'])
        }
}    

const main_modal= () =>{
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




