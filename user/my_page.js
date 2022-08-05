const BASE_URL = "http://127.0.0.1:8000/";

const get_cookie = (name) => {
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
let my_profile_desc = '';
let my_profile_name = '';

window.onload = async () => {
    let url = new URL(BASE_URL + 'user/profile');
    let token = localStorage.getItem('access');
    const result = await fetch(url, {
        method: 'get',
        headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
        }
    });
    const response = await result.json();
    switch(result.status){
        case 200:
            my_profile_exist(response)
            break;
        case 401:
            unauthorized(response)
            break;
        default:
            alert(response['detail'])
        }
}
const unauthorized = (response) => {
    alert(response.detail)
    location.replace('/user/signin.html');
}
const my_profile_exist = (response) =>{
    my_profile_desc = response.description;
    my_profile_name = response.fullname;
    let cate_html = ``
    let cate_array = response.categories
    let mongle = response.mongle_grade
    cate_array.forEach(element =>
        cate_html += `<div id="cate_${element.id}" class="category_style">${element.cate_name}</div>`
    )
    const nc_sb_nav = document.querySelector('.nc_sb_nav');
    nc_sb_nav.innerHTML += `
    <p>
    나의 몽글 점수: ${mongle.grade}
    </p>
    <div class ="nc_mongle" style="background-image:url(`+ mongle.mongle +`)"></div>
    <a href="/user/my_page.html"><div class="nc_profile" style="background-image:url(`+ response.profile_img +`)"></div></a>`

    const mpc_c_header = document.querySelector('.mpc_c_header');
    mpc_c_header.innerHTML += `${response.user}님의 프로필`

    const mpc_c_b_u_profile_img_wrapper = document.querySelector('.mpc_c_b_u_profile_img_wrapper');
    mpc_c_b_u_profile_img_wrapper.innerHTML = `<div class="mpc_c_b_u_profile_img" style="background-image:url(`+ response.profile_img +`)"></div>`

    const mpc_c_b_u_rcb_name = document.querySelector('.mpc_c_b_u_rcb_name');
    mpc_c_b_u_rcb_name.innerHTML = `
    <div>${response.fullname}</div>
    <div>${mongle.level}레벨</div>
    `
    const mpc_c_b_u_rcb_category_box = document.querySelector('.mpc_c_b_u_rcb_category_box');
    mpc_c_b_u_rcb_category_box.innerHTML += cate_html + `<div class="category_plus_btn" ontouchstart="add_my_cate_ready()" onclick="add_my_cate_ready()"> + </div>`
    const mpc_c_body_down = document.querySelector('.mpc_c_body_down');
    mpc_c_body_down.innerHTML = response.description +`<span onclick="desc_edit_ready()" class="mpc_c_bd_edit_button">
    수정하기
</span>`
}

const category_box = document.querySelector('.mpc_c_b_u_rcb_category_box');
let second_cnt = 0
category_box.addEventListener('mousedown', (e) => {
    e.preventDefault();
    sec_cnt_interval = setInterval(() => {
        second_cnt++
    }, 10);
})
category_box.addEventListener('mouseup', () => {
    clearInterval(sec_cnt_interval);
    if (second_cnt > 40){
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
            style="top:${cur_top- 15}px; left:${cur_left + cur_width}px" class="category_x_btn" onclick="delete_my_cate(${cate_id})"> x </div>`
        })
        document.body.innerHTML+= category_x_btn;
        second_cnt = 0
    }else{
        second_cnt = 0
    }
})
category_box.addEventListener('touchstart', (e) => {
    e.preventDefault();
    sec_cnt_interval = setInterval(() => {
        second_cnt++
    }, 10);
})
category_box.addEventListener('touchend', () => {
    clearInterval(sec_cnt_interval);
    if (second_cnt > 40){
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
            style="top:${cur_top- 15}px; left:${cur_left + cur_width}px" class="category_x_btn" onclick="delete_my_cate(${cate_id})"> x </div>`
        })
        document.body.innerHTML+= category_x_btn;
        second_cnt = 0
    }else{
        second_cnt = 0
    }
})

// 카테고리를 지우는 함수
const delete_my_cate = async (cate_num) => {
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
    switch(result.status){
        case 200:
            alert(response['detail'])
            location.reload()
            break;
        case 400:
            alert(response['detail'])
            break;
        case 401:
            alert(response['detail'])
            location.replace('/user/signin.html');
            break;
        case 404:
            alert(response['detail'])

    }
}


