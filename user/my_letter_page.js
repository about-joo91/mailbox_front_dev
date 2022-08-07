const BASE_URL = 'http://127.0.0.1:8000/';
const urlParams = new URL(document.location).searchParams;
let page_name = "my_letter"
page_name = urlParams.get('page_name');
let letter_num = 0;
const letter_modal_wrapper = document.querySelector('.letter_modal_wrapper');
const letter_modal = document.querySelector('.letter_modal');
const lm_body = document.querySelector('.lm_body');
const MONGLE_LIMIT = 5
if (urlParams.get('letter_num')) {
    letter_num = urlParams.get('letter_num');
    letter_modal_wrapper.style.display = 'flex';
}


const onload_page = async () => {
    console.log(page_name)
    let url = new URL(BASE_URL + "my_page/"+page_name+"?letter_num=" + letter_num);
    let token = localStorage.getItem('access');
    const result = await fetch(url ,{
        method:'get',
        headers:{
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    });
    const response = await result.json();
    switch(result.status){
        case 200:
            letters_exist(response);
            break;
        case 202:
            when_whole_letter_is_not_read();
            break;
        case 303:
            letters_not_exist(response);
            break;
        case 401:
            unauthorized(response);
            break;
        case 400:
            alert(response.detail);
            break;
        case 404:
            alert(response.detail);
            break;
        default:
            default_page(response);
            break;
    }
};

window.onload = onload_page()

// onload에 묶인 함수들
const when_whole_letter_is_not_read = ()=> {
    location.replace('/user/my_letter_page.html?page_name=my_not_read_letter')
}
const default_page = (response) => {
    
    const lm_header = document.querySelector('.lm_header');
    const lm_body = document.querySelector('.lm_body');
    const nc_sb_nav = document.querySelector('.nc_sb_nav');
    nc_sb_nav.innerHTML += `<p>
    나의 몽글 점수: ${response.mongle_grade.grade}
    </p>
    <div class ="nc_mongle" style="background-image:url(`+response.mongle_grade.mongle_image +`)"></div>
    <div class="nc_profile" style="background-image:url(`+ response.profile_img +`)"><div>`

    lm_header.innerText = `안녕하세요 ${response.nickname}님 몽글을 찾아주셔서 감사합니다.`
    lm_body.innerText = `
     죄송합니다. 예상치 못한 문제가 발생하여 편지를 불러올 수가 없습니다. 
    
    다른 페이지로 이동 후 다시 시도를 해보시는게 어떨까요?
    
    그래도 계속 이 페이지가 보이신다면 거듭 사과의 말씀드리며 불편하시겠지만 의견 남겨주시면 빠르게 오류를 고치도록 하겠습니다.`
}
const unauthorized = (response) => {
    alert(response.detail)
    location.replace('/user/signin.html');
}
const letters_not_exist = (response) => {
    if (page_name === "my_not_read_letter"){
        location.replace('/user/my_letter_page.html?page_name=my_received_letter')
    }else{
        alert(response['detail'])
        location.href = '/letter/worry_board_page.html'
    }
    
}
const lm_new_letter_box = document.querySelector('.lm_new_letter_box');
const lm_whole_letter_box = document.querySelector('.lm_whole_letter_box');

const push_new_letter_button = (response) => {
    lm_new_letter_box.innerHTML = `<i class="fa-solid fa-exclamation new_letter_icon" onclick="get_letter_by_params('my_not_read_letter')"></i>
    <div class="lm_bubble">${response.not_read_letter_cnt}개의 읽지않은 편지가 있습니다.</div>`;
}
const push_before_button = () => {
    lm_whole_letter_box.innerHTML = `<i class="fa-solid fa-arrow-left whole_letter_icon" onclick="get_letter_by_params('my_received_letter')"></i>`
}
const letters_exist = (response) => {
    console.log(response)
    page_name = urlParams.get("page_name");
    const lm_header = document.querySelector('.lm_header');
    const lm_body = document.querySelector('.lm_body');
    const nc_sb_nav = document.querySelector('.nc_sb_nav');
    const lm_b_under = document.querySelector('.lm_b_under');
    let user_info;
    lm_new_letter_box.innerHTML = ''
    lm_whole_letter_box.innerHTML = ''
    let is_read_letter_exists = response.not_read_letter_cnt ? true : false
    switch(page_name){
        case "my_letter":
            user_info = response.letter.letter_author
            break;
        case "my_not_read_letter":
            user_info = response.letter.received_user;
            push_before_button();
            break;
        case "my_received_letter":
            user_info = response.letter.received_user
            if (is_read_letter_exists) push_new_letter_button(response)
            break;
        default:
            user_info = response.letter.received_user
            break;
    }
    nc_sb_nav.innerHTML = `
    <p>
    나의 몽글 점수: ${user_info.mongle_grade.grade}
    </p>
    <div class ="nc_mongle" style="background-image:url(`+user_info.mongle_grade.mongle_image +`)"></div>
    <div class="nc_profile" style="background-image:url(`+ user_info.profile_img +`)"></div>`
    let letter = response.letter
    lm_header.innerText = letter.title
    let letter_content_html = `<div class="letter_content">
        ${letter.content}
    </div>`
    lm_body.innerHTML = letter_content_html
    if (page_name == "my_not_read_letter") {
        make_page_num_for_new_letter(response.letter_cnt)
    }else{
        make_page_num(response.letter_cnt)
    }
    
    let review_data = letter.review_data
    const lm_review_modal = document.querySelector('.lm_review_modal');
    let lm_b_under_html = ``
    let lm_review_modal_html = ``
    if (review_data.is_reviewed){
        lm_b_under_html = `<div class="lm_b_review_btn" onclick="review_modal_in()">리뷰보기</div>`
        lm_review_modal_html += `
        <div class="lm_rm_mongle_grade">몽글 점수 : `
        for (let i = 0; i < review_data.review.grade; i++){
            lm_review_modal_html += `<div class="lm_rm_mongle"></div>`
        }
        lm_review_modal_html += `</div>
        <p class="lm_rm_content">${review_data.review.content}</p>
        <div class="lm_rm_btn_box">
            <div class="lm_rm_btn" onclick="edit_ready(${review_data.review.id})">수정</div>
            <div class="lm_rm_bb_white_space"></div>
            <div class="lm_rm_btn" onclick="delete_ready(${review_data.review.id})">삭제</div>
        </div>`
        lm_review_modal.innerHTML = lm_review_modal_html;
    }else{
        lm_b_under_html = `<div class="lm_b_review_btn" onclick="write_ready(${letter.id})">리뷰쓰기</div>`
    }
    lm_b_under.innerHTML += lm_b_under_html
}

const make_page_num_for_new_letter = (letter_cnt) => {
    const lm_b_paging_box = document.querySelector('.lm_b_paging_box');

    let letter_under_page_html = ``
    if (letter_cnt > 1){
        letter_under_page_html += `
        <div class="lm_b_pb_white_space"></div>
        <a href="?page_name=${page_name}&letter_num=0" class="lm_b_pb_page_num lm_b_pb_page_others"> next </a>
        <div class="lm_b_pb_next_more">${letter_cnt-1}개 더 있어요</div>
        `

    }
    lm_b_paging_box.innerHTML = letter_under_page_html
}

const make_page_num = (letter_cnt) => {
    const lm_b_paging_box = document.querySelector('.lm_b_paging_box');
    let page_cnt = 5
    let start_page = parseInt(letter_num / page_cnt) * page_cnt
    let last_page = start_page + page_cnt
    let limit_page = letter_cnt >= last_page ? last_page : letter_cnt;
    let letter_under_page_html = ``
    if (start_page > 0){
        letter_under_page_html += `<a href="?page_name=${page_name}&letter_num=${parseInt(start_page)-page_cnt}" class="lm_b_pb_page_num lm_b_pb_page_others"> prev </a>`
    }
    let iter_start_num = (letter_num == start_page && start_page == 0) ? 0 : start_page
    for (let i = iter_start_num; i< limit_page; i++){
        if (letter_num == i){
            letter_under_page_html += `<div class"lm_b_pb_page_num">${parseInt(i)+1}</div>`
            continue
            }
        letter_under_page_html += `<a href="?page_name=${page_name}&letter_num=${i}" class="lm_b_pb_page_others lm_b_pb_page_num">${i+1}</a>`
        }
    
    if (letter_cnt > last_page){
        letter_under_page_html += `<a href="?page_name=${page_name}&letter_num=${parseInt(start_page)+page_cnt}" class="lm_b_pb_page_num lm_b_pb_page_others"> next </a>`
    }
    lm_b_paging_box.innerHTML = letter_under_page_html
}
// 편지 모달을 불러오는 부분
const letter_modal_in = () => {
    letter_modal_wrapper.style.display = 'flex';
    letter_modal.classList.add('letter_animate');
    drawer_wrapper.style.display = 'none';
    
}

letter_modal_wrapper.addEventListener('click', (e) => {
    if(e.target.classList.contains('letter_modal_wrapper')){
        letter_modal_wrapper.style.display = 'none';
        drawer_wrapper.style.display = 'block';
    }
})

const change_query_params = (param_string) => {
    return new Promise((resolve, reject)=> {
        urlParams.set("page_name", param_string);
        resolve(urlParams.get('page_name'))
    } )
}
const get_letter_by_params = async (param_string) => {
    let changed_page_name = await change_query_params(param_string);
    let url = new URL(BASE_URL + `my_page/${changed_page_name}?letter_num=${letter_num}`);
    let token = localStorage.getItem('access');
    const result = await fetch(url ,{
        method:'get',
        headers:{
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    });
    const response = await result.json();
    switch(result.status){
        case 200:
            letters_exist(response);
            break;
        case 202:
            when_whole_letter_is_not_read();
            break;
        case 303:
            letters_not_exist(response);
            break;
        case 401:
            unauthorized(response);
            break;
        case 400:
            alert(response.detail);
            break;
        case 404:
            alert(response.detail);
            break;
        default:
            default_page(response);
            break;
    }
}

// 리뷰 모달을 여는 함수
const review_modal_in = () => {
    const lm_review_modal = document.querySelector('.lm_review_modal');
    const lm_b_review_btn = document.querySelector('.lm_b_review_btn');
    lm_review_modal.style.display = 'flex';
    lm_b_review_btn.innerText = '리뷰끄기'
    lm_b_review_btn.onclick = review_modal_out
}
const review_modal_out = () => {
    const lm_review_modal = document.querySelector('.lm_review_modal');
    const lm_b_review_btn = document.querySelector('.lm_b_review_btn');
    lm_review_modal.style.display = 'none';
    lm_b_review_btn.innerText = "리뷰보기"
    lm_b_review_btn.onclick = review_modal_in
}

// 수정시 몽글 점수를 클릭했을 때
const edit_mongle_grade =(mongle_num) => {
    let mongle_grade;
    for (let i = 0; i< mongle_num+1; i++){
        mongle_grade = document.getElementById('lm_rm_mongle_'+i)
        mongle_grade.classList.remove('mongle_color_filter')
    }
    for (let i =mongle_num+1; i<5; i++){
        mongle_grade = document.getElementById('lm_rm_mongle_'+i)
        mongle_grade.classList.add('mongle_color_filter')
    }
    
}
// 쓰기 버튼을 눌렀을 때
const write_ready = (letter_id) => {
    const lm_review_modal = document.querySelector('.lm_review_modal');
    lm_review_modal.style.display = 'flex';
    let lm_review_modal_html = ``
    lm_review_modal_html += `
    <div class="lm_rm_mongle_grade">몽글 점수 : `
    for (let i = 0; i < 5; i++){
        lm_review_modal_html += `<div id="lm_rm_mongle_${i}" class="lm_rm_mongle_edit" onclick="edit_mongle_grade(${i})"></div>`
    }
    lm_review_modal_html += `</div>
    <textarea placeholder="여기에 리뷰 내용을 작성하시면 됩니다!" class="lm_rm_textarea"></textarea>
    <div class="lm_rm_btn_box">
        <div class="lm_rm_btn" onclick="create_review(${letter_id})">확인</div>
        <div class="lm_rm_bb_white_space"></div>
        <div class="lm_rm_btn" onclick="cancel_relaod()">취소</div>
    </div>`
    lm_review_modal.innerHTML = lm_review_modal_html;
}
// 수정버튼을 눌렀을 때
const edit_ready = (letter_review_id) =>{
    const lm_review_modal = document.querySelector('.lm_review_modal');
    const currunt_content = document.querySelector('.lm_rm_content').innerText;
    let lm_review_modal_html = ``
    lm_review_modal_html += `
    <div class="lm_rm_mongle_grade">몽글 점수 : `
    for (let i = 0; i < 5; i++){
        lm_review_modal_html += `<div id="lm_rm_mongle_${i}" class="lm_rm_mongle_edit" onclick="edit_mongle_grade(${i})"></div>`
    }
    lm_review_modal_html += `</div>
    <textarea class="lm_rm_textarea">${currunt_content}</textarea>
    <div class="lm_rm_btn_box">
        <div class="lm_rm_btn" onclick="edit_review(${letter_review_id})">확인</div>
        <div class="lm_rm_bb_white_space"></div>
        <div class="lm_rm_btn" onclick="cancel_relaod()">취소</div>
    </div>`
    lm_review_modal.innerHTML = lm_review_modal_html;
}
const cancel_relaod = () => {
    location.reload()
}
// 리뷰를 수정하는 api
const edit_review = async(letter_review_id) => {
    let url = new URL(BASE_URL + `my_page/letter_review?letter_review_id=`+letter_review_id);
    let uncolored_mongle_len = document.querySelectorAll('.mongle_color_filter').length;
    let edit_content = document.querySelector('.lm_rm_textarea').value;
    let token = localStorage.getItem('access');
    const result = await fetch(url ,{
        method:'put',
        headers:{
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body:JSON.stringify({
            'grade' : parseInt(MONGLE_LIMIT - uncolored_mongle_len),
            'content' : edit_content
        })
    });
    const response = await result.json()
    switch(result.status){
        case 203:
            alert(response.detail)
            location.replace('/user/my_letter_page.html')
            break;
        default:
            alert(response.detail)
            location.reload()
            break;
    }
}
// 리뷰를 작성하는 api
const create_review = async(letter_id) => {
    let url = new URL(BASE_URL + `my_page/letter_review?letter_id=`+letter_id);
    let uncolored_mongle_len = document.querySelectorAll('.mongle_color_filter').length;
    let review_content = document.querySelector('.lm_rm_textarea').value;
    let token = localStorage.getItem('access');
    const result = await fetch(url ,{
        method:'post',
        headers:{
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body:JSON.stringify({
            'grade' : parseInt(MONGLE_LIMIT - uncolored_mongle_len),
            'content' : review_content
        })
    });
    const response = await result.json()
    switch(result.status){
        case 203:
            alert(response.detail)
            location.replace('/user/my_letter_page.html')
            break;
        default:
            alert(response.detail)
            location.reload()
            break;
    }
}
// 리뷰를 삭제하는 api
const delete_check_modal_wrapper = document.querySelector('.delete_check_modal_wrapper');
const delete_ready = (letter_review_id) => {
    
    delete_check_modal_wrapper.style.display = 'flex';
    const dcm_btn_box = document.querySelector('.dcm_btn_box');
    dcm_btn_box.innerHTML = `<div class="dcm_bb_btn" onclick="delete_review(${letter_review_id})">확인</div>
    <div onclick="cancel_delete_review()" class="dcm_bb_btn cancel">취소</div>`
}
const delete_review = async(letter_review_id) => {
    let url = new URL(BASE_URL + `my_page/letter_review?letter_review_id=`+letter_review_id);
    let token = localStorage.getItem('access');
    const result = await fetch(url ,{
        method:'delete',
        headers:{
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    });
    const response = await result.json()
    switch(result.status){
        case 203:
            alert(response.detail)
            location.replace('/user/my_letter_page.html')
            break;
        default:
            alert(response.detail)
            location.reload()
            break;
    }
}
// 메뉴바 오픈 
const open_drawer = document.querySelector('.open_drawer');
const drawer_wrapper = document.querySelector('.drawer_wrapper');
open_drawer.addEventListener('click', function(){
    drawer_wrapper.classList.toggle("drawer_wrapper_after")
})
drawer_wrapper.addEventListener('click',function(e){
    if(e.target.classList.contains('drawer_wrapper')){
        drawer_wrapper.classList.toggle("drawer_wrapper_after")
    }
})

const cancel_delete_review = () => {
    delete_check_modal_wrapper.style.display = 'none';
}