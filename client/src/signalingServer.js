// signalingServer.js (Node.js with Socket.io)
const io = require("socket.io")(3000);

let users = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    users.push({ userId, socketId: socket.id });
    socket.emit("all_users", users);
  });

  socket.on("offer", (data) => {
    const { offer, to } = data;
    const user = users.find((user) => user.userId === to);
    if (user) {
      io.to(user.socketId).emit("offer", { offer, from: socket.id });
    }
  });

  socket.on("answer", (data) => {
    const { answer, to } = data;
    const user = users.find((user) => user.userId === to);
    if (user) {
      io.to(user.socketId).emit("answer", { answer, from: socket.id });
    }
  });

  socket.on("ice-candidate", (data) => {
    const { candidate, to } = data;
    const user = users.find((user) => user.userId === to);
    if (user) {
      io.to(user.socketId).emit("ice-candidate", { candidate, from: socket.id });
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
  });
});
