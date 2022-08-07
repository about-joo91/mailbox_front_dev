const BASE_URL = 'http://127.0.0.1:8000';

window.onload = async function(){
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
        console.log(response)
        const profile_grade = document.getElementById('profile_grade')
        const porfile_image = document.getElementById('profile_image')
        const mongle_image = document.getElementById('mongle_img')
        profile_grade.innerText = `나의 몽글 점수: ${response.main_page_data_and_user_profile.user_profile_data.mongle_grade.grade}`
        porfile_image.style.backgroundImage =`url(${response.main_page_data_and_user_profile.user_profile_data.profile_img})`
        mongle_image.style.backgroundImage = `url(${response.main_page_data_and_user_profile.user_profile_data.mongle_grade.mongle_image})`
}};

function main_modal(){
    document.getElementById('drawer').style.display ='flex';
    document.querySelector('.drawer_wrapper').style.display ='flex';
    document.getElementById('modal_btn').style.zIndex = "0";
}



document.querySelector('.main_container').addEventListener('click', function (e) {
    if (window.innerWidth <= 1500){
    document.getElementById('drawer').style.display ='none';
    document.querySelector('.drawer_wrapper').style.display ='none';
    document.getElementById('modal_btn').style.zIndex = "1";
    }
})

document.querySelector('.main_intro_con').addEventListener('click', function (e) {
    if (window.innerWidth <= 1500){
    document.getElementById('drawer').style.display ='none';
    document.querySelector('.drawer_wrapper').style.display ='none';
    document.getElementById('modal_btn').style.zIndex = "1";
    }
})

document.querySelector('.main_intro_con2').addEventListener('click', function (e) {
    if (window.innerWidth <= 1500){
    document.getElementById('drawer').style.display ='none';
    document.querySelector('.drawer_wrapper').style.display ='none';
    document.getElementById('modal_btn').style.zIndex = "1";
    }
})
document.querySelector('.main_intro_con3').addEventListener('click', function (e) {
    if (window.innerWidth <= 1500){
    document.getElementById('drawer').style.display ='none';
    document.querySelector('.drawer_wrapper').style.display ='none';
    document.getElementById('modal_btn').style.zIndex = "1";
    }
})



document.querySelector('.nav_container').addEventListener('click', function (e) {
    if (window.innerWidth <= 1500){
        document.getElementById('drawer').style.display ='none';
        document.querySelector('.drawer_wrapper').style.display ='none';
        document.getElementById('modal_btn').style.zIndex = "1";
        }
})


document.getElementById("under_btn").addEventListener("click",function(){
    document.querySelector('.main_intro_con').scrollIntoView();
    document.querySelector('.main_container').style.display = "none";
    document.querySelector('.main_intro_con').style.display = "flex";
    
});


document.getElementById("under_btn2").addEventListener("click",function(){
    document.querySelector('.main_intro_con2').scrollIntoView();
    document.querySelector('.main_intro_con').style.display = "none";
    document.querySelector('.main_intro_con2').style.display = "flex";

});

document.getElementById("under_btn3").addEventListener("click",function(){
    document.querySelector('.main_intro_con3').scrollIntoView();
    document.querySelector('.main_intro_con2').style.display = "none";
    document.querySelector('.main_intro_con3').style.display = "flex";
});
