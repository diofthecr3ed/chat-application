const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

let port = process.env.PORT||5003;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use("/", express.static("static"));

let idtousername = {};
let usernametoid = {};

io.on("connection", socket => {
  console.log("new device connected, id=" + socket.id);

  socket.on("send-msg", data => {
    if (data.message.startsWith("@")) {
      let receiver_username = data.message.split(":")[0].substring(1);
      let msg = data.message.split(":")[1].trim();
      io.to(usernametoid[receiver_username]).emit("send-msg", {
        username: data.username,
        message: msg
      });
    } else {
      socket.broadcast.emit("send-msg", data);
    }
  });
  socket.on("login", data => {
    idtousername[socket.id] = data.username;
    usernametoid[data.username] = socket.id;

    socket.broadcast.emit("new-user-online", idtousername[socket.id]);
  });

  socket.on("disconnect", () => {
    console.log(socket);
    io.emit("user-offline", idtousername[socket.id]);
  });
  socket.on("typing", () => {
    socket.broadcast.emit("typing", idtousername[socket.id]);
  });

  socket.on("window-blurred", () => {
    socket.broadcast.emit("window-blurred", idtousername[socket.id]);
  });
  socket.on("window-activated", () => {
    socket.broadcast.emit("window-activated", idtousername[socket.id]);
  });
});

server.listen(port);
