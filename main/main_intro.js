const BASE_URL = 'http://127.0.0.1:8000';

window.onload = async function(){
    if (!localStorage.hasOwnProperty('access')) {
        location.replace('/user/signin.html')
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
        profile_grade.innerText = `나의 몽글 점수: ${response.main_page_data_and_user_profile.user_profile_data.grade}`
        porfile_image.style.backgroundImage =`url(${response.main_page_data_and_user_profile.user_profile_data.profile_img})`
        mongle_image.style.backgroundImage = `url(${response.main_page_data_and_user_profile.user_profile_data.mongle_img})`
}};

function main_modal(){
    document.getElementById('drawer').style.display ='flex';
    document.querySelector('.drawer_wrapper').style.display ='flex';
}



document.querySelector('.main_container').addEventListener('click', function (e) {
    if (window.innerWidth <= 1414){
    document.getElementById('drawer').style.display ='none';
    document.querySelector('.drawer_wrapper').style.display ='none';
    }
})

document.querySelector('.nav_container').addEventListener('click', function (e) {
    if (window.innerWidth <= 1414){
        document.getElementById('drawer').style.display ='none';
        document.querySelector('.drawer_wrapper').style.display ='none';
        }
})



