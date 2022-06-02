var form_passwd = document.querySelector("#form_passwd")
var line_button = document.querySelector(".line_button-passwd")
var form_submit = document.querySelector(".form_submit")
var form_login = document.querySelector("#form_login")
var form_passwd = document.querySelector("#form_passwd")
var notforget = document.querySelector("#notforget")

line_button.addEventListener("click", function () {
    if (form_passwd.type == "password") {
        form_passwd.type = "text"
    } else {
        form_passwd.type = "password"
    }
})

form_submit.addEventListener("click", async function (event) {
    event.preventDefault();
    var status
    if (notforget.checked) {
        status = true
    } else {
        status = false
    }
    let data = {
        login: form_login.value,
        password: form_passwd.value,
        notforget: status
    }
    let response = await fetch('/logination/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
    let result = await response.json();

    if (result.error != "") {
        alert(result.error);
    }


    eval(result.do)
})