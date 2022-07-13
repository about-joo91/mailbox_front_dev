
const backend_base_url = "http://127.0.0.1:8000"

async function SignUp(){
    const SignupData = {
        username : document.getElementById("Username").value,
        nickname : document.getElementById("Nickname").value,
        password : document.getElementById("Password").value,
    }

    const regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

    if((SignupData.username == "")|| (SignupData.username.length < 4)){
        alert('아이디는 4자 이상 작성해야 합니다!')
        return false;
    }
    if (SignupData.nickname == ""){
        alert('닉네임을 작성해주세요!')
    }

    if((SignupData.password == "")|| (SignupData.password.length < 8)||(!SignupData.password.match(regExp))){
        alert('비밀번호는 최소 8자 이상, 숫자, 문자 및 특수문자를 포함하여 작성해야 합니다!')
        return false;
    }

    const response = await fetch(`${backend_base_url}/`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-type": "application/json"
        },
        method: "POST",
        mode: 'cors',
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

}


async function SignIn(){
    const SignupData = {
        username : document.getElementById("Username").value,
        password : document.getElementById("Password").value,
    }
    const response = await fetch(`${backend_base_url}/login/`, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-type": "application/json"
        },
        method: "POST",
        mode: 'cors',
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