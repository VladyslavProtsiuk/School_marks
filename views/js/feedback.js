let selection_value = document.querySelector('.selection_value'),
    container = document.querySelector(".container"),
    selection_radio = document.getElementsByName("selection_radio"),
    options_option = document.querySelectorAll(".options_option"),
    selection_checkbox = document.querySelector("#selection_checkbox"),
    bottom_get = document.querySelector(".bottom_get"),
    bottom_add = document.querySelector(".bottom_add"),
    bottom_radio = document.getElementsByName("bottom_radio"),
    bottom_value = document.querySelector(".bottom_value"),
    bottom_value_whome = document.querySelector(".bottom_value-whome"),
    bottom_radio_whome = document.getElementsByName("bottom_radio-whome"),
    options_option_whome = document.querySelectorAll(".options_option-whome"),
    bottom_checkbox_whome = document.querySelector("#bottom_checkbox-whome"),
    add_feedback_checkbox = document.querySelector("#add_feedback-checkbox"),
    container_hide = document.querySelector(".container_hide"),
    footer = document.querySelector(".footer"),
    wrapper_feedbacks = document.querySelector(".wrapper_feedbacks"),
    wrapper_cancel = document.querySelector(".wrapper_cancel"),
    wrapper_confirm = document.querySelector(".wrapper_confirm"),
    bottom_input = document.querySelectorAll(".bottom_input"),
    bottom_textarea = document.querySelector(".bottom_textarea"),
    buttons_radio = document.getElementsByName("buttons_radio"),
    text_bottom = document.querySelectorAll(".text_bottom"),
    gl_feedbacks = "",
    whome_index = 0,
    rate_index = 0,
    filter_rate = 0,
    filter_whome = 0,
    variable_of_html = ''


selection_value.style.justifyContent = "center"

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
}

function generate_html(feedbacks) {
    variable_of_html = ''
    for (let i = 0; i < feedbacks.length; i++) {
        variable_of_html = variable_of_html + `<div class="feedbacks_feedback feedbacks_feedback${i + 1}">
            <div class="feedback_top">
                <div class="top_about-one">
                    <div class="about_avatar"></div>
                    <div class="about_text">
                        <div class="text_top">${feedbacks[i].author}</div>
                        <div class="text_bottom">${feedbacks[i].whome}</div>
                    </div>
                </div>
                <div class="top_rate top_rate-${feedbacks[i].rate}">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>
            </div>
            <div class="feedback_bottom">
                <div class="bottom_text">${feedbacks[i].text}</div>
                <div class="bottom_tools"></div>
            </div>
            </div>`
    }
    wrapper_feedbacks.innerHTML = variable_of_html
}

for (let i = 0; i < buttons_radio.length; i++) {
    buttons_radio[i].addEventListener("change", function (event) {
        filter_whome = +event.target.id.replace("buttons_radio", "");
        let act_group = []
        switch (filter_whome) {
            case 1:
                generate_html(gl_feedbacks)
                break
            case 2:
                for (let v = 0; v < gl_feedbacks.length; v++) {
                    if (gl_feedbacks[v].whome === "Учень") {
                        act_group.push(gl_feedbacks[v])
                    }
                }
                generate_html(act_group)
                break
            case 3:

                for (let b = 0; b < gl_feedbacks.length; b++) {
                    if (gl_feedbacks[b].whome === "Батько учня" || gl_feedbacks[b].whome === "Мати учня") {
                        act_group.push(gl_feedbacks[b])
                    }
                }

                generate_html(act_group)
                break
            case 4:
                for (let n = 0; n < gl_feedbacks.length; n++) {
                    if (gl_feedbacks[n].whome === "Випускник") {
                        act_group.push(gl_feedbacks[n])
                    }
                }
                generate_html(act_group)
                break
        }
    })
}

