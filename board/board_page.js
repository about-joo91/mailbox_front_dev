const BASE_URL = 'http://127.0.0.1:8000';
const DEFAULT_NUMBER = 1
const ZERO = 0

const urlParams = new URLSearchParams(window.location.search);
const url_page_num = urlParams.get('page_num');
const REG = /[\{\}\[\]\;:|\)*`^\-_+<>@\#$%&\\\=\(\'\"]/gi

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

// board를 불러오는 로직(cRud)
window.onload = get_board

async function get_board(event) {
    const urlParams = new URLSearchParams(window.location.search);
    let url_page_num = urlParams.get('page_num');
    let is_mine = urlParams.get('is_mine');
    if (!url_page_num){
        url_page_num = 1
    }
    if (!is_mine){
        is_mine = "False"
    }
    const result = await fetch(BASE_URL + '/board/'+ '?page_num=' + url_page_num + "&is_mine=" + is_mine,{
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
    switch(result.status){
        case 200:
            pagenation(res.total_count, 10, 10, url_page_num)
            const profile_grade = document.getElementById('profile_grade')
            const porfile_image = document.getElementById('profile_image')
            const mongle_image = document.getElementById('mongle_img')
            profile_grade.innerText = `나의 몽글 점수: ${res.user_profile_data.mongle_grade.grade}`
            porfile_image.style.backgroundImage =`url(${res.user_profile_data.profile_img})`
            mongle_image.style.backgroundImage = `url(${res.user_profile_data.mongle_grade.mongle_image})`
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
                            <div class="mc_bb_bl_bd_im_writer">내가작성</div>
                            <div class="md_bb_bl_bd_desc_create_date">${board.create_date}</div>
                        </div>
                        <div class="md_bb_bl_bd_desc_comment_icon">
                            <i class="bi ${sun_icon}"  id="bi_brightness_high_${board.id}" onclick="click_sun(${board.id})"></i>
                            <div class="md_bb_bl_bd_ct_right_sun_count" id="md_bb_bl_bd_ct_right_sun_count_${board.id}">${board.like_count}</div>
                        </div>
                        <div class="md_bb_bl_bd_desc_edit_delete">
                            <div class="md_bb_bl_bd_desc_ed_edit" id="md_bb_bl_bd_desc_ed_edit_${board.id}" onclick="open_edit_modal(` + '\`' + `${board.title}` + '\`' + ',' + '\`' + `${board.content}` + '\`' +',' + `${board.id}` + `)">수정</div>
                            <div class="md_bb_bl_bd_desc_ed_delete" id="md_bb_bl_bd_desc_ed_delete_${board.id}" onclick="delete_board('${board.id}', '${url_page_num}')">삭제</div>
                        </div>
                    </div>
                    <div class="md_bb_bl_bd_title">
                        <div class="md_bb_bl_bd_tt_text">${board.title}</div>
                    </div>
                    <div class="md_bb_bl_bd_content">
                        <p class="md_bb_bl_bd_ct_left">
                            ${board.content.replace(REG,"")}
                        </p>
                        <div class="md_bb_bl_bd_ct_right">
                        <i class="bi bi-chat-dots" onclick="href_board_detail(${board.id})"></i>
                        <div class="md_bb_bl_bd_desc_ci_comment_count" onclick="href_board_detail(${board.id})">${board.board_comment.length}</div>
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
                            <i class="bi ${sun_icon}"  id="bi_brightness_high_${board.id}" onclick="click_sun(${board.id})"></i>
                            <div class="md_bb_bl_bd_ct_right_sun_count" id="md_bb_bl_bd_ct_right_sun_count_${board.id}">${board.like_count}</div>
                        </div>
                        <div class="md_bb_bl_bd_desc_edit_delete">
                            <button onclick="open_report_modal(${board.user_id})" class="report_btn">신고하기</button>
                        </div>
                    </div>
                    <div class="md_bb_bl_bd_title">
                        <div class="md_bb_bl_bd_tt_text">${board.title}</div>
                    </div>
                    <div class="md_bb_bl_bd_content">
                        <p class="md_bb_bl_bd_ct_left">
                            ${board.content.replace(REG,"")}
                        </p>
                        <div class="md_bb_bl_bd_ct_right">
                        <i class="bi bi-chat-dots" onclick="href_board_detail(${board.id})"></i>
                            <div class="md_bb_bl_bd_desc_ci_comment_count" onclick="href_board_detail(${board.id})">${board.board_comment_count}</div>
                        </div>
                    </div>
                </div>`
                }
            const board_lists = document.querySelector(".mc_bb_board_lists")
            board_lists.innerHTML = tmp_board
        }
            break;
        default:
            alert("세션이 만료 되었습니다.")
            // location.replace('/index.html')
    }
}



