const BASE_URL = "http://127.0.0.1:8000/";

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
const csrftoken = get_cookie('csrftoken');

window.onload = async function () {
    url = new URL(BASE_URL + 'user/profile');
    token = localStorage.getItem('access');
    const result = await fetch(url, {
        method: 'get',
        headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
        }
    });
    let response = await result.json();
    if (result.status == 200){
        let cate_html = ``
        let cate_array = response.categories
        cate_array.forEach(element =>
            cate_html += `<div id="cate_${element.id}" class="category_style">${element.cate_name}</div>`
        )
        const main_profile_container = document.querySelector('.main_profile_container');
        const nc_sb_nav = document.querySelector('.nc_sb_nav');
        nc_sb_nav.innerHTML += `<p>
        나의 몽글 점수: ${response.mongle_grade}
    </p>
    <img class ="nc_mongle"src="/mongle.jpeg">
    <img class="nc_profile"
        src="${response.profile_img}">`

        const mpc_c_header = document.querySelector('.mpc_c_header');
        mpc_c_header.innerHTML += `${response.user}님의 프로필`

        const mpc_c_b_u_profile_img = document.querySelector('.mpc_c_b_u_profile_img');
        mpc_c_b_u_profile_img.src = response.profile_img

        const mpc_c_b_u_rcb_name = document.querySelector('.mpc_c_b_u_rcb_name');
        mpc_c_b_u_rcb_name.innerHTML = `
        <div>${response.fullname}</div>
        <div>${response.mongle_level}레벨</div>
        `
        const mpc_c_b_u_rcb_category_box = document.querySelector('.mpc_c_b_u_rcb_category_box');
        mpc_c_b_u_rcb_category_box.innerHTML += cate_html + `<div class="category_plus_btn" onclick="add_my_cate_ready(this)"> + </div>`
        const mpc_c_body_down = document.querySelector('.mpc_c_body_down');
        mpc_c_body_down.innerHTML = response.description +`<span onclick="desc_edit_ready()" class="mpc_c_bd_edit_button">
        수정하기
    </span>`
    }
}

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

const category_box = document.querySelector('.mpc_c_b_u_rcb_category_box');
let second_cnt = 0
category_box.addEventListener('mousedown', function(e) {
    e.preventDefault();
    sec_cnt_interval = setInterval(() => {
        second_cnt++
    }, 10);
})
category_box.addEventListener('mouseup', function(){
    clearInterval(sec_cnt_interval);
    if (second_cnt > 60){
        const category_style = document.querySelectorAll('.category_style');
        let category_x_btn = ``
        let cur_left=0
        let cur_top=0
        let cur_width=0
        category_style.forEach(element => {
            let cate_id = element.id.split('_')[1]
            let offset = element.getBoundingClientRect()
            cur_top = offset.top;
            cur_left = offset.left;
            cur_width = offset.width;
            category_x_btn += `<div id="category_x_btn_${cate_id}" 
            style="position:absolute;top:${cur_top-20}px;
            left:${cur_left + cur_width -10}px" class="category_x_btn" onclick="delete_my_cate(${cate_id})"> x </div>`
        })
        category_box.innerHTML+= category_x_btn;
        second_cnt = 0
    }else{
        second_cnt = 0
    }
})
async function delete_my_cate(cate_num){
    url = new URL(BASE_URL + 'user/profile/category/' + cate_num);
    token = localStorage.getItem('access');
    const result = await fetch(url, {
        method: 'delete',
        headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
        }
    });
    let response = await result.json();
    if (result.status == 200){
        alert(response.message)
        location.reload()
    }else{
        alert("삭제하는데 실패했습니다.")
    }
    
}
const add_cate_modal_wrapper = document.querySelector('.add_cate_modal_wrapper');
const add_cate_modal = document.querySelector('.add_cate_modal');
const acm_body = document.querySelector('.acm_body');
async function add_my_cate_ready(element){
    let url = new URL(BASE_URL + 'user/profile/category')
    let token = localStorage.getItem('access');
    const result = await fetch(url,{
        method: 'get',
        headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
        }
    });
    let response = await result.json()
    if (result.status == 200){
        let add_cate_html = ``
        response.forEach(item =>{
            add_cate_html += `<option class="category_option" value="${item.id}">${item.cate_name}</option>`
        })
        acm_body.innerHTML = add_cate_html
    }
    this_el_rect = element.getBoundingClientRect()
    let modal_left = this_el_rect.left + this_el_rect.width
    let modal_top = this_el_rect.top
    add_cate_modal_wrapper.style.display = 'block';
    add_cate_modal.style.position = 'absolute';
    add_cate_modal.style.left = modal_left +'px';
    add_cate_modal.style.top = modal_top +'px';
}

add_cate_modal_wrapper.addEventListener('click',function(e){
    if(e.target.classList.contains('add_cate_modal_wrapper')){
        add_cate_modal_wrapper.style.display = 'none';
    }
})

async function add_my_cate(){
    let selected = Array.from(acm_body.options).filter(function (option) {
        return option.selected;
    }).map(function (option) {
        return option.value;
    })
    let url = new URL(BASE_URL + 'user/profile/category/')
    let token = localStorage.getItem('access');
    const result = await fetch(url,{
        method: 'post',
        headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            "categories" : selected
        })
    });
    let response = await result.json()
    if (result.status == 200){
        let add_cate_html = ``
        Array.from(response).forEach(item =>{
            add_cate_html += `<option class="category_option" value="${item.id}">${item.cate_name}</option>`
        })
        acm_body.innerHTML = add_cate_html;
        alert(response.message);
        location.reload();
    }else{
        alert(response)
    }
    
}

const edit_desc_modal_wrapper = document.querySelector('.edit_desc_modal_wrapper');
const edm_textarea = document.querySelector('.edm_textarea');
function desc_edit_ready(){
    edit_desc_modal_wrapper.style.display = 'block';
}
edit_desc_modal_wrapper.addEventListener('click', function(e){
    if(e.target.classList.contains('edit_desc_modal_wrapper')){
        edm_textarea.value = '';
        edit_desc_modal_wrapper.style.display = 'none';
    }
})

function cancel_edit_desc(){
    edm_textarea.value = '';
    edit_desc_modal_wrapper.style.display = 'none';
}

async function call_edit_desc(){
    let description = edm_textarea.value;
    let url = new URL(BASE_URL + 'user/profile')
    let token = localStorage.getItem('access');
    const result = await fetch(url,{
        method: 'put',
        headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            "description" : description
        })
    });
    let response = await result.json()
    if (result.status == 200){
        alert(response.message)
        location.reload()
    }else{
        alert(response)
    }
}