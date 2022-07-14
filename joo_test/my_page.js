const BASE_URL = "http://127.0.0.1:8000/";

window.onload = async function () {
    url = new URL(BASE_URL + 'user/profile');
    token = localStorage.getItem('access');
    const result = await fetch(url, {
        method: 'GET',
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
        mpc_c_b_u_rcb_category_box.innerHTML += cate_html + `<div class="category_plus_btn"> + </div>`
        const mpc_c_body_down = document.querySelector('.mpc_c_body_down');
        mpc_c_body_down.innerHTML = response.description
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
        category_style.forEach(element => {
            let cate_id = element.id.split('_')[1]
            let offset = element.getBoundingClientRect()
            let cur_top = offset.top;
            let cur_left = offset.left
            category_x_btn += `<div id="category_x_btn_${cate_id}" 
            style="position:absolute;top:${cur_top -30}px;
            eft:${cur_left + 50}px"> x </div>`
        })
        category_box.innerHTML+= category_x_btn;
        second_cnt = 0
    }else{
        second_cnt = 0
    }
})