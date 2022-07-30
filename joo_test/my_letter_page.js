const BASE_URL = "http://127.0.0.1:8000/";
const urlParams = new URL(document.location).searchParams;
let page_name = "my_letter"
page_name = urlParams.get('page_name');
let letter_num = 0;
const letter_modal_wrapper = document.querySelector('.letter_modal_wrapper');
const letter_modal = document.querySelector('.letter_modal');
const lm_body = document.querySelector('.lm_body');
if (urlParams.get('letter_num')) {
    letter_num = urlParams.get('letter_num');
    letter_modal_wrapper.style.display = 'flex';
}


const onload_page = async () => {
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
    location.replace('/joo_test/my_letter_page.html?page_name=my_not_read_letter')
}
const default_page = (response) => {
    const lm_header = document.querySelector('.lm_header');
    const lm_body = document.querySelector('.lm_body');
    const nc_sb_nav = document.querySelector('.nc_sb_nav');
    nc_sb_nav.innerHTML += `<p>
    나의 몽글 점수: ${response.monglegrade.grade}
    </p>
    <div class ="nc_mongle" style="background-image:url(`+response.monglegrade.mongle +`)"></div>
    <div class="nc_profile" style="background-image:url(`+ response.profile_img +`)"><div>`

    lm_header.innerText = `안녕하세요 ${response.nickname}님 몽글을 찾아주셔서 감사합니다.`
    lm_body.innerText = `
     죄송합니다. 예상치 못한 문제가 발생하여 편지를 불러올 수가 없습니다. 
    
    다른 페이지로 이동 후 다시 시도를 해보시는게 어떨까요?
    
    그래도 계속 이 페이지가 보이신다면 거듭 사과의 말씀드리며 불편하시겠지만 의견 남겨주시면 빠르게 오류를 고치도록 하겠습니다.`
}
const unauthorized = (response) => {
    alert(response.detail)
    location.replace('/won_test/signin.html');
}
const letters_not_exist = (response) => {
    if (page_name === "my_not_read_letter"){
        location.replace('/joo_test/my_letter_page.html?page_name=my_recieved_letter')
    }else{
        alert(response['detail'])
        location.href = '/ko_test_worry_board/worry_board_page.html'
    }
    
}
const lm_new_letter_box = document.querySelector('.lm_new_letter_box');
const lm_whole_letter_box = document.querySelector('.lm_whole_letter_box');
const push_new_letter_button = (response) => {
    lm_new_letter_box.innerHTML = `<i class="fa-solid fa-exclamation new_letter_icon" onclick="get_letter_by_params('my_not_read_letter')"></i>
    <div class="lm_bubble">${response.not_read_letter_cnt}개의 읽지않은 편지가 있습니다.</div>`;
}
const push_before_buttn = () => {
    lm_whole_letter_box.innerHTML = `<i class="fa-solid fa-arrow-left whole_letter_icon" onclick="get_letter_by_params('my_recieved_letter')"></i>`
}
const letters_exist = (response) => {
    page_name = urlParams.get("page_name");
    const lm_header = document.querySelector('.lm_header');
    const lm_body = document.querySelector('.lm_body');
    const nc_sb_nav = document.querySelector('.nc_sb_nav');
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
            push_before_buttn();
            break;
        case "my_recieved_letter":
            user_info = response.letter.received_user
            if (is_read_letter_exists) push_new_letter_button(response)
            break;
        default:
            user_info = response.letter.received_user
            break;
    }
    nc_sb_nav.innerHTML = `
    <p>
    나의 몽글 점수: ${user_info.monglegrade.grade}
    </p>
    <div class ="nc_mongle" style="background-image:url(`+user_info.monglegrade.mongle +`)"></div>
    <div class="nc_profile" style="background-image:url(`+ user_info.profile_img +`)"><div>`
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
}

letter_modal_wrapper.addEventListener('click', (e) => {
    if(e.target.classList.contains('letter_modal_wrapper')){
        letter_modal_wrapper.style.display = 'none';
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
// 메뉴바를 오픈하는 부분 추후에 media 쿼리 때 쓸 예정
// const open_drawer = document.getElementById('open_drawer');
// const drawer_wrapper = document.querySelector('.drawer_wrapper');
// open_drawer.addEventListener('click', function(){
//     drawer_wrapper.classList.toggle("drawer_wrapper_after")
// })
// drawer_wrapper.addEventListener('click',function(e){
//     if(e.target.classList.contains('drawer_wrapper')){
//         drawer_wrapper.classList.toggle("drawer_wrapper_after")
//     }
// })
