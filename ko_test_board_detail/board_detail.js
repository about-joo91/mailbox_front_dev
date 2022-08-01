const BASE_URL = 'http://127.0.0.1:8000';
const urlParams = new URLSearchParams(window.location.search);
const url_board_id = urlParams.get('board_id');


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


// 디테일 페이지에 댓글을 작성 할 때 실행되는 로직(Crud)
async function post_board_comment(){
    const comment_content = document.querySelector('.pc_ic_input').value;
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/board/comment/' + "?board_id=" + url_board_id ,{
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
            "content" : comment_content
        })
    })
    let res = await result.json()
    alert(res['detail'])
    href_board_detail(url_board_id)
}


// 글을 불러오는 로직 (cRud)
window.onload =
    async function get_board_comment() {
        if (!url_board_id){
            href_main()
        }
        const result = await fetch(BASE_URL + '/board/comment'+ '?board_id=' + url_board_id,{
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
        let tmp_board = ``
        switch (result.status){
            case 200:
                board = res.board_comments[0]   
                if (board.is_liked) {
                    sun_icon = 'bi-brightness-high-fill'
                    color_class = 'img_heart_icon_red'
                } else {
                    sun_icon = 'bi-brightness-high'
                    color_class = 'img_heart_icon'
                }
                
                // 내가 선택한 보드에 대한 정보를 가져오는 로직
                // 내가 글의 작성자라면 수정, 삭제를 추가
                if(board.is_board_writer == true){
                    tmp_board += `
                <div class="md_bb_bl_board" id="md_bb_bl_board_1">
                    <div class="md_bb_bl_bd_description">
                        <div class="md_bb_bl_bd_desc_image_icon"></div>
                        <div class="md_bb_bl_bd_middle">
                            <div class="mc_bb_cl_cm_im_writer">나의글</div>
                            <div class="md_bb_bl_bd_desc_create_date">${board.create_date}</div>
                        </div>                         
                        <div class="md_bb_bl_bd_desc_comment_icon">
                            <i class="bi bi-chat-dots onclick="href_board_detail(${board.id})"></i>
                            <div class="md_bb_bl_bd_desc_ci_comment_count" onclick="href_board_detail(${board.id})">${board.board_comment.length}</div>
                            <i class="bi ${sun_icon}"  id="bi_brightness_high_${board.id}" onclick="click_sun(${board.id})"></i>
                            <div class="md_bb_bl_bd_ct_right_sun_count" id="md_bb_bl_bd_ct_right_sun_count_${board.id}">${board.like_count}</div>
                        </div> 
                        <div class="md_bb_bl_bd_desc_edit_delete">
                            <div class="md_bb_bl_bd_desc_ed_edit" id="md_bb_bl_bd_desc_ed_edit_${board.id}" onclick="open_modal('edit_','${board.title}','${board.content}','${board.id}', '${url_board_id}')">수정</div>
                            <div class="md_bb_bl_bd_desc_ed_delete" id="md_bb_bl_bd_desc_ed_delete_${board.id}" onclick="delete_board('${board.id}', '${url_board_id}')">삭제</div>
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
                            <i class="bi bi-chat-dots onclick="href_board_detail(${board.id})""></i>
                            <div class="md_bb_bl_bd_desc_ci_comment_count" onclick="href_board_detail(${board.id})">${board.board_comment.length}</div>
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


                // pagenation(res.total_count, 10, 10, url_page_num)


                // 보드에 대한 댓글(comment)들을 가져오는 로직 (cRud)
                comment_list = res.board_comments[0].board_comment
                let tmp_comment = ``
                for (let i = 0; i < comment_list.length; i++){
                    const comment_lists = document.querySelector(".mc_bb_comment_lists")
                    
                    comment = comment_list[i]
                    if(comment.is_comment_writer == true){
                        var detail_writer = ["나의 글", "글쓴이"]
                        tmp_comment += `
                    <div class="mc_bb_cl_comment" id="mc_bb_cl_comment_${comment.id}">
                        <div class="mc_bb_cl_cm_description">
                            <div class="mc_bb_cl_cm_desc_image_icon"></div>
                            <div class="mc_bb_cl_cm_middle">
                                <div class="mc_bb_cl_cm_im_writer">${detail_writer[comment.is_detail_page_writer]}</div>
                                <div class="mc_bb_cl_cm_desc_create_date">${comment.create_date}</div>
                            </div>
                            <div class="md_bb_bl_bd_desc_edit_delete">
                                <div class="md_bb_bl_bd_desc_ed_edit" id="md_bb_bl_bd_desc_ed_edit_${board.id}" onclick="edit_comment_input('${comment.id}')">수정</div>
                                <div class="md_bb_bl_bd_desc_ed_delete" id="md_bb_bl_bd_desc_ed_delete_${board.id}" onclick="delete_board('${comment.id}')">삭제</div>
                            </div>
                        </div>
                        <div class="mc_bb_cl_cm_content">
                            <p class="mc_bb_cl_cm_ct_left">
                                ${comment.content}
                            </p>
                            <div class="mc_bb_cl_cm_ct_right">
                                <div class="mc_bb_cl_cm_ct_rg_border"></div>
                            </div>
                        </div>
                    </div>
                    <div class="edit_comment" id="edit_comment_${comment.id}">
                        <div class="pc_comment_icon">
                            <i class="bi bi-chat-dots-fill"></i>
                        </div>
                        <div class="pc_input_comment">
                            <input class="pc_ic_input" id="pc_ic_input_${comment.id}">
                        </div>
                        <div class="pc_comment_button_box">
                            <button class="pc_cbb_button" onclick="edit_board_comment(${comment.id})">작성</button>
                        </div>
                    </div>
                    `
                    }
                    else {
                        var detail_writer = ["익명", "글쓴이"]
                        tmp_comment += `
                    <div class="mc_bb_cl_comment">
                        <div class="mc_bb_cl_cm_description">
                            <div class="mc_bb_cl_cm_desc_image_icon"></div>
                            <div class="mc_bb_cl_cm_middle">
                                <div class="mc_bb_cl_cm_hidden_name">${detail_writer[comment.is_detail_page_writer]}</div>
                                <div class="mc_bb_cl_cm_desc_create_date">${comment.create_date}</div>
                            </div>
                        </div>
                        <div class="mc_bb_cl_cm_content">
                            <p class="mc_bb_cl_cm_ct_left">
                                ${comment.content}
                            </p>
                            <div class="mc_bb_cl_cm_ct_right">
                                <div class="mc_bb_cl_cm_ct_rg_border"></div>
                            </div>
                        </div>
                    </div>
                    `
                    }
                    
                    comment_lists.innerHTML = tmp_comment
                }
                break;
            default:
                alert("세션이 만료 되었습니다.")
                location.replace('/user/signin_page.html')
        }
    }


// 댓글의 수정 버튼을 눌렀을 떄 실행되는 로직

function edit_comment_input(comment_id){
    const edit_comment_by_id = document.getElementById('edit_comment_' + comment_id);
    edit_comment_by_id.style.display = "flex"
}

// 현재 내가있는 보드를 삭제하는 로직 (cluD)
async function delete_board(board_id, page_num){
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
    alert(res['detail'])
    href_board_detail(url_board_id)
}

// 좋아요를 눌렀을 떄 실행되는 코드

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
    switch (result.status){
        case 200:
            const sun = document.getElementById("bi_brightness_high_"+ board_id)
            const sun_count = document.getElementById("md_bb_bl_bd_ct_right_sun_count_" + board_id)
            if(sun.classList.contains("bi-brightness-high-fill")){
                sun.classList.replace("bi-brightness-high-fill", "bi-brightness-high");
                sun_count.innerText = parseInt(sun_count.innerText) - 1
                alert(res['detail'])
            }
            else{
                sun.classList.replace("bi-brightness-high", "bi-brightness-high-fill");
                sun_count.innerText = parseInt(sun_count.innerText) + 1
                alert(res['detail'])
                }
            break;
    }
}
// 내가 클릭한 댓글의 내용을 수정하는 로직 (crUd)
async function edit_board_comment(comment_id){
    const token = localStorage.getItem('access')
    const edit_comment_content = document.getElementById('pc_ic_input_'+ comment_id).value;
    const result = await fetch(BASE_URL + '/board/comment/' + comment_id , {
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
            "content" : edit_comment_content
        })
    })
    let res = await result.json()
    switch (result.status){
        case 200:
            alert(res['detail'])
            href_board_detail(url_board_id)
            break;
        default:
            alert(res['detail'])
    }
}

// 내가 클릭한 댓글을 삭제하는 로직 (cruD)
async function delete_board(comment_id){
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/board/comment/' + comment_id , {
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
    switch (result.status) {
        case 200:
            alert(res['detail'])
            href_board_detail(url_board_id)
            break;
        default:
            alert(res['detail'])
    }
}

// 현재 내가 보고있는 보드의 디테일페이지로 이동하는 로직
function href_board_detail(url_board_id){
    location.href = '../../ko_test_board_detail/board_detail.html?board_id=' + url_board_id
}
// 기존의 익명 게시판 목록으로 이동하는 로직
function href_board(page_num){
    location.href = '../../ko_test_board/board_page.html?page_num=' + page_num
}
// 메인페이지로 이동하는 로직
function href_main(){
    location.href = '../../jin_test/main_intro.html'
}