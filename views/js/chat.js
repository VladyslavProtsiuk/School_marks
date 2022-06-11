let socket = io(),
     form = document.querySelector(".chat_type"),
     input = document.querySelector(".write_message"),
     chat_messages = document.querySelector('.chat_messages'),
     message_drag = document.querySelector(".message_drag"),
     container_chat = document.querySelector(".container_chat"),
     title_close_collection = document.querySelectorAll(".title_close"),
     type_send = document.querySelector(".type_send"),
     addfile_input = document.querySelector("#addfile_input"),
     message_files = document.querySelector(".message_files"),
     files_file = document.querySelectorAll(".files_file"),
     files_to_send = [],
     title_close = [],
     html = `<img src="../img/image28.png" class="content_image">`,
     first_scroll_height = input.scrollHeight,
     second_scroll_height,
     first_made = false,
     second_made = false,
     keep_bottom = true

function padTo2Digits(num) {
     return String(num).padStart(2, '0');
}

function getCookie(name) {
     let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
     ));
     return matches ? decodeURIComponent(matches[1]) : undefined;
}

function send_message() {
     let user = getCookie("user_id")

     if (input.value && input.value.replaceAll("\n", "").replaceAll(" ", "").length != 0) {
          let time = Date.now(),
               real_time = new Date(),
               hours = real_time.getHours(),
               minutes = real_time.getMinutes(),
               to_send_file = [];
          console.log(files_to_send)
          if (files_to_send.length != 0) {
               for (let y = 0; y < files_to_send.length; y++) {
                    to_send_file.push({
                         file: files_to_send[y],
                         filename: files_to_send[y].name,
                         filetype: files_to_send[y].type.split("/")[1],
                         filepurpose: files_to_send[y].type.split("/")[0],
                    })
               }
               to_send = {
                    user_id: user,
                    message: input.value,
                    time: time,
                    cookie_time: getCookie("time"),
                    time_for_msg: padTo2Digits(hours) + ":" + padTo2Digits(minutes),
                    chat_id: "62a2fd02deeb447a12c704b0",
                    files: to_send_file
               }

          } else {
               to_send = {
                    user_id: user,
                    message: input.value,
                    time: time,
                    cookie_time: getCookie("time"),
                    chat_id: "62a2fd02deeb447a12c704b0",
                    time_for_msg: padTo2Digits(hours) + ":" + padTo2Digits(minutes)
               }
          }
          socket.emit('chat message', to_send);
          input.value = ''
     }
     files_to_send = []
     add_content_to_files()
     input.style.height = "auto";
     input.style.height = (input.scrollHeight) + "px";
     form.style.height = (input.scrollHeight + 9) + "px"
}

function add_content_to_files() {
     if (files_to_send.length < 5) {
          for (let i = 0; i < files_to_send.length; i++) {
               files_file[i].querySelector(".title_text").innerText = files_to_send[i].name.slice(0, 17) + "..."
               files_file[i].classList.add("files_file-active")
               if (files_to_send[i].type.split("/")[0] == "image") {
                    files_file[i].querySelector(".file_content").innerHTML = "";
                    files_file[i].querySelector(".file_content").classList.add("file_content-active")
                    let binary_data = [];
                    binary_data.push(files_to_send[i]);
                    let url_image = window.URL.createObjectURL(new Blob(binary_data, {
                         type: "application/zip"
                    }))
                    files_file[i].querySelector(".file_content").style.background = `url(${url_image})`
               }
          }
          for (let i = 0; i < files_to_send.length; i++) {
               files_file[i].querySelector(".title_text").innerText = files_to_send[i].name.slice(0, 17) + "..."
               files_file[i].classList.add("files_file-active")
               if (files_to_send[i].type.split("/")[0] == "image") {
                    files_file[i].querySelector(".file_content").innerHTML = "";
                    files_file[i].querySelector(".file_content").classList.add("file_content-active")
                    let binary_data = [];
                    binary_data.push(files_to_send[i]);
                    let url_image = window.URL.createObjectURL(new Blob(binary_data, {
                         type: "application/zip"
                    }))
                    files_file[i].querySelector(".file_content").style.background = `url(${url_image})`
               }
          }
          switch (files_to_send.length) {
               case 0:
                    for (let g = 0; g < 4; g++) {
                         files_file[g].querySelector(".title_text").innerText = ""
                         files_file[g].querySelector(".file_content").innerHTML = html;
                         files_file[g].classList.remove("files_file-active")
                         addfile_input.value = null
                    }
                    break

               case 1:
                    for (let g = 1; g < 4; g++) {
                         files_file[g].querySelector(".title_text").innerText = ""
                         files_file[g].querySelector(".file_content").innerHTML = html;
                         files_file[g].classList.remove("files_file-active")
                    }
                    break
               case 2:
                    for (let g = 2; g < 4; g++) {
                         files_file[g].querySelector(".title_text").innerText = ""
                         files_file[g].querySelector(".file_content").innerHTML = html;
                         files_file[g].classList.remove("files_file-active")
                    }
                    break
               case 3:
                    for (let g = 3; g < 4; g++) {
                         files_file[g].querySelector(".title_text").innerText = ""
                         files_file[g].querySelector(".file_content").innerHTML = html;
                         files_file[g].classList.remove("files_file-active")
                    }
                    break
          }
     } else {
          files_file[3].querySelector(".file_content").style.background = ""
          files_file[3].querySelector(".content_image").src = "../img/image29.png"
          files_file[3].querySelector(".title_text").innerText = (files_to_send.length - 3) + " файлів"
          files_file[3].classList.add("files_file-active")
          for (let b = 0; b < 3; b++) {
               files_file[b].querySelector(".title_text").innerText = files_to_send[b].name.slice(0, 17) + "..."
               files_file[b].classList.add("files_file-active")

               if (files_to_send[b].type.split("/")[0] == "image") {
                    files_file[b].querySelector(".file_content").innerHTML = "";
                    files_file[b].querySelector(".file_content").classList.add("file_content-active")
                    var url_image = URL.createObjectURL(files_to_send[b])
                    files_file[b].querySelector(".file_content").style.background = `url(${url_image})`
               }
          }
     }

}