// 카테고리를 더하는 모달
const add_cate_modal_wrapper = document.querySelector('.add_cate_modal_wrapper');
const add_cate_modal = document.querySelector('.add_cate_modal');
const acm_body = document.querySelector('.acm_body');
const add_my_cate_ready = async () => {
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
        add_cate_modal_wrapper.style.display = 'flex';
    }
    
}

add_cate_modal_wrapper.addEventListener('click',function(e){
    if(e.target.classList.contains('add_cate_modal_wrapper')){
        add_cate_modal_wrapper.style.display = 'none';
    }
})

const add_my_cate = async() => {
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
        alert(response['detail']);
        location.reload();
    }else{
        alert(response)
    }
    
}
// 수정모달
const edit_desc_modal_wrapper = document.querySelector('.edit_desc_modal_wrapper');
const edm_textarea = document.querySelector('.edm_textarea');
const edm_name = document.querySelector('.edm_name');
const desc_edit_ready = () => {
    edm_name.value = my_profile_name;
    edm_textarea.innerText = my_profile_desc;

    edit_desc_modal_wrapper.style.display = 'flex';
}
edit_desc_modal_wrapper.addEventListener('click', function(e){
    if(e.target.classList.contains('edit_desc_modal_wrapper')){
        edit_desc_modal_wrapper.style.display = 'none';
    }
})

const cancel_edit_desc = () => {
    edit_desc_modal_wrapper.style.display = 'none';
}

const call_edit_desc = async() => {
    let description = edm_textarea.value;
    let full_name = edm_name.value;
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
            "fullname" : full_name,
            "description" : description
        })
    });
    let response = await result.json()
    if (result.status == 200){
        alert(response['detail'])
        location.reload()
    }else{
        alert(response)
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

const image_edit_btn = document.querySelector('.image_edit_btn');
const pem_icon = document.querySelector('.pem_icon');
const pem_image_input = document.querySelector('.pem_image_input');
const pem_confim_btn = document.querySelector('.pem_confim_btn');
const profile_edit_modal_wrapper = document.querySelector('.profile_edit_modal_wrapper');

image_edit_btn.addEventListener('click', () => {
    profile_edit_modal_wrapper.style.display = 'flex';
})
profile_edit_modal_wrapper.addEventListener('click', (e) => {

})
pem_icon.addEventListener('click', () => {
    pem_image_input.click();
})
pem_image_input.addEventListener('change', () => {
    const pem_preview_img = document.querySelector('.pem_preview_img');
    const pem_row_box = document.querySelector('.pem_row_box');
    const data = pem_image_input.files[0];
    const mpc_c_b_u_profile_img = document.querySelector('.mpc_c_b_u_profile_img');
    const image_rect = mpc_c_b_u_profile_img.getClientRects()[0];
    const img_width = image_rect.width;
    const img_height = image_rect.height;
    const reader = new FileReader();
    reader.onload = () => {
        pem_row_box.style.display = 'none';
        pem_preview_img.style.backgroundImage = `url(`+ reader.result +`)`
    }
    reader.readAsDataURL(data)
    pem_preview_img.style.width = img_width +"px";
    pem_preview_img.style.height = img_height + "px";
    pem_preview_img.style.marginTop = "40px";
    pem_preview_img.style.display = 'block';
})

pem_confim_btn.addEventListener('click', async() => {
    let token = localStorage.getItem('access');
    form_data = new FormData;
    form_data.append('image', pem_image_input.files[0])
    let url = new URL( BASE_URL + "my_page/profile_img")
    const result = await fetch(url,{
        method: 'post',
        headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization' : `Bearer ${token}`
        },
        body: form_data
    });
    let response = await result.json()
    if (result.status == 200){
        alert(response['detail'])
        location.reload()
    }else{
        alert("파일 업로드에 실패했습니다.")
    }
})

const pem_cancel_btn = document.querySelector('.pem_cancel_btn');
pem_cancel_btn.addEventListener('click', () => {
    const pem_preview_img = document.querySelector('.pem_preview_img');
    const pem_row_box = document.querySelector('.pem_row_box');
    profile_edit_modal_wrapper.style.display = 'none';
    pem_image_input.value = null;
    pem_preview_img.style.display = 'none';
    pem_row_box.style.display = 'block';
    
})