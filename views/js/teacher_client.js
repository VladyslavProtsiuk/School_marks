var wrapper_searchbutton = document.querySelector(".wrapper_searchbutton");
var wrapper_searchengine = document.querySelector(".wrapper_searchengine");
var add_group = document.querySelector(".add_group");
var container_addgroup = document.querySelector(".container_addgroup");
var container_hide = document.querySelector(".container_hide");
var hints_quit = document.querySelector(".hints_quit");
var line_checkbox = document.querySelectorAll(".line_checkbox");
var line_checkbox_checked = document.querySelectorAll(".line_checkbox:checked");
var line_delete = document.querySelector(".line_delete");
var line_confirm = document.querySelector(".line_confirm");
var line_checkbox_label = document.querySelectorAll(
     ".line_checkbox:checked ~ label"
);
var input_fakeinput = document.querySelector(".input_fakeinput");
var dropped_inputs = document.querySelectorAll(".input_dropdown input");
var line_select = document.querySelectorAll(".line_select");
const url = ""


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
     return await response.json();
}

function makeHttpObject() {
     if ("XMLHttpRequest" in window) return new XMLHttpRequest();
     else if ("ActiveXObject" in window) return new ActiveXObject("Msxml2.XMLHTTP");
}

function display_groups() {

     var send = ""

     for (var i = 0; i < results.length; i++) {
          send =
               send +
               `<a href="http://localhost:3000/dairy/${results[i].name}" class="classes_group classes_group` +
               (+i + 1) +
               `">
              <div class="group_image"></div>
              <div class="group_texts">
                  <div class="texts_bookmark"> ` +
               results[i].class +
               ` клас</div>
                  <div class="texts_name">
                      <div class="name_top">Група ` +
               results[i].name +
               `</div>
                      <div class="name_bottom">Модуль: ` +
               results[i].lessons.theme +
               `</div>
                  </div>
              </div>
              </a>`;
     }
     document.querySelector(".content_classes").insertAdjacentHTML("afterbegin", send)
}

var results = ""
var request = makeHttpObject();
request.open("GET", "http://localhost:3000/api/3/0", true);
request.send(null);
request.onreadystatechange = function () {
     if (request.readyState == 4) {
          console.log("Access granted")
          results = JSON.parse(request.responseText);
          if (results.length > 2) {
               var scriptTag = document.createElement('script');
               scriptTag.src = "../js/side_bar-v1.js";
               document.body.appendChild(scriptTag);
          } else {
               var scriptTag = document.createElement('script');
               scriptTag.src = "../js/side_bar-v2.js";
               document.body.appendChild(scriptTag);
          }
          display_groups()

     }
}

