// function sundaysInMonth(m, y) {
//     var days = new Date(y, m, 0).getDate();
//     var sundays = [8 - (new Date(m + '/01/' + y).getDay())];
//     for (var i = sundays[0] + 7; i < days; i += 7) {
//         sundays.push(i);
//     }
//     return sundays;
// }

function display_avarage() {
     var marks_marking = document.querySelectorAll(".marks_marking");
     for (var t = 0; t < marks_marking.length; t++) {
          var collection = marks_marking[t].children
          var lines = []
          for (var h = 0; h < collection.length; h++) {
               lines[h] = collection[h]
          }

          var marks

          for (var h = 1; h < lines.length; h++) {
               marks = lines[h].children;
               var summary_0 = 0
               var summary_1 = 0
               var minus_0 = 0;
               var minus_1 = 0
               for (var v = 1; v < marks.length - 2; v++) {

                    if (v % 2 == 1) {
                         if (marks[v].value === "") {
                              minus_1++
                         } else {
                              summary_1 += +marks[v].value
                         }

                    }
                    if (v % 2 == 0) {
                         if (marks[v].value === "") {
                              minus_0++
                         } else {
                              summary_0 += +marks[v].value
                         }
                    }
               }
               var end_avarage_0 = Math.round((summary_0 * 2) / (marks.length - (3 + minus_0)))
               var end_avarage_1 = Math.round((summary_1 * 2) / (marks.length - (3 + minus_1)))

               if (end_avarage_0 != 0) {
                    marks[marks.length - 2].innerText = end_avarage_0
               }
               if (end_avarage_1 != 0) {
                    marks[marks.length - 1].innerText = end_avarage_1
               }

          }
     }
}

function display_marks(my_group) {
     var send = "";
     for (var i = 0; i < 12; i++) {
          send = send + `<div class="marks_marking marks_marking-` + (+i + +1) + `">
         <div class="marking_template">
             <div class="template_student">Прізвище та ім'я учня</div>`

          for (var t = 0; t < my_group.lessons.dates[i].length; t++) {
               send = send + `<div class="template_date template_date` + t + `">` + my_group.lessons.dates[i][t] + `</div>`
          }
          send = send + `<div class="template_avarage">Середнє</div>
         </div>`
          for (var j = 0; j < students.length; j++) {
               send = send + `<div class="marking_line marking_line` + (+j + 1) + `">
             <div class="line_student">` + students[j].second_name + ` ` + students[j].first_name + `  </div>`

               for (var b = 0; b < my_group.lessons.dates[i].length; b++) {

                    for (var n = 0; n < 2; n++) {
                         if (b < students[j].marks[i].length) {
                              send = send + `<input disabled type="text" maxlength="2" value="` + students[j].marks[i][b][n] + `" class="line_date">`
                         } else {
                              send = send + `<input disabled type="text" maxlength="2" value="" class="line_date">`
                         }

                    }
               }
               send = send + `<div class="line_avarage"></div><div class="line_avarage"></div>
                 </div>`

          }
          send = send + "</div>"
          lesson_avarage = 0;
          home_avarage = 0
     }
     document.querySelector(".marks_background").insertAdjacentHTML("afterbegin", send)
}

function display_nothing() {
     var html = `<div class="marking_template">
     <div class="template_student">Прізвище та ім'я учня</div>
     <div class="template_date template_date0"></div>
     <div class="template_date template_date1"></div>
     <div class="template_date template_date2"></div>
     <div class="template_date template_date3"></div>
     <div class="template_date template_date4"></div>
     <div class="template_date template_date5"></div>
     <div class="template_date template_date6"></div>
     <div class="template_date template_date7"></div>
     <div class="template_date template_date8"></div>
     <div class="template_date template_date9"></div>
     <div class="template_avarage">Середнє</div>
     <div class="template_title">Поки що учнів не має</div>
     </div>`
     document.querySelector(".marks_background").insertAdjacentHTML("afterbegin", html)
}

