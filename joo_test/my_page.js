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
        const main_profile_container = document.querySelector('.main_profile_container');
        const nc_sb_nav = document.querySelector('.nc_sb_nav');
        nc_sb_nav.innerHTML += `<p>
        나의 몽글 점수: ${response.mongle_grade}
    </p>
    <img class="nc_profile"
        src="${response.profile_img}">`
        main_profile_container.innerHTML += `<div class="mpc_card">
            <div class="mpc_c_header">
                ${response.user}님의 프로필
            </div>
            <div class="mpc_c_body">
                <div class="mpc_c_b_upper">
                    <img src="${response.profile_img}"
                        class="mpc_c_b_u_profile_img">
                    <div class="mpc_c_b_u_right_content_box">
                        <div class="mpc_c_b_u_rcb_edit_button">
                        수정하기
                        </div>
                        <div class="mpc_c_b_u_rcb_name">
                            <div>${response.fullname}</div>
                            <div>${response.mongle_level}레벨</div>
                        </div>
                        <div class="mpc_c_b_u_rcb_category_box">
                            <div class="category_style">일상</div>
                            <div class="category_style">가족</div>
                            <div class="category_style">연애</div>
                            <div class="category_style">연애</div>
                            <div class="category_style">연애</div>
                            <div class="category_style">연애</div>
                            <div class="category_style">연애</div>
                        </div>
                    </div>
                </div>
                <div class="mpc_c_body_down">
                    ${response.description}
                </div>
            </div>
        </div>`
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

