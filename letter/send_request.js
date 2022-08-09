const BASE_URL = 'http://127.0.0.1:8000';
const DEFAULT_NUMBER = 1
const ZERO = 0
const urlParams = new URLSearchParams(window.location.search);
const REG = /[\{\}\[\]\;:|\)*`^\-_+<>@\#$%&\\\=\(\'\"]/gi

let url_page_num = urlParams.get('page_num');
if (!url_page_num){
    url_page_num = DEFAULT_NUMBER
}

// 쿠키 할당
function get_cookie(name) {
    let cookie_value = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + DEFAULT_NUMBER) === (name + '=')) {
                cookie_value = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookie_value;
}
const csrftoken = get_cookie('csrftoken')

function open_detail_message_modal(detail_worry_message){
    document.getElementById('detail_message_modal_background').style.display="flex"
    const detail_small_modal = document.getElementById('detail_message_small_modal');
    document.body.style.overflow = 'hidden';
    let modal_top_now = parseInt((window.innerHeight - detail_small_modal.clientHeight) / 2)
    let modal_left_now = parseInt((window.innerWidth - detail_small_modal.clientWidth) / 2)
    
    detail_small_modal.style.left = modal_left_now + "px";
    detail_small_modal.style.top = modal_top_now + "px";

    const modal_text = document.getElementById("detail_message_sm_bd_ct_text")
    modal_text.innerText = detail_worry_message
    document.getElementById('detail_message_modal_button').innerHTML = `<a href="/letter/letter.html?board_id=${request_message.worry_board}" class="sm_bd_submit_button">작성하러 가기</a>`

}

function open_request_modal(worry_board_content){
    document.getElementById('modal_background').style.display="flex"
    const small_modal = document.getElementById('small_modal');
    document.body.style.overflow = 'hidden';
    let modal_top_now = parseInt((window.innerHeight - small_modal.clientHeight) / 2)
    let modal_left_now = parseInt((window.innerWidth - small_modal.clientWidth) / 2)
    
    small_modal.style.left = modal_left_now + "px";
    small_modal.style.top = modal_top_now + "px";

    const modal_text = document.querySelector(".sm_bd_ct_text")
    modal_text.innerText = worry_board_content
}
//  모달의 외부를 클릭 시
modal_background.addEventListener('click', function (e) {
if (e.target.classList.contains('modal_background')) {
    close_modal()
}
})
// worry_board의 모달을 닫는 함수
function close_modal(){
    document.querySelector('.modal_background').style.display="none"
    document.getElementById('edit_modal_background').style.display="none"
    document.getElementById('detail_message_modal_background').style.display="none"
    document.body.style.overflow = 'auto';
}


window.onload = get_request_messages

async function get_request_messages() {
    const result = await fetch(BASE_URL + '/worry_board/request/sended' , {
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
            if(res.request_message == 0){
                alert("보낸 요청이 없네요. 요청을 작성하러 가볼까요?")
                location.href = "/letter/worry_board_page.html"
            }

            pagenation(res.total_count, 10, 10, url_page_num)
            const profile_grade = document.getElementById('profile_grade')
            const porfile_image = document.getElementById('profile_image')
            const mongle_image = document.getElementById('mongle_img')
            profile_grade.innerText = `나의 몽글 점수: ${res.user_profile_data.mongle_grade.grade}`
            porfile_image.style.backgroundImage =`url(${res.user_profile_data.profile_img})`
            mongle_image.style.backgroundImage = `url(${res.user_profile_data.mongle_grade.mongle_image})`
            let tmp_request_message = ``
            for (let i = 0; i < res.request_message.length; i++){
                request_message = res.request_message[i]
                request_status_list = ["", "요청", "수락대기", "수락함", "반려됨", "작성완료"]
                if (request_message.request_status == 3){
                    tmp_request_message += `
                <div class="md_bb_bl_board" id="md_bb_bl_board" >
                    <div class="md_bb_bl_board_box">
                        <div class="md_bb_bl_bd_description">
                            
                            <div class="md_bb_bl_bd_middle">
                                <div class="md_bb_bl_bd_hidden_name">${request_message.worry_board_category}</div>
                                <div class="md_bb_bl_bd_desc_create_date">${request_message.create_date}</div>
                            </div>    
                            <div class="md_bb_bl_bd_desc_edit_delete">
                                <div class="md_bb_bl_bd_desc_ed_edit" id="md_bb_bl_bd_desc_ed_edit" onclick="open_edit_modal('${request_message.request_message}','${request_message.id}')">수정</div>
                                <div class="md_bb_bl_bd_desc_ed_delete" id="md_bb_bl_bd_desc_ed_delete" onclick="delete_request_message(${request_message.id})">삭제</div>
                            </div>                           
                        </div>
                        <div class="md_bb_bl_bd_content">
                            <p class="md_bb_bl_bd_ct_left" id="md_bb_bl_bd_ct_left">
                                ${request_message.request_message}
                            </p>
                            <div class="md_bb_bl_bd_ct_right">
                                <div class="md_bb_bl_bd_ct_rg_border"></div>
                            </div>
                        </div>
                    </div>
                    <div class="md_bb_bl_bd_request">
                    <div class="md_bb_bl_bd_post_button" id="md_bb_bl_bd_post_button_${request_message.id}" onclick="open_detail_message_modal(` + '\`' + `${request_message.detail_worry_message}` + '\`' +',' + `${request_message.id}` + `)">편지 쓰기</div>
                    <button class="md_bb_bl_bd_request_button" id="md_bb_bl_bd_request_button_${request_message.id}" onclick="open_request_modal(` + '\`' + `${request_message.worry_board_content}` + '\`' +',' + `${request_message.id}` + `)">${request_status_list[request_message.request_status]}</button>
                    </div>
                </div>`
                }
                else {
                    tmp_request_message += `
                <div class="md_bb_bl_board" id="md_bb_bl_board" >
                    <div class="md_bb_bl_board_box">
                        <div class="md_bb_bl_bd_description">
                            
                            <div class="md_bb_bl_bd_middle">
                                <div class="md_bb_bl_bd_hidden_name">${request_message.worry_board_category}</div>
                                <div class="md_bb_bl_bd_desc_create_date">${request_message.create_date}</div>
                            </div>    
                            <div class="md_bb_bl_bd_desc_edit_delete">
                                <div class="md_bb_bl_bd_desc_ed_edit" id="md_bb_bl_bd_desc_ed_edit" onclick="open_edit_modal('${request_message.request_message}','${request_message.id}')">수정</div>
                                <div class="md_bb_bl_bd_desc_ed_delete" id="md_bb_bl_bd_desc_ed_delete" onclick="delete_request_message(${request_message.id})">삭제</div>
                            </div>                           
                        </div>
                        <div class="md_bb_bl_bd_content">
                            <p class="md_bb_bl_bd_ct_left" id="md_bb_bl_bd_ct_left">
                                ${request_message.request_message}
                            </p>
                            <div class="md_bb_bl_bd_ct_right">
                                <div class="md_bb_bl_bd_ct_rg_border"></div>
                            </div>
                        </div>
                    </div>
                    <div class="md_bb_bl_bd_request">
                    <button class="md_bb_bl_bd_request_button" id="md_bb_bl_bd_request_button_${request_message.id}" onclick="open_request_modal(` + '\`' + `${request_message.worry_board_content}` + '\`' +',' + `${request_message.id}` + `)">${request_status_list[request_message.request_status]}</button>
                    </div>
                </div>`
                }
                
            }
            const board_lists = document.querySelector(".mc_bb_board_lists")
            board_lists.innerHTML = tmp_request_message
            break;
        default:
            alert("세션이 만료 되었습니다.")
            go_sign_in()
    }
}

function open_edit_modal(content,request_message_id){
    document.getElementById('edit_modal_background').style.display="flex"
    const small_modal = document.getElementById('edit_small_modal');
    document.body.style.overflow = 'hidden';
    let modal_top_now = parseInt((window.innerHeight - small_modal.clientHeight) / 2)
    let modal_left_now = parseInt((window.innerWidth - small_modal.clientWidth) / 2)
    
    small_modal.style.left = modal_left_now + "px";
    small_modal.style.top = modal_top_now + "px";
    document.getElementById('edit_sm_bd_ct_textarea').innerText =  content
    document.getElementById('edit_sm_bd_button').innerHTML = `<button class="sm_bd_submit_button" onclick="edit_request_message(${request_message_id})">수정</button>`
}

// 게시글 수정모달의 외부를 클릭 시
edit_modal_background.addEventListener('click', function (e) {
if (e.target.classList.contains('modal_background')) {
    close_modal()
}
})
    

// 모달을 통해서 request_message를 수정하는 로직
async function edit_request_message(request_message_id){
    const token = localStorage.getItem('access')
    const edit_message = document.getElementById('edit_sm_bd_ct_textarea').value;
    const result = await fetch(BASE_URL + '/worry_board/request/pd/' + request_message_id , {
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
            "request_message" : edit_message.replace(REG,"")
        })
    })
    let res = await result.json()
    switch (result.status){
        case 200:
            alert(res['detail'])
            location.reload()
            break;
        default:
            alert(res['detail'])
    }
}

// 글을 삭제하는 로직 (cruD)
async function delete_request_message(request_message_id){
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/worry_board/request/pd/' + request_message_id , {
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
            location.href = 'send_request.html'
            break;
        default:
            alert(res['detail'])
    }
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
    if (url_page_num > total_page_num){
        url_page_num=total_page_num
    }
    else if (url_page_num < ZERO){
        url_page_num = DEFAULT_NUMBER
    }
    location.href = 'send_request.html?page_num=' + url_page_num
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
    console.log(e)
    if(e.target.classList.contains('drawer_wrapper')){
        drawer.style.display ='none';
        drawer_wrapper.style.display ='none';
    }
} )




