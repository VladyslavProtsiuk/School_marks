var side_bar = document.querySelector(".side_bar")
var container_close = document.querySelector(".container_close")
var icons = document.querySelectorAll(".sugetions_image-cont,.me_avatar,.quit_image")
var sugetions_image = document.querySelector(".sugetions_image")
var me_avatar = document.querySelector(".me_avatar")
let link = window.location.href;
me_avatar.classList.add("sugetions_image-active")
for (var i = 0; i < icons.length; i++) {
    icons[i].classList.add("icon-active")
}

if (link.includes("feedbacks")) {
    document.querySelector(".other_sugetions .sugetions_image-cont").classList.add("sugetions_image-active")
    document.querySelector(".other_sugetions .sugetions_image-cont").classList.add("sugetions_image-cont-act")
}
if (link.includes("dairy") || link.includes("teacher")) {
    document.querySelector(".other_lessons .sugetions_image-cont").classList.add("sugetions_image-active")
    document.querySelector(".other_lessons .sugetions_image-cont").classList.add("sugetions_image-cont-act")
}
if (link.includes("chat")) {
    document.querySelector(".other_chat .sugetions_image-cont").classList.add("sugetions_image-active")
    document.querySelector(".other_chat .sugetions_image-cont").classList.add("sugetions_image-cont-act")
}


side_bar.addEventListener("click", function () {
    side_bar.classList.add("side_bar-active");
    container_close.classList.add("container_close-active")
    document.body.style.overflow = 'hidden';
    sugetions_image.classList.remove("sugetions_image-active")
    me_avatar.classList.remove("sugetions_image-active")
    for (var i = 0; i < icons.length; i++) {
        icons[i].classList.remove("icon-active")
    }
})
container_close.addEventListener("click", function () {
    side_bar.classList.remove("side_bar-active");
    container_close.classList.remove("container_close-active")
    document.body.style.overflow = 'visible';
    me_avatar.classList.add("sugetions_image-active")
    for (var i = 0; i < icons.length; i++) {
        icons[i].classList.add("icon-active")
    }
})