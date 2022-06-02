var socket = io();
var form = document.querySelector(".chat_type")
var input = document.querySelector(".write_message")

function getCookie(name) {
     let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
     ));
     return matches ? decodeURIComponent(matches[1]) : undefined;
}

form.addEventListener("submit", function (event) {
     event.preventDefault();
     var user = getCookie("user_id")
     if (input.value) {
          var to_send = {
               user_id: user,
               message: input.value
          }
          socket.emit('chat message', to_send);
          input.value = '';
     }
})
socket.on('chat message', function (msg) {
     var messages_line = document.createElement("div")
     messages_line.classList.add("messages_line")
     var line_text = document.createElement("div")
     line_text.classList.add("line_text")
     line_text.innerText = msg.message
     var line_avatar = document.createElement("div")
     line_avatar.classList.add("line_avatar")
     messages_line.prepend(line_text)
     messages_line.append(line_avatar)
     document.querySelector(".chat_messages").append(messages_line)
});