// 모달을 통해서 글을 작성 할 때 실행되는 코드 (Crud)

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
            "title": boards_title.replace(REG,""),
            "content" : boards_content.replace(REG,"")
        })
    })
    let res = await result.json()
    switch(result.status){
        case 200:
            alert(res['detail'])
            click_page_num(1)
            break;
        default:
            alert(res['detail'])
    }
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
            "title" : edit_title.replace(REG,""),
            "content" : edit_content.replace(REG,"")
        })
    })
    let res = await result.json()
    switch (result.status) {
        case 200:
            alert(res['detail'])
            location.reload()
            break;
        default:
            alert(res['detail'])
    }
}

// 글을 삭제하는 로직 (cruD)
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
    switch(result.status){
        case 200:
            alert(res['detail'])
            location.href = 'board_page.html?page_num=' + page_num
            break;
        default:
            alert(res['detail'])       
    }
}
const modal_background = document.querySelector('.modal_background');
const edit_modal_background = document.getElementById('edit_modal_background')
const small_modal = document.querySelector('.small_modal');


// 수정모달을 열어주는 함수
function open_edit_modal(title,content,id){
    document.getElementById('edit_modal_background').style.display="flex"
    const small_modal = document.getElementById('edit_small_modal');
    document.body.style.overflow = 'hidden';
    let modal_top_now = parseInt((window.innerHeight - small_modal.clientHeight) / 2)
    let modal_left_now = parseInt((window.innerWidth - small_modal.clientWidth) / 2)
    
    small_modal.style.left = modal_left_now + "px";
    small_modal.style.top = modal_top_now + "px";
    document.getElementById('edit_sm_tt_title_input').value = title
    document.getElementById('edit_sm_bd_ct_textarea').innerText =  content
    document.getElementById('edit_sm_bd_button').innerHTML = `<button class="sm_bd_submit_button" onclick="edit_board(${id})">작성</button>`
}

function open_edit_modal(title,content,id){
    document.getElementById('edit_modal_background').style.display="flex"
    const small_modal = document.getElementById('edit_small_modal');
    document.body.style.overflow = 'hidden';
    let modal_top_now = parseInt((window.innerHeight - small_modal.clientHeight) / 2)
    let modal_left_now = parseInt((window.innerWidth - small_modal.clientWidth) / 2)
    
    small_modal.style.left = modal_left_now + "px";
    small_modal.style.top = modal_top_now + "px";
    document.getElementById('edit_sm_tt_title_input').value = title
    document.getElementById('edit_sm_bd_ct_textarea').innerText =  content
    document.getElementById('edit_sm_bd_button').innerHTML = `<button class="sm_bd_submit_button" onclick="edit_board(${id})">작성</button>`
}

// 모달을 열어주는 함수
function open_add_modal(){
    document.getElementById('modal_background').style.display="flex"
    document.querySelector('.sm_bd_text').style.display ="none"
    document.getElementById('sm_title').style.display= "flex"
    const small_modal = document.getElementById('small_modal');
    document.body.style.overflow = 'hidden';
    let modal_top_now = parseInt((window.innerHeight - small_modal.clientHeight) / 2)
    let modal_left_now = parseInt((window.innerWidth - small_modal.clientWidth) / 2)
    small_modal.style.left = modal_left_now + "px";
    small_modal.style.top = modal_top_now + "px";
}

// 리포트 모달1
function open_report_modal(author_id){
    document.getElementById('modal_background').style.display ="flex"
    document.getElementById('sm_title').style.display= "none"
    document.querySelector('.sm_bd_text').style.display ="flex"
    document.querySelector('.sm_bd_submit_button').setAttribute("onClick",`report_post(${author_id})`)
    document.querySelector('.sm_bd_text').textContent ="신고하기"
    document.querySelector('.sm_bd_text').innerHTML += '<div class="report_close_button" onclick="close_modal()">x</div>'
    const small_modal = document.getElementById('small_modal');
    document.body.style.overflow = 'hidden';
    let modal_top_now = parseInt((window.innerHeight - small_modal.clientHeight) / 2)
    let modal_left_now = parseInt((window.innerWidth - small_modal.clientWidth) / 2)
    small_modal.style.left = modal_left_now + "px";
    small_modal.style.top = modal_top_now + "px";
}

