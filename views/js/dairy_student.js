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
var request = makeHttpObject();
request.open("GET", "http://localhost:3000/api/1/", true);
request.send(null);
request.onreadystatechange = function () {
     if (request.readyState == 4) {
          if (request.responseText != "Access denied" && request.responseText != "No students") {

               students = JSON.parse(request.responseText);
               var group
               var request2 = makeHttpObject();
               request2.open("GET", "http://localhost:3000/api/2/", true);
               request2.send(null);
               request2.onreadystatechange = function () {
                    if (request2.readyState == 4) {
                         group = JSON.parse(request2.responseText);
                         display_marks(group)
                    }
               };
          } else if (request.responseText == "No students") {
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
     document.querySelector(".loading_window").classList.add("window-active");

     document.querySelector(".container").style.overflow = "hidden"



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
});