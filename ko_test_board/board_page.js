const BASE_URL = 'http://127.0.0.1:8000';

// 쿠키 할당
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


const modal_background = document.querySelector('.modal_background');
const small_modal = document.querySelector('.small_modal');

modal_background.addEventListener('click', function (e) {
if (e.target.classList.contains('modal_background')) {
    close_modal()
}
})
function open_modal(){
    document.querySelector('.modal_background').style.display="block"
    document.body.style.overflow = 'hidden';
    let modal_top_now = parseInt((window.innerHeight - small_modal.clientHeight) / 2)
    let modal_left_now = parseInt((window.innerWidth - small_modal.clientWidth) / 2)
    const small_modal_body = document.querySelector('.small_modal');
    small_modal_body.style.left = modal_left_now + "px";
    small_modal_body.style.top = modal_top_now + "px";
}
 function close_modal(){
    document.querySelector('.modal_background').style.display="none"
    document.body.style.overflow = 'auto';
 }

// 모달을 통해서 글을 작성 할 때 실행되는 코드

 async function post_board(){
    const post_title = document.querySelector(".sm_tt_title_input").value;
    console.log(post_title)
    const post_content = document.querySelector(".sm_bd_ct_textarea").value;
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/board/' ,{
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
            "title": post_title,
            "content" : post_content
        })
    })
    let res = await result.json()
    if (result.status == 200) {
        alert("게시글을 작성 하였습니다!!")
    }
    else {
        alert("게시글 작성에 실패하였습니다.")
    }
}