async function report_post(author_id){
    const report_reason = document.querySelector(".sm_bd_ct_textarea").value;
    const target_user_id = author_id
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/user/report' ,{
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
            "target_user_id": target_user_id,
            "report_reason" : report_reason.replace(REG,"")
        })
    })

    let res = await result.json()
    switch(result.status){
            case 200:
                alert("게시물 작성자를 신고하였습니다.")
                location.reload()
                break;
            case 400:
                alert(res["detail"])
                location.reload()
                break;
            case 404:
                alert(res["detail"])
                location.reload()
                break;
        default:
            alert(res["detail"])
            location.reload()
            break;
    }
}

// 모달을 닫아주는 함수
function close_modal(){
    document.querySelector('.modal_background').style.display="none"
    document.getElementById('edit_modal_background').style.display="none"
    document.body.style.overflow = 'auto';
}



// 페이지네이션에 관련된 함수 (window.onload시 로드함)
function pagenation(total_count, bottomSize, listSize, page_num ){

    let totalPageSize = Math.ceil(total_count / listSize)  //한 화면에 보여줄 갯수에서 구한 하단 총 갯수 
    let firstBottomNumber = page_num - page_num % bottomSize + 1;  //하단 최초 숫자
    if (firstBottomNumber < ZERO){
        firstBottomNumber = DEFAULT_NUMBER
    }
    let lastBottomNumber = page_num - page_num % bottomSize + bottomSize;  //하단 마지막 숫자
    if(lastBottomNumber > totalPageSize) lastBottomNumber = totalPageSize  //총 갯수보다 큰 경우 방지
    if(page_num%10==ZERO & page_num != ZERO){
        firstBottomNumber = firstBottomNumber - 10;
        lastBottomNumber = page_num;
    }

    const mc_bb_page_number = document.querySelector('.mc_bb_page_number')
    mc_bb_page_number.innerHTML += `<button class="page_num_button" onclick="click_page_num(1)"><<</button>`
    mc_bb_page_number.innerHTML += `<button class="page_num_button" onclick="click_page_num(${parseInt(firstBottomNumber) - 10})"><</button>`
    for(let i = firstBottomNumber ; i <= lastBottomNumber; i++){
        if(i==page_num){
            mc_bb_page_number.innerHTML += (`<span class="page_number cur_page" id="page_num_${i}" onclick="click_page_num('${i}')">${i} </span>`)
        }
        else {
            mc_bb_page_number.innerHTML += `<span class="page_number" id="page_num_${i}" onclick="click_page_num('${i}')">${i} </span>`
        }
    }
    mc_bb_page_number.innerHTML += `<button class="page_num_button" onclick="click_page_num('${parseInt(lastBottomNumber) + 1}', '${totalPageSize}')">></button>`
    mc_bb_page_number.innerHTML += `<button class="page_num_button" onclick="click_page_num('${totalPageSize}', '${totalPageSize}')">>></button>`
}

// 하단의 page_num 버튼을 누를 시 링크
function click_page_num(url_page_num, total_page_num){
    let is_mine = urlParams.get('is_mine');
    if (url_page_num > total_page_num){
        url_page_num=total_page_num
    }
    else if (url_page_num < ZERO){
        url_page_num = DEFAULT_NUMBER
    }
    location.href = 'board_page.html?page_num=' + url_page_num + "&is_mine=" + is_mine
}
// 메세지 버튼을 누를 시 디테일 페이지로 링크
function href_board_detail(board_id){
    location.href = '../../board/board_detail.html?board_id=' + board_id
}


const drawer = document.getElementById('drawer');
const drawer_wrapper = document.querySelector('.drawer_wrapper');
const main_modal= () => {
    drawer.style.display ='flex';
    drawer_wrapper.style.display ='flex';
}
const open_drawer = document.querySelector('.open_drawer');
open_drawer.addEventListener('click', main_modal)



drawer_wrapper.addEventListener('click', (e) =>{
    if(e.target.classList.contains('drawer_wrapper')){
        drawer.style.display ='none';
        drawer_wrapper.style.display ='none';
    }
} )

