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
const edit_modal_background = document.getElementById('edit_modal_background')
const small_modal = document.querySelector('.small_modal');

modal_background.addEventListener('click', function (e)  {
if (e.target.classList.contains('modal_background')) {
    close_modal()
}
})

edit_modal_background.addEventListener('click', function (e) {
if (e.target.classList.contains('modal_background')) {
    close_modal()
}
})

function open_modal(type, title, content, board_id){
    console.log(title)
    document.getElementById(type + 'modal_background').style.display="block"
    const small_modal = document.getElementById(type + 'small_modal');
    document.body.style.overflow = 'hidden';
    let modal_top_now = parseInt((window.innerHeight - small_modal.clientHeight) / 2)
    let modal_left_now = parseInt((window.innerWidth - small_modal.clientWidth) / 2)
    
    small_modal.style.left = modal_left_now + "px";
    small_modal.style.top = modal_top_now + "px";
    if (type=="edit_"){
        // innterText title이 먹지를 않음
        document.getElementById('edit_sm_tt_title_input').innerText = title
        document.getElementById('edit_sm_bd_ct_textarea').innerText = content
        document.getElementById('edit_sm_bd_button').innerHTML = `<button class="sm_bd_submit_button" onclick="edit_board(${board_id})">작성</button>`
    }

}
 function close_modal(){
    document.querySelector('.modal_background').style.display="none"
    document.getElementById('edit_modal_background').style.display="none"
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
                // boards에 대한 제목, 내용 등등을 가져오는 코드
                board = res.boards[i]
                if (board.is_liked) {
                    sun_icon = 'bi-brightness-high-fill'
                    color_class = 'img_heart_icon_red'
                } else {
                    sun_icon = 'bi-brightness-high'
                    color_class = 'img_heart_icon'
                }
                // 내가 글의 작성자라면
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
                                <i class="bi ${sun_icon}"  id="bi_brightness_high_${board.id}" onclick="click_sun(${board.id})"></i>
                                <div class="md_bb_bl_bd_ct_right_sun_count" id="md_bb_bl_bd_ct_right_sun_count_${board.id}">${board.like_count}</div>
                            </div> 
                            <div class="md_bb_bl_bd_desc_edit_delete">
                                <div class="md_bb_bl_bd_desc_ed_edit" id="md_bb_bl_bd_desc_ed_edit_${board.id}" onclick="open_modal('edit_','${board.title}','${board.content}','${board.id}')">수정</div>
                                <div class="md_bb_bl_bd_desc_ed_delete" id="md_bb_bl_bd_desc_ed_delete_${board.id}" onclick="delete_board(${board.id})">삭제</div>
                            </div>
                        </div>
                        <div class="md_bb_bl_bd_title">
                            <div class="md_bb_bl_bd_tt_text">${board.title}</div>
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
                                <div class="md_bb_bl_bd_desc_create_date">${board.create_date}</div>
                            </div>                         
                            <div class="md_bb_bl_bd_desc_comment_icon">
                                <i class="bi bi-chat-dots"></i>
                                <div class="md_bb_bl_bd_desc_ci_comment_count">${board.board_comment.length}</div>
                                <i class="bi ${sun_icon}"  id="bi_brightness_high_${board.id}" onclick="click_sun(${board.id})"></i>
                                <div class="md_bb_bl_bd_ct_right_sun_count" id="md_bb_bl_bd_ct_right_sun_count_${board.id}">${board.like_count}</div>
                            </div>
                        </div>
                        <div class="md_bb_bl_bd_title">
                            <div class="md_bb_bl_bd_tt_text">${board.title}</div>
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
                board_lists.innerHTML = tmp_board
            }
        }
        else {
            alert("세션이 만료 되었습니다.")
            location.replace('/user/signin_page.html')
        }
    }



// 모달을 통해서 글을 작성 할 때 실행되는 코드

 async function post_board(){
    const boards_title = document.querySelector(".sm_tt_title_input").value;
    const boards_content = document.querySelector(".sm_bd_ct_textarea").value;
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
            "title": boards_title,
            "content" : boards_content
        })
    })
    let res = await result.json()
    if (result.status == 200) {
        alert("게시글을 작성 하였습니다!!")
        location.replace('board_page.html')
    }
    else {
        alert("게시글 작성에 실패하였습니다.")
    }
}

async function click_sun(board_id){
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/board/like/' + board_id , {
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
    let res = await result.json()
    if (result.status == 200) {
        const sun = document.getElementById("bi_brightness_high_"+ board_id)
        const sun_count = document.getElementById("md_bb_bl_bd_ct_right_sun_count_" + board_id)
        if(sun.classList.contains("bi-brightness-high-fill")){
            sun.classList.replace("bi-brightness-high-fill", "bi-brightness-high");
            alert(res['message'])
            
        }
        else{
            sun.classList.replace("bi-brightness-high", "bi-brightness-high-fill");
            alert(res['message'])
            }
    }
}

// 모달을 통해서 글을 수정하는 로직
async function edit_board(board_id){
    const token = localStorage.getItem('access')
    const edit_title = document.getElementById('edit_sm_tt_title_input').value;
    const edit_content = document.getElementById('edit_sm_bd_ct_textarea').value;
    const result = await fetch(BASE_URL + '/board/' + board_id , {
        method: 'PUT',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "title" : edit_title,
            "content" : edit_content
        })
    })
    let res = await result.json()
    if (result.status == 200) {
        alert(res['message'])
        location.replace('board_page.html')
    }
    else{
        alert(res['message'])
    }
}

// 글을 삭제하는 로직
async function delete_board(board_id){
    console.log("board_id : ", board_id)
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/board/' + board_id , {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Bearer ${token}`
        },
    })
    let res = await result.json()
    if (result.status == 200) {
        alert(res['message'])
        location.replace('board_page.html')
    }
    else{
        alert(res['message'])
    }
}