addfile_input.addEventListener("input", function () {
     for (let i = 0; i < addfile_input.files.length; i++) {
          files_to_send[i] = addfile_input.files[i]
     }
     console.log("asd")
     add_content_to_files()
})

input.addEventListener("keydown", function (event) {

     if (event.keyCode == 13 && !event.shiftKey) {
          event.preventDefault()
          send_message()
     }
     if (event.keyCode == 13 && event.shiftKey) {
          input.innerText = input.value + '\n'
     }
})

input.addEventListener("input", function (event) {
     input.style.height = "auto";
     input.style.height = (input.scrollHeight) + "px";
     form.style.height = (input.scrollHeight + 9) + "px"
})

chat_messages.addEventListener("scroll", function (event) {
     message_files.style.top = chat_messages.scrollHeight - (chat_messages.scrollHeight - chat_messages.scrollTop) + 317 + "px"
     if (chat_messages.scrollTop == chat_messages.scrollHeight - chat_messages.clientHeight) {
          keep_bottom = true
     } else {
          keep_bottom = false
     }
})

container_chat.addEventListener("dragenter", function () {
     message_drag.classList.add("message_drag-active")
})

container_chat.addEventListener("dragend", function () {
     message_drag.classList.remove("message_drag-active")
})

type_send.addEventListener("click", function (event) {
     event.preventDefault()
     send_message()
})

for (let i = 0; i < title_close_collection.length; i++) {
     title_close[i] = title_close_collection[i]
}

for (let i = 0; i < title_close.length; i++) {
     title_close[i].addEventListener("click", function (event) {
          if (files_file < 5) {
               files_to_send.splice(title_close.indexOf(event.target), 1)
               add_content_to_files()
          } else {
               files_to_send.splice(title_close.indexOf(event.target), 1)
               add_content_to_files()
          }

     })
}



function allowDrop(event) {
     event.preventDefault()
}

function drop(event) {
     event.preventDefault()
     message_drag.classList.remove("message_drag-active")
     event_files = []
     if (event.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          for (var i = 0; i < event.dataTransfer.items.length; i++) {
               // If dropped items aren't files, reject them
               if (event.dataTransfer.items[i].kind === 'file') {
                    event_files.push(event.dataTransfer.items[i].getAsFile())
               }
          }
          files_to_send = event_files
          add_content_to_files()
     }
}


socket.on('chat message', function (msg) {
     console.log(msg)
     let messages_line = document.createElement("div"),
          line_text = document.createElement("div"),
          line_avatar = document.createElement("div"),
          text_top = document.createElement("div")
     text_bottom = document.createElement("div")
     messages_line.classList.add("messages_line")
     text_top.classList.add("text_top")
     text_bottom.classList.add("text_bottom")
     line_text.classList.add("line_text")
     line_avatar.classList.add("line_avatar")
     if (getCookie("user_id") != msg.user_id) {
          messages_line.classList.add("message_line-left")
     }
     text_bottom.innerText = msg.time_for_msg
     text_top.innerText = msg.message
     line_text.append(text_top)
     line_text.append(text_bottom)
     messages_line.prepend(line_text)
     messages_line.append(line_avatar)
     chat_messages.append(messages_line)
     if (msg.files) {
          console.log(msg.files[0].file)
          let text_images = document.createElement("div")
          text_images.classList.add("text_images")
          for (let n = 0; n < msg.files.length; n++) {
               let images_image = document.createElement("div")
               images_image.classList.add("images_image")

               if (msg.files[n].filepurpose == 'image') {
                    let binary_data = [];
                    binary_data.push(msg.files[n].file);
                    let url_to_image = window.URL.createObjectURL(new Blob(binary_data, {
                         type: "application/zip"
                    }))

                    images_image.style.background = `url(${url_to_image}) no-repeat center`
               } else {
                    images_image.style.background = `url("../img/image28.png") no-repeat center`
               }




               text_images.append(images_image)
               document.querySelectorAll(".line_text")[document.querySelectorAll(".line_text").length - 1].prepend(text_images)
          }

     }
     if (keep_bottom) {
          chat_messages.scrollTop = chat_messages.scrollHeight - chat_messages.clientHeight;
     }
     if (document.querySelectorAll(".messages_line")[document.querySelectorAll(".messages_line").length - 1].classList.value == document.querySelectorAll(".messages_line ")[document.querySelectorAll(".messages_line").length - 2].classList.value) {
          document.querySelectorAll(".messages_line")[document.querySelectorAll(".messages_line").length - 2].querySelector(".line_avatar").remove()
          document.querySelectorAll(".messages_line")[document.querySelectorAll(".messages_line").length - 2].querySelector(".line_text").classList.add("line_text-without-avatar")
     }
});