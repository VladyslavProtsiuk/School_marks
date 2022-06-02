var side_bar = document.querySelector(".side_bar")
var container_close = document.querySelector(".container_close")
var icons = document.querySelectorAll(".sugetions_image,.lessons_image,.news_image,.studymaterial_image,.chat_image,.shop_image,.me_avatar,.personaloffice_image,.setting_image,.quit_image")
var sugetions_image = document.querySelector(".sugetions_image")
var me_avatar = document.querySelector(".me_avatar")
sugetions_image.classList.add("sugetions_image-active")
me_avatar.classList.add("sugetions_image-active")
document.querySelector(".bar_wrapper").style.marginLeft = "-10px"
for (var i = 0; i < icons.length; i++) {
    icons[i].classList.add("icon-active")
}


side_bar.addEventListener("click", function () {
    side_bar.classList.add("side_bar-active");
    container_close.classList.add("container_close-active")
    document.body.style.overflow = 'hidden';
    sugetions_image.classList.remove("sugetions_image-active")
    me_avatar.classList.remove("sugetions_image-active")
    document.querySelector(".bar_wrapper").style.marginLeft = "0"
    for (var i = 0; i < icons.length; i++) {
        icons[i].classList.remove("icon-active")
    }
})
container_close.addEventListener("click", function () {
    side_bar.classList.remove("side_bar-active");
    container_close.classList.remove("container_close-active")
    document.body.style.overflow = 'visible';
    sugetions_image.classList.add("sugetions_image-active")
    me_avatar.classList.add("sugetions_image-active")
    document.querySelector(".bar_wrapper").style.marginLeft = "-10px"
    for (var i = 0; i < icons.length; i++) {
        icons[i].classList.add("icon-active")
    }
})