function makeHttpObject() {
     if ("XMLHttpRequest" in window) return new XMLHttpRequest();
     else if ("ActiveXObject" in window) return new ActiveXObject("Msxml2.XMLHTTP");
}
var students = ""
var request1 = makeHttpObject();
request1.open("GET", "http://localhost:3000/api/1/" + window.location.href.replace("http://localhost:3000/dairy/", ""), true);
request1.send(null);
request1.onreadystatechange = function () {
     if (request1.readyState == 4) {
          if (request1.responseText != "Access denied" && request1.responseText != "No students") {

               students = JSON.parse(request1.responseText);
               var group
               var request2 = makeHttpObject();
               request2.open("GET", "http://localhost:3000/api/2/" + window.location.href.replace("http://localhost:3000/dairy/", ""), true);
               request2.send(null);
               request2.onreadystatechange = function () {
                    if (request2.readyState == 4) {
                         group = JSON.parse(request2.responseText);
                         display_marks(group)
                    }
               };
          } else if (request1.responseText == "No students") {
               display_nothing()
          }

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
waitForElm('.marking_template').then(() => {
     display_avarage()
     document.querySelector(".loading_window").classList.add("window-active");
     var fullscreen = false
     var current_state = false;
     const html = `<div class="fakeinput_opacitywindow"
 onclick="document.querySelector('#line_input').click()"></div>
 <div class="fakeinput_plus">+</div>
 <div class="fakeinput_headline">Добавити фото учня 4:3</div>`

     var edited = []

     var line_date = document.querySelectorAll(".line_date")

     document.querySelector(".container").style.overflow = "hidden"

     document.querySelector("#panel_icon1").addEventListener("click", function () {
          if (fullscreen) {
               document.exitFullscreen();
               fullscreen = false
               document.querySelector("#panel_icon1").innerHTML = `<i class="fa-solid fa-expand"></i>`
          } else {
               document.documentElement.requestFullscreen()
               fullscreen = true
               document.querySelector("#panel_icon1").innerHTML = `<i class="fa-solid fa-compress"></i>`
          }

     })


     document.querySelector('#line_input').addEventListener("change", function (event) {
          var [file] = document.querySelector('#line_input').files;
          if (file) {
               document.querySelector(".line_fakeinput").innerHTML = '';
               document.querySelector(".line_fakeinput").style.background = "url(" + URL.createObjectURL(file) + ") center no-repeat"
               document.querySelector(".line_fakeinput").style.backgroundSize = "contain"
          }
     })
     document.querySelector("#show_module").addEventListener("change", changes)

     function changes() {
          if (!document.querySelector("#show_module").checked) {
               document.querySelector("#add_student-shadow").classList.add("container_close-active");
               document.querySelector(".marking_module-add").classList.add("marking_module-active")
          } else {
               document.querySelector("#add_student-shadow").classList.remove("container_close-active");
               document.querySelector(".marking_module-add").classList.remove("marking_module-active")
          }
     }

     document.querySelector("#add_student-shadow").addEventListener("click", function () {
          document.querySelector("#show_module").checked = "false";
          changes()
     })

     document.querySelector(".line_delete").addEventListener("click", function () {
          var input_elem = document.querySelectorAll(".content_line input")
          document.querySelector(".line_fakeinput").style.background = ''
          document.querySelector(".line_fakeinput").innerHTML = html
          for (var i = 0; i < input_elem.length; i++) {
               input_elem[i].value = ""
          }
          document.querySelector("#show_module").checked = "false";
          changes()
     })
     document.querySelector("#hide_panel1").addEventListener("change", function () {
          document.querySelector(".panel_icon4").setAttribute("for", "hide_panel2")
     })
     document.querySelector("#hide_panel2").addEventListener("change", function () {
          document.querySelector(".panel_icon4").setAttribute("for", "hide_panel1")
     })


     document.querySelector("#message").addEventListener("click", function () {
          document.querySelector("#message").classList.remove("message_active")
          document.querySelector("#message").classList.add("message_closed")
          document.cookie = "closed=true"

     })
     document.querySelector(".panel_icon2").addEventListener("click", function () {
          if (!current_state) {
               var cookies = document.cookie;
               cookies.indexOf("closed=")
               console.log(cookies.slice(cookies.indexOf("closed=") + 7, cookies.indexOf("closed=") + 11) != "true")
               if (cookies.slice(cookies.indexOf("closed=") + 7, cookies.indexOf("closed=") + 11) != "true") {
                    document.querySelector("#message").classList.add("message_active")
               }

               document.querySelector(".panel_icon2").querySelector("i").classList.value = "fa-solid fa-floppy-disk"
               editing()
          } else {
               current_state = false;
               document.querySelector(".panel_icon2").querySelector("i").classList.value = "fa-solid fa-pen-to-square"
               saving()
          }

     })


     for (var i = 0; i < line_date.length; i++) {
          line_date[i].addEventListener("change", function (event) {
               if (current_state) {
                    edited.push(event.target)
               }
               if (parseInt(this.value) > 12) {
                    this.value = 12;
               }
               if (parseInt(this.value) < 1) {
                    this.value = 1;
               }
          })
     }

     function editing() {

          current_state = true;
          for (var i = 0; i < line_date.length; i++) {
               line_date[i].disabled = false;
          }

     }

     async function send_data(url, data) {
          const response = await fetch(url, {
               method: 'POST',
               mode: 'cors',
               headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
               },
               body: JSON.stringify(data)
          });
     }

     function saving() {
          for (var i = 0; i < line_date.length; i++) {
               line_date[i].disabled = true;
          }
          display_avarage()
          var edited_info = []
          if (edited.length == 0) {
               for (var g = 0; g < edited.length; g++) {
                    var month_id = edited[g].parentElement.parentElement.classList[1].slice(14) - 1
                    var date_parents = []
                    for (var f = 0; f < edited[g].parentElement.querySelectorAll(".line_date").length; f++) {
                         date_parents[f] = edited[g].parentElement.querySelectorAll(".line_date")[f]
                    }
                    var date_number = Math.round((date_parents.indexOf(edited[g]) - 1) / 2)
                    var lesson
                    if (date_parents.indexOf(edited[g]) % 2 == 1) {
                         lesson = 1
                    } else {
                         lesson = 0
                    }


                    edited_info[g] = {
                         second_name: edited[g].parentElement.querySelector(".line_student").innerText.split(" ")[0],
                         first_name: edited[g].parentElement.querySelector(".line_student").innerText.split(" ")[1],
                         month: month_id,
                         number: date_number,
                         lesson: lesson,
                         mark: edited[g].value
                    }
               }

               send_data("http://localhost:3000/update_marks/", edited_info)

               month_id = -1;
               date_number = -1
               lesson = ""
               date_parents = []
               edited_info = []
               edited = []
          }

     }
});