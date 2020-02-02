$(document).ready(() => {
  let socket = io();
  let id;

  $("#chat-div").hide();

  $("#login").click(() => {
    id = $("#login-box").val();
    if (id.trim() == "") return window.alert("Please Enter Username");
    socket.emit("login", { username: id });
    $("#login-div").hide();
    $("#chat-div").show();
  });
  $("#send").click(() => {
    let msg = $("#msg-box").val();
    socket.emit("send-msg", { message: msg, username: id });
    if (msg.startsWith("@")) msg = msg.split(":")[1];
    $("#chat1").append(
      `<div class="licontainer1 my-2" id="licon"><li>Me: ${msg}</li></div>`
    );

    document.getElementById("msg-box").value = "";
  });
  socket.on("send-msg", data => {
    console.log(data);
    $("#chat1").append(
      `<div class="licontainer2 my-2"><li>${data.username}:${
        data.message
      }</li></div>`
    );
  });
  socket.on("new-user-online", data => {
    $("#chat1").append(
      `<div class="text-center my-2"><li>${data} user joined</li></div>`
    );
  });
  socket.on("user-offline", data => {
    $("#chat1").append(
      `<div class="text-center my-2"><li>${data} user exited</li></div>`
    );
  });
  $("#msg-box").focus(() => {
    if ($("#chat-div").is(":visible")) {
      socket.emit("typing");
    }
  });
  socket.on("typing", data => {
    $("#chat1").append(
      `<div class="text-center my-2"><li>${data} is typing</li></div>`
    );
  });

  socket.on("window-blurred", data => {
    $("#chat1").append(
      `<div class="text-center my-2"><li>${data} is offline</li></div>`
    );
  });
  $(window).focus(() => {
    if ($("#chat-div").is(":visible")) {
      socket.emit("window-activated");
    }
  });

  socket.on("window-activated", data => {
    $("#chat1").append(
      `<div class="text-center my-2"><li>${data} is online</li></div>`
    );
  });
});
