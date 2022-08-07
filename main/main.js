const BASE_URL = 'https://www.api-mongle.shop';
const DAILY_CATEGORY_NUM = 1;
const FAMILY_CATEGORY_NUM = 2;
const LOVE_CATEGORY_NUM = 3;
const RELATION_CATEGORY_NUM = 4;
const WORK_CATEGORY_NUM = 5;
const PARENTING_CATEGORY_NUM = 6;


const  get_cookie = (name)  => {
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

window.onload = async () => {
    token = localStorage.getItem('access');
    const result = await fetch(BASE_URL + "/main_page/" +"main/",{
        method:'get',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${token}`,
        }
    });
    const response = await result.json();

    
const unauthorized = (response) => {
    alert(response.detail)
    location.replace('../index.html');
}
const main_page_data = (response) =>{
        const profile_grade = document.getElementById('profile_grade')
        const porfile_image = document.getElementById('profile_image')
        const mongle_image = document.getElementById('mongle_img')
        profile_grade.innerText = `나의 몽글 점수: ${response.main_page_data_and_user_profile.user_profile_data.grade}`
        porfile_image.style.backgroundImage =`url(${response.main_page_data_and_user_profile.user_profile_data.profile_img})`
        mongle_image.style.backgroundImage = `url(${response.main_page_data_and_user_profile.user_profile_data.mongle_img})`
        const letter_count = document.getElementById('letter_count')
        letter_count.innerText =`# 편지가 ${response.letter_count}개 도착 했습니다`
        const user_rank = document.getElementById('user_rank')
        for ( let rank = 0; rank < response.main_page_data_and_user_profile.rank_list.length; rank++){
            user_rank.innerHTML +=
            `
            <div id="user_rank" class="mb_sb_rk_user">
            <img src="${response.main_page_data_and_user_profile.rank_list[rank].profile_img}">
            ${response.main_page_data_and_user_profile.rank_list[rank].username}님</p>
            </div>
            `     
        };
        const review_rank = document.getElementById('review_rank')
        review_rank.innerHTML == ``
        response.best_review.forEach(function(element) {
            let letter_review_like_id = element.letter_review_like_id
            let content = element.content
            let review_id = element.review_id
            let like_count  =element.like_count
            if (letter_review_like_id== null) {
                sun_icon = 'bi-brightness-high'
                like_onclick = "review_like(" + review_id + ")";
                review_or_like_id = review_id
            } else {
                sun_icon = 'bi-brightness-high-fill'
                like_onclick = "review_like_delete(" + letter_review_like_id + ")";
                review_or_like_id = letter_review_like_id
            }
            review_rank.innerHTML +=
            `
            <div class="mb_sb_rb_rank">
            <div class="mb_sb_rb_iconbox">
            <i class="bi ${sun_icon}" id="bi_brightness_high_${review_or_like_id}" onclick="${like_onclick}"></i>
                <i id="bi_brightness_high_count_${review_or_like_id}" class="mb_sb_rb_count">${like_count}</i>
                <input id="reveiw_status${review_or_like_id}" value="best" class="fake_input"></input>
            </div>
            <div class="mb_sb_rb_textbox">
                <p>${content}</p>
            </div
            `
        })


        const daily_html = document.getElementById('worry_list1')
        const family_html = document.getElementById('worry_list2')
        const love_html = document.getElementById('worry_list3')
        const relation_html = document.getElementById('worry_list4')
        const work_html = document.getElementById('worry_list5')
        const paernting_html = document.getElementById('worry_list6')

        const inner_html_by_category = (js_dom, worry_board, category_num) => {
            js_dom.innerHTML += `
            <div class="mb_sb_cb_item">
            <a class="worry_link" href="/letter/worry_board_page.html?category=${category_num}">
                <div class="mb_sb_cb_item_title">
                    <p>${worry_board.create_date}</p>
                </div>
                <p class="mb_sb_cb_item_text">${worry_board.content}</p>
                </a>
            </div>
            <div class="mb_sb_cb_item_space"> </div>
            `
        }
        for (let i = 0; i < response.order_by_cate_worry_list.length; i++){
            switch(response.order_by_cate_worry_list[i].category){
                case DAILY_CATEGORY_NUM:
                    inner_html_by_category(daily_html, response.order_by_cate_worry_list[i], DAILY_CATEGORY_NUM)
                    break;
                case FAMILY_CATEGORY_NUM:
                    inner_html_by_category(family_html, response.order_by_cate_worry_list[i], FAMILY_CATEGORY_NUM)
                    break;
                case LOVE_CATEGORY_NUM:
                    inner_html_by_category(love_html, response.order_by_cate_worry_list[i], LOVE_CATEGORY_NUM)
                    break;
                case RELATION_CATEGORY_NUM:
                    inner_html_by_category(relation_html, response.order_by_cate_worry_list[i], RELATION_CATEGORY_NUM)
                    break;
                case WORK_CATEGORY_NUM:
                    inner_html_by_category(work_html, response.order_by_cate_worry_list[i], WORK_CATEGORY_NUM)
                    break;
                case PARENTING_CATEGORY_NUM:
                    inner_html_by_category(paernting_html, response.order_by_cate_worry_list[i], PARENTING_CATEGORY_NUM)
                    break;
            }
        }
        }
        switch(result.status){
            case 200:
                main_page_data(response)
                break;
            case 401:
                unauthorized(response)
                break;
            default:
                alert(response['detail'])
            }
    };




const review_like = async(letter_review_like_id) =>{
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/main_page/review_like' + letter_review_like_id, {
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
        const sun = document.getElementById("bi_brightness_high_" + letter_review_like_id)
        const review_status = document.getElementById("reveiw_status" + letter_review_like_id).value
        const sun_count = document.getElementById("bi_brightness_high_count_" + letter_review_like_id)
        sun.classList.replace("bi-brightness-high", "bi-brightness-high-fill");
        if (sun.classList.contains("bi-brightness-high-fill")) {
            sun.classList.replace("bi-brightness-high-fill", "bi-brightness-high");
            sweetAlert({
            text:   res['detail'],
            className: ".sweet-button",
            });
            sun_count.innerText = parseInt(sun_count.innerText) + 1
            const review_live = document.getElementById('review_rank')
            review_live.innerHTML = ""
            if (review_status == "best") {
                fake_start()
                async function fake_start() {
                    const reviews_get = await fetch(BASE_URL + "/main_page/" + "review/like_get", {
                        method: 'GET',
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    let res = await reviews_get.json()
                    res.best_review.forEach(function (element) {
                        let letter_review_like_id = element.letter_review_like_id
                        let content = element.content
                        let review_id = element.review_id
                        let like_count = element.like_count
                        if (letter_review_like_id==null) {
                            sun_icon = 'bi-brightness-high'
                            color_class = 'img_heart_icon'
                            like_onclick = "review_like(" + review_id + ")";
                            review_or_like_id = review_id
            
                        } else {
                            sun_icon = 'bi-brightness-high-fill'
                            like_onclick = "review_like_delete(" + letter_review_like_id + ")";
                            review_or_like_id = letter_review_like_id
                            review_id = letter_review_like_id
                        }
            
                        review_rank.innerHTML +=
                        `
                        <div class="mb_sb_rb_rank">
                        <div class="mb_sb_rb_iconbox">
                        <i class="bi ${sun_icon}" id="bi_brightness_high_${review_or_like_id}" onclick="${like_onclick}"></i>
                            <i id="bi_brightness_high_count_${review_or_like_id}" class="mb_sb_rb_count">${like_count}</i>
                            <input id="reveiw_status${review_or_like_id}" value="best" class="fake_input"></input>
                        </div>
                        <div class="mb_sb_rb_textbox">
                            <p>${content}</p>
                        </div
                        `
                }
                )
            }} else{
                review_status == "live"
                fake_start()
                async function fake_start() {
                    const reviews_get = await fetch(BASE_URL + "/main_page/" + "review/like_get", {
                        method: 'GET',
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,
                            'Authorization': `Bearer ${token}`
                        }
                
                    })
                    let res = await reviews_get.json()
                    res.live_review.forEach(function (element) {
                        let letter_review_like_id = element.letter_review_like_id
                        let content = element.content
                        let review_id = element.review_id
                        let like_count = element.like_count
                        if (letter_review_like_id == null) {
                            sun_icon = 'bi-brightness-high'
                            color_class = 'img_heart_icon'
                            like_onclick = "review_like(" + review_id + ")";
                            review_or_like_id = review_id
            
                        } else {
                            sun_icon = 'bi-brightness-high-fill'
                            like_onclick = "review_like_delete(" + letter_review_like_id + ")";
                            review_or_like_id = letter_review_like_id
                        }
            
                        review_rank.innerHTML +=
                        `
                        <div class="mb_sb_rb_rank">
                        <div class="mb_sb_rb_iconbox">
                        <i class="bi ${sun_icon}" id="bi_brightness_high_${review_or_like_id}" onclick="${like_onclick}"></i>
                            <i id="bi_brightness_high_count_${review_or_like_id}" class="mb_sb_rb_count">${like_count}</i>
                            <input id="reveiw_status${review_or_like_id}" value="best" class="fake_input"></input>
                        </div>
                        <div class="mb_sb_rb_textbox">
                            <p>${content}</p>
                        </div
                        `
                })
            }
        }}
    }
}




const review_like_delete= async(letter_review_like_id) => {
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/main_page/review_like' + letter_review_like_id, {
        method: 'DELETE',
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
        const sun = document.getElementById("bi_brightness_high_" + letter_review_like_id)
        const review_status = document.getElementById("reveiw_status" + letter_review_like_id).value
        const sun_count = document.getElementById("bi_brightness_high_count_" + letter_review_like_id)
        sun.classList.replace("bi-brightness-high", "bi-brightness-high-fill");
        if (sun.classList.contains("bi-brightness-high-fill")) {
            sun.classList.replace("bi-brightness-high-fill", "bi-brightness-high");
            sweetAlert({
                text:   res['detail'],
                className: ".sweet-button",
    
                });
            sun_count.innerText = parseInt(sun_count.innerText) + 1
            const review_live = document.getElementById('review_rank')
            review_live.innerHTML = ""
            if (review_status == "best") {
                fake_start()
                async function fake_start() {
                    const reviews_get = await fetch(BASE_URL + "/main_page/" + "review/like_get", {
                        method: 'GET',
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    let res = await reviews_get.json()
                    res.best_review.forEach(function (element) {
                        let letter_review_like_id = element.letter_review_like_id
                        let content = element.content
                        let review_id = element.review_id
                        let like_count = element.like_count
                        if (letter_review_like_id == null) {
                            sun_icon = 'bi-brightness-high'
                            color_class = 'img_heart_icon'
                            like_onclick = "review_like(" + review_id + ")";
                            review_or_like_id = review_id
            
                        } else {
                            sun_icon = 'bi-brightness-high-fill'
                            like_onclick = "review_like_delete(" + letter_review_like_id + ")";
                            review_or_like_id = letter_review_like_id
                        }
            
                        review_rank.innerHTML +=
                        `
                        <div class="mb_sb_rb_rank">
                        <div class="mb_sb_rb_iconbox">
                        <i class="bi ${sun_icon}" id="bi_brightness_high_${review_or_like_id}" onclick="${like_onclick}"></i>
                            <i id="bi_brightness_high_count_${review_or_like_id}" class="mb_sb_rb_count">${like_count}</i>
                            <input id="reveiw_status${review_or_like_id}" value="best" class="fake_input"></input>
                        </div>
                        <div class="mb_sb_rb_textbox">
                            <p>${content}</p>
                        </div
                        `
                    }
                    )
                }} else{
                    review_status == "live"
                    fake_start()
                    async function fake_start() {
                        const reviews_get = await fetch(BASE_URL + "/main_page/" + "review/like_get", {
                            method: 'GET',
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'X-CSRFToken': csrftoken,
                                'Authorization': `Bearer ${token}`
                            }
                        })
                        let res = await reviews_get.json()
                        res.live_review.forEach(function (element) {
                            let letter_review_like_id = element.letter_review_like_id
                            let content = element.content
                            let review_id = element.review_id
                            let like_count = element.like_count
                            if (letter_review_like_id == null ) {
                                sun_icon = 'bi-brightness-high'
                                color_class = 'img_heart_icon'
                                like_onclick = "review_like(" + review_id + ")";
                                review_or_like_id = review_id
                
                            } else {
                                sun_icon = 'bi-brightness-high-fill'
                                like_onclick = "review_like_delete(" + letter_review_like_id + ")";
                                review_or_like_id = letter_review_like_id
                            }
                
                            review_rank.innerHTML +=
                            `
                            <div class="mb_sb_rb_rank">
                            <div class="mb_sb_rb_iconbox">
                            <i class="bi ${sun_icon}" id="bi_brightness_high_${review_or_like_id}" onclick="${like_onclick}"></i>
                                <i id="bi_brightness_high_count_${review_or_like_id}" class="mb_sb_rb_count">${like_count}</i>
                                <input id="reveiw_status${review_or_like_id}" value="best" class="fake_input"></input>
                            </div>
                            <div class="mb_sb_rb_textbox">
                                <p>${content}</p>
                            </div
                            `
                    })
                }
            }}
        }
    }



const live_review = async() => {
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + "/main_page/" +"main/", {
        method: 'GET',
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
    const review_data = () => {
        const review_live = document.getElementById('review_rank')
        review_live.innerHTML = ``
        res.live_review.forEach(function(element){
            let letter_review_like_id = element.letter_review_like_id
            let content = element.content
            let review_id = element.review_id
            let like_count  =element.like_count
            if (letter_review_like_id == null) {
                sun_icon = 'bi-brightness-high'
                like_onclick = "review_like(" + review_id + ")";
                review_or_like_id = review_id
            } else {
                sun_icon = 'bi-brightness-high-fill'
                like_onclick = "review_like_delete(" + letter_review_like_id + ")";
                review_or_like_id = letter_review_like_id
                review_id = letter_review_like_id
            }

            review_rank.innerHTML +=
            `
            <div class="mb_sb_rb_rank">
            <div class="mb_sb_rb_iconbox">
            <i class="bi ${sun_icon}" id="bi_brightness_high_${review_or_like_id}" onclick="${like_onclick}"></i>
                <i id="bi_brightness_high_count_${review_or_like_id}" class="mb_sb_rb_count">${like_count}</i>
                <input id="reveiw_status${review_or_like_id}" value="best" class="fake_input"></input>
            </div>
            <div class="mb_sb_rb_textbox">
                <p>${content}</p>
            </div
            `
        }
        )
    }
        const unauthorized = (response) => {
        alert(response.detail)
        location.replace('/user/signin.html');
    }
    switch(result.status){
        case 200:
            review_data()
            break;
        case 401:
            unauthorized(response)
            break;
        default:
            alert(response['detail'])
        }
    ;
}

const best_review = async() => {
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + "/main_page/" + "main/", {
        method: 'GET',
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
    const review_data = () => {
        const review_live = document.getElementById('review_rank')
        review_live.innerHTML = ``
        res.best_review.forEach(function (element) {
            let letter_review_like_id = element.letter_review_like_id
            let content = element.content
            let review_id = element.review_id
            let like_count  =element.like_count
            if (letter_review_like_id==null) {
                sun_icon = 'bi-brightness-high'
                color_class = 'img_heart_icon'
                like_onclick = "review_like(" + review_id + ")";
                review_or_like_id = review_id

            } else {
                sun_icon = 'bi-brightness-high-fill'
                like_onclick = "review_like_delete(" + letter_review_like_id + ")";
                review_or_like_id = letter_review_like_id
                review_id = letter_review_like_id
            }

            review_rank.innerHTML +=
            `
            <div class="mb_sb_rb_rank">
            <div class="mb_sb_rb_iconbox">
            <i class="bi ${sun_icon}" id="bi_brightness_high_${review_or_like_id}" onclick="${like_onclick}"></i>
                <i id="bi_brightness_high_count_${review_or_like_id}" class="mb_sb_rb_count">${like_count}</i>
                <input id="reveiw_status${review_or_like_id}" value="best" class="fake_input"></input>
            </div>
            <div class="mb_sb_rb_textbox">
                <p>${content}</p>
            </div
            `
        }
        )
        
    }
    const unauthorized = (response) => {
        alert(response.detail)
        location.replace('/user/signin.html');
    }
    switch(result.status){
        case 200:
            review_data()
            break;
        case 401:
            unauthorized(response)
            break;
        default:
            alert(response['detail'])
        }
    ;
}

const main_modal= () => {
    document.getElementById('drawer').style.display ='flex';
    document.querySelector('.drawer_wrapper').style.display ='flex';
}



document.querySelector('.main_container').addEventListener('click', function (e) {
    if (window.innerWidth <= 930){
    document.getElementById('drawer').style.display ='none';
    document.querySelector('.drawer_wrapper').style.display ='none';
    }
})

document.querySelector('.nav_container').addEventListener('click', function (e) {
    if (window.innerWidth <= 930){
        document.getElementById('drawer').style.display ='none';
        document.querySelector('.drawer_wrapper').style.display ='none';
        }
})

