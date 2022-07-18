const BASE_URL = 'http://127.0.0.1:8000';

window.onload = async function(){
    if (!localStorage.hasOwnProperty('access')) {
        location.replace('/won_test/signin.html')
    }

    token = localStorage.getItem('access');
    const myposts = await fetch(BASE_URL + "/jin/" +"main/",{
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
        profile_grade.innerText = `나의 몽글 점수: ${response.profile_grade}`
        porfile_image.src =`${response.porfile_image}`
}};

function main_modal(){
    document.getElementById('main_modal').style.visibility ='visible';
}
const main = document.getElementById('main_container')
document.querySelector('.main_container').addEventListener('click', function (e) {
    document.getElementById('main_modal').style.visibility ='hidden';
})

function logout() {
    localStorage.clear();
    location.replace('/user/sign_in.html')
}