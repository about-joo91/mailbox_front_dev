const BASE_URL = 'http://127.0.0.1:8000';

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
const csrftoken = get_cookie('csrftoken')

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
        const letter_count = document.getElementById('letter_count')
        letter_count.innerText =`편지가 ${response.letter_count}통 도착 했습니다`
        const user_rank = document.getElementById('user_rank')
        for ( let rank = 0; rank < response.rank_list.rank_list.length; rank++){
            user_rank.innerHTML +=
            `
            <div id="user_rank" class="mb_sb_rk_user">
            <img src="${response.rank_list.rank_list[rank].profile_img}">
            ${response.rank_list.rank_list[rank].user} 님
            </div>
            `     
        };
        
        const review_rank = document.getElementById('review_rank')
        response.best_review.forEach(function(element) {
            let is_liked = element.is_liked
            let content = element.content
            let review_id = element.review_id
            let like_count  =element.like_count
            if (is_liked==true) {
                sun_icon = 'bi-brightness-high-fill'
            } else {
                sun_icon = 'bi-brightness-high'
                color_class = 'img_heart_icon'
            }
            review_rank.innerHTML +=
            `
            <div class="mb_sb_rb_rank">
            <div class="mb_sb_rb_iconbox">
            <i class="bi ${sun_icon}" id="bi_brightness_high_${review_id}" onclick="review_like(${review_id})"></i>
                <i class="mb_sb_rb_count">${like_count}</i>
            </div>
            <div class="mb_sb_rb_textbox">
                <p>${content}</p>
            </div
            `
        })

        const review_live = document.getElementById('review_live')
        response.live_review.forEach(function(element){
            let is_liked = element.is_liked
            let live_content = element.content
            let review_id = element.review_id
            let like_count  =element.like_count
            if (is_liked==true) {
                sun_icon = 'bi-brightness-high-fill'
            } else {
                sun_icon = 'bi-brightness-high'
                color_class = 'img_heart_icon'
            }
            review_live.innerHTML += `
            <div class="mb_sb_rb_live">
                <div class="mb_sb_rb_livebox">
                    <i class="bi ${sun_icon}" id="bi_brightness_high_${review_id}" onclick="review_like(${review_id})"></i>
                    <i class="mb_sb_rb_count">${like_count}</i>
                </div>
                <div class="mb_sb_rb_livetext">
                    <p>${live_content}</p>
                </div>
            </div>
            `
        }
        )

        let daily_category = []
        let love_category =[]
        let work_category =[]
        let family_category =[]
        let relation_category =[]
        let paernting_category=[]

        const daily_html = document.getElementById('worry_list1')
        const love_html = document.getElementById('worry_list2')
        const work_html = document.getElementById('worry_list3')
        const family_html = document.getElementById('worry_list4')
        const relation_html = document.getElementById('worry_list5')
        const paernting_html = document.getElementById('worry_list6')
        for (let i = 0; i < response.worry_list.length; i++){
            if(response.worry_list[i].category == 1){
                daily_category.push(response.worry_list[i])
            }
            else if(response.worry_list[i].category == 2){
                love_category.push(response.worry_list[i])
            }
            else if(response.worry_list[i].category == 3){
                work_category.push(response.worry_list[i])
            }
            else if(response.worry_list[i].category == 4){
                family_category.push(response.worry_list[i])
            }
            else if(response.worry_list[i].category == 5){
                relation_category.push(response.worry_list[i])
            }
            else if(response.worry_list[i].category == 6){
                paernting_category.push(response.worry_list[i])
            }
            
        }
        for (let i = 0; i < daily_category.length; i++){
            daily_html.innerHTML += 
            `
            <a class="worry_link" href="http://127.0.0.1:5500/ko_test_worry_board/worry_board_page.html">
            <div class="mb_sb_cb_item">
                <div class="mb_sb_cb_item_title">
                    <span>안녕하세요 저는 이런고민이 있어요</span>
                    <p>${daily_category[i].create_date}</p>
                </div>
                <div class="mb_sb_cb_item_line">
                </div>
                <p class="mb_sb_cb_item_text">${daily_category[i].content}</p>
            </div>
            </a>
            `
        }
        for (let i = 0; i < love_category.length; i++){
            love_html.innerHTML += 
            `
            <a class="worry_link" href="http://127.0.0.1:5500/ko_test_worry_board/worry_board_page.html">
            <div class="mb_sb_cb_item">
                <div class="mb_sb_cb_item_title">
                    <span>안녕하세요 저는 이런고민이 있어요</span>
                    <p>${love_category[i].create_date}</p>
                </div>
                <div class="mb_sb_cb_item_line">
                </div>
                <p class="mb_sb_cb_item_text">${love_category[i].content}</P>
            </div>
            <a>
            `
        }
        for (let i = 0; i < work_category.length; i++){
            work_html.innerHTML += 
            `
            <a class="worry_link" href="http://127.0.0.1:5500/ko_test_worry_board/worry_board_page.html">
            <div class="mb_sb_cb_item">
                <div class="mb_sb_cb_item_title">
                    <span>안녕하세요 저는 이런고민이 있어요</span>
                    <p>${work_category[i].create_date}</p>
                </div>
                <div class="mb_sb_cb_item_line">
                </div>
                <p class="mb_sb_cb_item_text">${work_category[i].content}</p>
            </div>
            </a>
            `
        }
        for (let i = 0; i < family_category.length; i++){
            family_html.innerHTML += 
            `
            <a class="worry_link" href="http://127.0.0.1:5500/ko_test_worry_board/worry_board_page.html">
            <div class="mb_sb_cb_item">
                <div class="mb_sb_cb_item_title">
                    <span>안녕하세요 저는 이런고민이 있어요</span>
                    <p>${family_category[i].create_date}</p>
                </div>
                <div class="mb_sb_cb_item_line">
                </div>
                <p class="mb_sb_cb_item_text">${family_category[i].content}</P>
            </div>
            </a>
            `
        }
        for (let i = 0; i < relation_category.length; i++){
            relation_html.innerHTML += 
            `
            <a class="worry_link" href="http://127.0.0.1:5500/ko_test_worry_board/worry_board_page.html">
            <div class="mb_sb_cb_item">
                <div class="mb_sb_cb_item_title">
                    <span>안녕하세요 저는 이런고민이 있어요</span>
                    <p>${relation_category[i].create_date}</p>
                </div>
                <div class="mb_sb_cb_item_line">
                </div>
                <p class="mb_sb_cb_item_text">${relation_category[i].content}</p>
            </div>
            </a>
            `
        }
        for (let i = 0; i < paernting_category.length; i++){
            paernting_html.innerHTML += 
            `
            <a class="worry_link" href="http://127.0.0.1:5500/ko_test_worry_board/worry_board_page.html">
            <div class="mb_sb_cb_item">
                <div class="mb_sb_cb_item_title">
                    <span>안녕하세요 저는 이런고민이 있어요</span>
                    <p>${paernting_category[i].create_date}</p>
                </div>
                <div class="mb_sb_cb_item_line">
                </div>
                <p class="mb_sb_cb_item_text">${paernting_category[i].content}</p>
            </div>
            </a>
            `
        }
    };
};



async function review_like(review_id){
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/jin/review_like' + review_id , {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Bearer ${token}`
        },
    })
    let res = await result.json()
    if (result.status == 200) {
        const sun = document.getElementById("bi_brightness_high_"+ review_id)
        if(sun.classList.contains("bi-brightness-high-fill")){
            sun.classList.replace("bi-brightness-high-fill", "bi-brightness-high");
            alert(res['message'])
        }
        else{
            sun.classList.replace("bi-brightness-high", "bi-brightness-high-fill");
            alert(res['message'])
            }
        window.location.reload()
    }
}

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