function waitForElm(selector) {
     return new Promise(resolve => {
          if (document.querySelector(selector)) {
               return resolve(document.querySelector(selector));
          }

          const observer = new MutationObserver(mutations => {
               if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
               }
          });

          observer.observe(document.body, {
               childList: true,
               subtree: true
          });
     });
}
waitForElm('.classes_group1').then(() => {
     document.querySelector(".container-overflow").classList.remove("container-overflow")
     document.querySelector(".loading_window").classList.add("window-active");
     console.log(document.querySelectorAll(".classes_group").length)
     if (document.querySelectorAll(".classes_group").length <= 3) {
          document.querySelector(".content_classes").classList.add('content_classes-1')
          document.querySelector(".footer").classList.add("footer_absolute")
     }
     if (document.querySelectorAll(".classes_group").length < 7 && document.querySelectorAll(".classes_group").length > 3) {
          document.querySelector(".content_classes").classList.add('content_classes-2')
     }
     document
          .querySelector(".input_dropdown")
          .classList.add("input_dropdown-activated");

     line_delete.addEventListener("click", function () {
          dropped_inputs = document.querySelectorAll(".input_dropdown input");
          for (var i = 0; i < dropped_inputs.length; i++) {
               dropped_inputs[i].checked = false;
          }
          line_select[0].value = "Адаптивна верстка";
          line_select[1].value = "1 клас";
          line_select[2].value = "Юлія Мирославівна";
          document.querySelector(".line_input").value = "";
          check_title();
          needed_to_be();
     })
     wrapper_searchbutton.addEventListener("click", function () {
          wrapper_searchengine.value = "";
     });
     add_group.addEventListener("click", add_groups);
     container_hide.addEventListener("click", needed_to_be);
     hints_quit.addEventListener("click", needed_to_be);
     for (var i = 0; i < line_checkbox.length; i++) {
          line_checkbox[i].addEventListener("change", check_title);
     }
     line_confirm.addEventListener("click", send_group);
     document.addEventListener("click", function (event) {
          if (event.target == document.querySelector("#input_fakeinput")) {
               document
                    .querySelector(".input_dropdown")
                    .classList.toggle("input_dropdown-activated");
          } else if (
               event.target == document.querySelector(".input_dropdown") ||
               event.target == document.querySelector(".dropdown_left") ||
               event.target == document.querySelector(".dropdown_right") ||
               event.target == document.querySelector(".left_line1") ||
               event.target == document.querySelector(".left_line2") ||
               event.target == document.querySelector(".left_line3") ||
               event.target == document.querySelector(".right_line1") ||
               event.target == document.querySelector(".right_line2") ||
               event.target == document.querySelector(".right_line3") ||
               event.target == document.querySelector("#line_checkbox1-left") ||
               event.target == document.querySelector("#line_checkbox2-left") ||
               event.target == document.querySelector("#line_checkbox3-left") ||
               event.target == document.querySelector(".line_day1-left") ||
               event.target == document.querySelector(".line_day2-left") ||
               event.target == document.querySelector(".line_day3-left") ||
               event.target == document.querySelector("#line_checkbox1-right") ||
               event.target == document.querySelector("#line_checkbox2-right") ||
               event.target == document.querySelector("#line_checkbox3-right") ||
               event.target == document.querySelector(".line_day1") ||
               event.target == document.querySelector(".line_day2") ||
               event.target == document.querySelector(".line_day3")
          ) {} else {
               document
                    .querySelector(".input_dropdown")
                    .classList.add("input_dropdown-activated");
          }
     });

     function needed_to_be() {
          document.body.style.overflow = "visible";
          container_hide.classList.remove("container_hide-active");
          container_addgroup.classList.remove("container_addgroup-active");
     }

     function check_title() {
          var top_input_text;
          line_checkbox_checked = document.querySelectorAll(
               ".line_checkbox:checked"
          );
          line_checkbox_label = document.querySelectorAll(
               ".line_checkbox:checked ~ label"
          );
          if (line_checkbox_checked.length > 2) {
               event.target.checked = false;
          }
          if (line_checkbox_checked.length == 2) {
               top_input_text =
                    line_checkbox_label[0].innerText +
                    " - " +
                    line_checkbox_label[1].innerText;
               input_fakeinput.innerText = top_input_text;
               document
                    .querySelector(".input_dropdown")
                    .classList.remove("input_dropdown-activated");
          }
          if (line_checkbox_checked.length == 1) {
               top_input_text = line_checkbox_label[0].innerText;
               input_fakeinput.innerText = top_input_text;
          }
          if (line_checkbox_checked.length == 0) {
               input_fakeinput.innerText = "Виберіть розклад";
          }
     }

     function add_groups() {
          document.body.style.overflow = "hidden";
          container_hide.classList.add("container_hide-active");
          container_addgroup.classList.add("container_addgroup-active");
     }

     function send_group() {
          var letter = {};
          let number = document.querySelector(".line_input").value;
          let classroom = +line_select[1].value.replace(" клас", "");
          let module = line_select[0].value;
          let teacher = line_select[2].value;
          let timetable = input_fakeinput.innerText;

          let time_to_send = timetable.split(" - ")

          if (number.replaceAll(" ", "") == "" || timetable == "Виберіть розклад") {
               alert("Ви повинні ввсети всі дані");
          } else {
               letter["name"] = number;
               letter["class"] = classroom;
               letter["lessons"] = {
                    theme: module,
                    dates: []
               };
               letter["teacher"] = teacher;
               letter["timetable"] = time_to_send;
               postData("/teacher/add_group", letter);
               for (var i = 0; i < dropped_inputs.length; i++) {
                    dropped_inputs[i].checked = false;
               }
               line_select[0].value = "Адаптивна верстка";
               line_select[1].value = "1 клас";
               line_select[2].value = "Юлія Мирославівна";
               document.querySelector(".line_input").value = "";
               check_title();
               needed_to_be();
          }
     }
})