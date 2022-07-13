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

 window.onload =
    async function get_board() {
        const result = await fetch(BASE_URL + '/board/' , {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization': "Bearer " + localStorage.getItem("access")
            },
        })
        let res = await result.json()
        if (result.status == 200) {
            let tmp_board = ``
            for (let i = 0; i < res.boards.length; i++){
                // boards에 대한 제목, 내용, 이미지를 가져오는 코드
                board = res.boards[i]
                // 좋아요와 북마크의 상태를 가져오는 코드
                    if(board.is_board_writer == true){
                        tmp_board += `
                    <div class="md_bb_bl_board" id="md_bb_bl_board_1">
                        <div class="md_bb_bl_bd_description">
                            <div class="md_bb_bl_bd_desc_image_icon"></div>
                            <div class="md_bb_bl_bd_middle">
                                <div class="md_bb_bl_bd_hidden_name">내가작성</div>
                                <div class="md_bb_bl_bd_desc_create_date">${board.create_date}</div>
                            </div>                         
                            <div class="md_bb_bl_bd_desc_comment_icon">
                                <i class="bi bi-chat-dots"></i>
                                <div class="md_bb_bl_bd_desc_ci_comment_count">${board.board_comment.length}</div>
                                <i class="bi bi-brightness-high id="bi-brightness-high_${board.id}"></i>
                                <div class="md_bb_bl_bd_ct_right_sun_count">${board.like_count}</div>
                            </div>
                        </div>
                        <div class="md_bb_bl_bd_content">
                            <p class="md_bb_bl_bd_ct_left">
                                ${board.content}
                            </p>
                            <div class="md_bb_bl_bd_ct_right">
                                <div class="md_bb_bl_bd_ct_rg_border"></div>
                            </div>
                        </div>
                    </div>`
                    }
                    else{
                        tmp_board += `
                    <div class="md_bb_bl_board" id="md_bb_bl_board_1">
                        <div class="md_bb_bl_bd_description">
                            <div class="md_bb_bl_bd_desc_image_icon"></div>
                            <div class="md_bb_bl_bd_middle">
                                <div class="md_bb_bl_bd_hidden_name">익명1</div>
                                <div class="md_bb_bl_bd_desc_create_date">2022-07-07 07:07</div>
                            </div>                         
                            <div class="md_bb_bl_bd_desc_comment_icon">
                                <i class="bi bi-chat-dots"></i>
                                <div class="md_bb_bl_bd_desc_ci_comment_count">${board.board_comment.length}</div>
                                <i class="bi bi-brightness-high" id="bi-brightness-high_${board.id}"></i>
                                <div class="md_bb_bl_bd_ct_right_sun_count">${board.like_count}</div>
                            </div>
                        </div>
                        <div class="md_bb_bl_bd_content">
                            <p class="md_bb_bl_bd_ct_left">
                                ${board.content}
                            </p>
                            <div class="md_bb_bl_bd_ct_right">
                                <div class="md_bb_bl_bd_ct_rg_border"></div>
                            </div>
                        </div>
                    </div>`
                    }


                const board_lists = document.querySelector(".mc_bb_board_lists")
                const empty_sun = document.getElementById("bi-brightness-high_"+ board.id)
                if(board.is_liked == true){
                    empty_sun.classList.replace("bi-brightness-high", "bi-brightness-high-fill");
                }
                board_lists.innerHTML = tmp_board
            }
        }
        else {
            alert("세션이 만료 되었습니다.")
            location.replace('/user/sign_page.html')
        }
    }







// 모달을 통해서 글을 작성 할 때 실행되는 코드

 async function boards_board(){
    const boards_title = document.querySelector(".sm_tt_title_input").value;
    console.log(boards_title)
    const boards_content = document.querySelector(".sm_bd_ct_textarea").value;
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/board/' ,{
        method: 'boards',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "title": boards_title,
            "content" : boards_content
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
