const BASE_URL = "http://127.0.0.1:8000/";
const urlParams = new URL(document.location).searchParams;
const page_name = urlParams.get('page_name');
let letter_num = 0;
const letter_modal_wrapper = document.querySelector('.letter_modal_wrapper');
if (urlParams.get('letter_num')) {
    letter_num = urlParams.get('letter_num');
    letter_modal_wrapper.style.display = 'flex';
}
window.onload = async () => {
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
    let response = await result.json();
    if (result.status == 200){
        if(!response.is_letter_exist ){
            if (page_name === "my_letter"){
                alert("편지가 아직 없어요 ㅠㅠ 편지를 쓰러 가볼까요?")
                location.href = "/ko_test_worry_board/worry_board_page.html"
            }else{
                alert("편지가 아직 없어요 ㅠㅠ 편지를 받으러 가볼까요?")
                location.href = "/ko_test_worry_board/worry_board_page.html"
            }
            
        }
        const lm_header = document.querySelector('.lm_header');
        const lm_body = document.querySelector('.lm_body');
        const letter_modal = document.querySelector('.letter_modal');
        let letter_cnt = response.letter_cnt
        let letter = response.letter
        lm_header.innerText = letter.title
        let letter_content_html = `<div class="letter_content">
            ${letter.content}
        </div>`
        lm_body.innerHTML = letter_content_html
        let page_cnt = 5
        let start_page = parseInt(letter_num / page_cnt) * page_cnt
        let last_page = start_page + page_cnt
        let limit_page = letter_cnt > last_page ? last_page : letter_cnt;
        let letter_under_page_html = `<div class="lm_b_paging_box">`
        if (start_page > 0){
            letter_under_page_html += `<a href="?page_name=${page_name}&letter_num=${parseInt(start_page)-page_cnt}" class="lm_b_pb_page_num lm_b_pb_page_others"> prev </a>`
        }
        if (letter_num === start_page){
            for (let i = 0; i< limit_page; i++){
                if (letter_num == i){
                    letter_under_page_html += `<div class"lm_b_pb_page_num">${parseInt(letter_num)+1}</div>`
                    continue
                }
                letter_under_page_html += `<a href="?page_name=${page_name}&letter_num=${i}" class="lm_b_pb_page_others lm_b_pb_page_num">${i+1}</a>`
            }
        }else{
            for (let i = start_page; i<limit_page; i++){
                if (letter_num == i){
                    letter_under_page_html += `<div class="lm_b_pb_page_num">${parseInt(letter_num)+1}</div>`
                    continue
                }else{
                    letter_under_page_html += `<a href="?page_name=${page_name}&letter_num=${i}" class="lm_b_pb_page_others lm_b_pb_page_num">${i+1}</a>`
                }
            }
        }
        if (letter_cnt > last_page){
            letter_under_page_html += `<a href="?page_name=${page_name}&letter_num=${parseInt(start_page)+page_cnt}" class="lm_b_pb_page_num lm_b_pb_page_others"> next </a>`
        }
        letter_modal.innerHTML += letter_under_page_html +`</div>`
    }
};
// 메뉴바를 오픈하는 부분
const open_drawer = document.getElementById('open_drawer');
const drawer_wrapper = document.querySelector('.drawer_wrapper');
open_drawer.addEventListener('click', function(){
    drawer_wrapper.classList.toggle("drawer_wrapper_after")
})
drawer_wrapper.addEventListener('click',function(e){
    if(e.target.classList.contains('drawer_wrapper')){
        drawer_wrapper.classList.toggle("drawer_wrapper_after")
    }
})

// 편지 모달을 불러오는 부분

function letter_modal_in(){
    letter_modal_wrapper.style.display = 'flex';
}

letter_modal_wrapper.addEventListener('click', function(e) {
    if(e.target.classList.contains('letter_modal_wrapper')){
        letter_modal_wrapper.style.display = 'none';
    }
})