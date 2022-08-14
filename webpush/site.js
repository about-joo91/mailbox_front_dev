// const BASE_URL = 'http://127.0.0.1:8000';

getInfo().then(response_json => {

    const pushForm = document.getElementById('send-push__form');
    const errorMsg = document.querySelector('.error');

    pushForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const input = this[0];
        const textarea = this[1];
        const button = this[2];
        errorMsg.innerText = '';

        const head = input.value;
        const body = textarea.value;
        // const meta = document.querySelector('meta[name="user_id"]');
        const meta = response_json.user
        console.log(meta)
        const id = meta ? meta : null;
        console.log(id)

        if (head && body && id) {
            button.innerText = 'Sending...';
            button.disabled = true;

            const res = await fetch(`${BASE_URL}/webpush_alarm/test/`, {
                method: 'POST',
                body: JSON.stringify({head, body, id}),
                headers: {
                    'content-type': 'application/json'
                }
            });
            if (res.status === 200) {
                console.log(res)
                button.innerText = 'Send another 😃!';
                button.disabled = false;
                input.value = '';
                textarea.value = '';
            } else {
                errorMsg.innerText = res.message;
                button.innerText = 'Something broke 😢..  Try again?';
                button.disabled = false;
            }
        }
        else {
            let error;
            if (!head || !body){
                error = 'Please ensure you complete the form 🙏🏾'
            }
            else if (!id){
                error = "Are you sure you're logged in? 🤔. Make sure! 👍🏼"
            }
            errorMsg.innerText = error;
        }    
    });


})







