const BASE_URL = 'http://127.0.0.1:8000';

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
    location.replace('/user/signin.html');
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
        for (let i = 0; i < response.order_by_cate_worry_list.length; i++){
            if(response.order_by_cate_worry_list[i].category == 1){
                daily_category.push(response.order_by_cate_worry_list[i])
            }
            else if(response.order_by_cate_worry_list[i].category == 2){
                love_category.push(response.order_by_cate_worry_list[i])
            }
            else if(response.order_by_cate_worry_list[i].category == 3){
                work_category.push(response.order_by_cate_worry_list[i])
            }
            else if(response.order_by_cate_worry_list[i].category == 4){
                family_category.push(response.order_by_cate_worry_list[i])
            }
            else if(response.order_by_cate_worry_list[i].category == 5){
                relation_category.push(response.order_by_cate_worry_list[i])
            }
            else if(response.order_by_cate_worry_list[i].category == 6){
                paernting_category.push(response.order_by_cate_worry_list[i])
            }
            
        }
        for (let i = 0; i < daily_category.length; i++){
            daily_html.innerHTML += 
            `
            <div class="mb_sb_cb_item">
            <a class="worry_link" href="http://127.0.0.1:5500/letter/worry_board_page.html?category=1">
                <div class="mb_sb_cb_item_title">
                    <p>${daily_category[i].create_date}</p>
                </div>
                <p class="mb_sb_cb_item_text">${daily_category[i].content}</p>
                </a>
            </div>
            <div class="mb_sb_cb_item_space"> </div>
            `
        }
        for (let i = 0; i < love_category.length; i++){
            love_html.innerHTML += 
            `
            <div class="mb_sb_cb_item">
                <a class="worry_link" href="http://127.0.0.1:5500/letter/worry_board_page.html?category=2">
                    <div class="mb_sb_cb_item_title">
                        <p>${love_category[i].create_date}</p>
                    </div>
                    <p class="mb_sb_cb_item_text">${love_category[i].content}</P>
                    </div>
                </a>
            `
        }
        for (let i = 0; i < work_category.length; i++){
            work_html.innerHTML += 
            `
            <div class="mb_sb_cb_item">
                <a class="worry_link" href="http://127.0.0.1:5500/letter/worry_board_page.html?category=3">
                    <div class="mb_sb_cb_item_title">
                        <p>${work_category[i].create_date}</p>
                    </div>
                    <p class="mb_sb_cb_item_text">${work_category[i].content}</p>
                </a>
            </div>
            `
        }
        for (let i = 0; i < family_category.length; i++){
            family_html.innerHTML += 
            `
            <div class="mb_sb_cb_item">
            <a class="worry_link" href="http://127.0.0.1:5500/letter/worry_board_page.html?category=4">
                <div class="mb_sb_cb_item_title">
                    <p>${family_category[i].create_date}</p>
                </div>
                <p class="mb_sb_cb_item_text">${family_category[i].content}</P>
                </a>
            </div>
            `
        }
        for (let i = 0; i < relation_category.length; i++){
            relation_html.innerHTML += 
            `
            <div class="mb_sb_cb_item">
                <a class="worry_link" href="http://127.0.0.1:5500/letter/worry_board_page.html?category=5">
                    <div class="mb_sb_cb_item_title">
                        <p>${relation_category[i].create_date}</p>
                    </div>
                    <p class="mb_sb_cb_item_text">${relation_category[i].content}</p>
                </a>
            </div>
            `
        }
        for (let i = 0; i < paernting_category.length; i++){
            paernting_html.innerHTML += 
            `
            <div class="mb_sb_cb_item">
                <a class="worry_link" href="http://127.0.0.1:5500/letter/worry_board_page.html?category=6">
                <div class="mb_sb_cb_item_title">
                    <p>${paernting_category[i].create_date}</p>
                </div>
                <p class="mb_sb_cb_item_text">${paernting_category[i].content}</p>
                </a>
            </div>
            `
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

