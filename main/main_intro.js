const BASE_URL = 'https://www.api-mongle.shop';

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



let modal_btn = document.getElementById('modal_btn')
let nav_con = document.querySelector('.nav_container')
let main_con = document.querySelector('.main_container')
let main_intro = document.querySelector('.main_intro_con')
let main_intro2 = document.querySelector('.main_intro_con2')
let main_intro3 = document.querySelector('.main_intro_con3')
let main_intro4 = document.querySelector('.main_intro_con4')
let under_btn = document.getElementById("under_btn")
let under_btn2 = document.getElementById("under_btn2")
let under_btn3  = document.getElementById("under_btn3")
let under_btn4  = document.getElementById("under_btn4")
let intro_text = document.querySelector(".intro_text2")
let intro_text2 = document.querySelector(".intro_text3")
let intro_text3 = document.querySelector(".intro_text4")
const next_btn = (under_btn,next_con,before_con,next_text) => {
    under_btn.addEventListener("click",function(){
        next_con.scrollIntoView();
        next_con.style.display = "flex";
        before_con.style.display = "none";
        if (innerWidth<= 450) {
            next_text.innerText ="스크롤 을 내려주세요!";
        }
    })
}


next_btn(under_btn,main_intro,main_con)
next_btn(under_btn2,main_intro2,main_intro)
next_btn(under_btn3,main_intro3,main_intro2)
next_btn(main_con,main_intro,main_con,intro_text)
next_btn(main_intro,main_intro2,main_intro,intro_text2)
next_btn(main_intro2,main_intro3,main_intro2,intro_text3)
next_btn(main_intro3,main_intro4,main_intro3)

const scroll_event = () => {
    if (document.querySelector('.main_intro_con').scrollTop >= 680)  {
        intro_text.innerText ="화면을 클릭하면 다음페이지로 이동합니다!"
    }
    
}
const scroll_event2 = () => {
    console.log(document.querySelector('.main_intro_con2').scrollTop)
    if (document.querySelector('.main_intro_con2').scrollTop >= 680)  {
        intro_text2.innerText ="화면을 클릭하면 다음페이지로 이동합니다!"
    }
    
}

const scroll_event3 = () => {
    if (document.querySelector('.main_intro_con3').scrollTop >= 350 )  {
        intro_text3.innerText ="화면을 클릭하면 다음페이지로 이동합니다!"
    }
}


document.querySelector('.main_intro_con').onscroll = scroll_event
document.querySelector('.main_intro_con2').onscroll = scroll_event2
document.querySelector('.main_intro_con3').onscroll = scroll_event3