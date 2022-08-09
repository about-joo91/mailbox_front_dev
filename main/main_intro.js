const BASE_URL = 'http://127.0.0.1:8000';

window.onload = async () => {
    if (!localStorage.hasOwnProperty('access')) {
        location.replace('../index.html')
    }

    token = localStorage.getItem('access');
    const myposts = await fetch(BASE_URL + "/main_page/" +"main/",{
        method:'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${token}`,
        }
    })

    let response = await myposts.json()
    if (myposts.status==200){
        const profile_grade = document.getElementById('profile_grade')
        const porfile_image = document.getElementById('profile_image')
        const mongle_image = document.getElementById('mongle_img')
        profile_grade.innerText = `나의 몽글 점수: ${response.main_page_data_and_user_profile.user_profile_data.mongle_grade.grade}`
        porfile_image.style.backgroundImage =`url(${response.main_page_data_and_user_profile.user_profile_data.profile_img})`
        mongle_image.style.backgroundImage = `url(${response.main_page_data_and_user_profile.user_profile_data.mongle_grade.mongle_image})`
}};

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



let main_con = document.querySelector('.main_container')
let main_intro = document.querySelector('.main_intro_con')
let main_intro2 = document.querySelector('.main_intro_con2')
let main_intro3 = document.querySelector('.main_intro_con3')
let main_intro4 = document.querySelector('.main_intro_con4')
let under_btn = document.getElementById("under_btn")
let under_btn2 = document.getElementById("under_btn2")
let under_btn3  = document.getElementById("under_btn3")
let under_btn4  = document.getElementById("under_btn4")
const next_btn = (under_btn,next_con,before_con) => {
    under_btn.addEventListener("click",function(){
        next_con.scrollIntoView();
        next_con.style.display = "flex";
        before_con.style.display = "none";
    })
}

next_btn(under_btn,main_intro,main_con)
next_btn(under_btn2,main_intro2,main_intro)
next_btn(under_btn3,main_intro3,main_intro2)
next_btn(main_con,main_intro,main_con)
next_btn(main_intro,main_intro2,main_intro)
next_btn(main_intro2,main_intro3,main_intro2)
next_btn(main_intro3,main_intro4,main_intro3)

