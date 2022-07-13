
const backend_base_url = "http://127.0.0.1:8000"

async function SignUp(){
    const SignupData = {
        username : document.getElementById("Username").value,
        nickname : document.getElementById("Nickname").value,
        password : document.getElementById("Password").value,
    }
    if (SignupData.username && SignupData.nickname && SignupData.password) {
        const response = await fetch(`${backend_base_url}/won_test/`, {
            headers : {
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(SignupData)
        })

        response_json = await response.json()
        
        if (response.status == 200){
            alert("회원가입 완료!")
            window.location.replace(`signin.html`);
        }else {
            alert("중복되는 아이디나 닉네임이 있습니다.")
            location.reload()
        }

    } else {
        alert("아이디와 닉네임, 패스워드를 모두 작성해주세요!")
    }
    
}


async function SignIn(){
    const SignupData = {
        username : document.getElementById("Username").value,
        password : document.getElementById("Password").value,
    }
    const response = await fetch(`${backend_base_url}/won_test/api/token/`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(SignupData)
    })
    response_json = await response.json()

    if (response.status ==200){
        alert("로그인 완료!")
        localStorage.setItem("access", response_json.access)
        localStorage.setItem("refresh", response_json.refresh)
        window.location.replace(`../jin_test/main_intro.html`);

    }else{
        alert(response.status)
    }
}