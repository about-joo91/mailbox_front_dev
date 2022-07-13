const modal_background = document.querySelector('.modal_background');
const small_modal = document.querySelector('.small_modal');

modal_background.addEventListener('click', function (e) {
if (e.target.classList.contains('modal_background')) {
    close_modal()
}
})
function open_modal(){
    document.querySelector('.modal_background').style.display="block"
    document.body.style.overflow = 'hidden';
    console.log(small_modal.clientHeight)
    let modal_top_now = parseInt((window.innerHeight - small_modal.clientHeight) / 2)
    let modal_left_now = parseInt((window.innerWidth - small_modal.clientWidth) / 2)
    const small_modal_body = document.querySelector('.small_modal');
    console.log(modal_top_now)
    small_modal_body.style.left = modal_left_now + "px";
    small_modal_body.style.top = modal_top_now + "px";

}
 function close_modal(){
    document.querySelector('.modal_background').style.display="none"
    document.body.style.overflow = 'auto';
 }