for (let i = 0; i < selection_radio.length; i++) {
    selection_radio[i].addEventListener("change", function (event) {
        selection_value.style.justifyContent = ""
        filter_rate = +event.target.id.replace("selection_radio", "");
        selection_value.innerHTML = options_option[filter_rate - 1].innerHTML
        selection_checkbox.checked = false
        switch (filter_rate) {
            case 1:
                break
            case 2:
                break
            case 3:
                break
        }
        if (selection_value.innerHTML == "Усі") {
            selection_value.style.justifyContent = "center"
        }
    })
}

for (let i = 0; i < bottom_radio.length; i++) {
    bottom_radio[i].addEventListener("change", function (event) {
        rate_index = +event.target.id.replace("bottom_radio", "")
        bottom_value.innerHTML = options_option[rate_index - 1].innerHTML
        bottom_checkbox.checked = false
    })
}

for (let i = 0; i < bottom_radio_whome.length; i++) {
    bottom_radio_whome[i].addEventListener("change", function (event) {
        whome_index = +event.target.id.replace("bottom_radio", "").replace("-whome", "");
        bottom_value_whome.innerHTML = options_option_whome[whome_index - 1].innerHTML
        bottom_checkbox_whome.checked = false
    })
}

add_feedback_checkbox.addEventListener("change", function (event) {
    if (add_feedback_checkbox.checked) {
        document.body.style.overflow = "hidden"
        container_hide.classList.add("container_hide-active")
    } else {
        container_hide.classList.remove("container_hide-active")
        document.body.style.overflow = ""
    }
})

wrapper_confirm.addEventListener("click", function () {
    let object_to_send = {}
    object_to_send['author'] = bottom_input[0].value + " " + bottom_input[1].value
    switch (whome_index) {
        case 0:
            object_to_send['whome'] = "Учень"
            break
        case 1:
            object_to_send['whome'] = "Батько учня"
            break
        case 2:
            object_to_send['whome'] = "Мати учня"
            break
        case 3:
            object_to_send['whome'] = "Випускник"
            break
    }
    switch (rate_index) {
        case 0:
            object_to_send['rate'] = "5"
            break
        case 1:
            object_to_send['rate'] = "4"
            break
        case 2:
            object_to_send['rate'] = "3"
            break
        case 3:
            object_to_send['rate'] = "2"
            break
        case 4:
            object_to_send['rate'] = "1"
            break
        case 5:
            object_to_send['rate'] = "0"
            break
    }
    object_to_send['text'] = bottom_textarea.value
    bottom_input[0].value = ""
    bottom_input[1].value = ""
    bottom_textarea.value = ""
    options_option_whome[0].click()
    options_option[7].click()
    bottom_checkbox.checked = false
    postData(window.location.href.replace("/feedbacks", "") + "/add_feedback/", object_to_send)
    document.location.reload()
})

wrapper_cancel.addEventListener("click", function () {
    bottom_input[0].value = ""
    bottom_input[1].value = ""
    bottom_textarea.value = ""
    options_option_whome[0].click()
    options_option[7].click()
    whome_index = 0
    rate_index = 0
    add_feedback_checkbox.checked = false
    container_hide.classList.remove("container_hide-active")
    document.body.style.overflow = ""
})

container_hide.addEventListener("click", function () {
    add_feedback_checkbox.checked = false
    container_hide.classList.remove("container_hide-active")
    document.body.style.overflow = ""
})

function makeHttpObject() {
    if ("XMLHttpRequest" in window) return new XMLHttpRequest();
    else if ("ActiveXObject" in window) return new ActiveXObject("Msxml2.XMLHTTP");
}
var request = makeHttpObject();
request.open("GET", "/api/5/", true);
request.send(null);
request.onreadystatechange = function () {
    if (request.readyState == 4) {
        if (request.responseText != "Access denied" && request.responseText != "No feedbacks") {
            gl_feedbacks = JSON.parse(request.responseText);
            if (gl_feedbacks.length < 7) {
                footer.classList.add('footer-fixed')
            }
            generate_html(gl_feedbacks)
        }
    }
}