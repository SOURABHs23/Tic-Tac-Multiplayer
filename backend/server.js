const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = createServer(app); // Use Express to create the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Set the CORS to allow requests from anywhere
    methods: ["GET", "POST"], // Add other HTTP methods if needed
  },
});

// Middleware to allow CORS requests
app.use(cors());

// Example route for the homepage
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

const allUsers = {};
const allRooms = [];

io.on("connection", (socket) => {
  console.log("user  connected" + socket.id);

  allUsers[socket.id] = {
    socket: socket,
    online: true,
  };

  //   console.log(allUsers[socket.id]);

  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;
    console.log(currentUser);

    let opponentPlayer;

    for (const key in allUsers) {
      const user = allUsers[key];

      if (user.online && !user.playing) {
        opponentPlayer = user;
        break;
      }

      if (opponentPlayer) {
        console.log("Oppenent found");
      } else {
        console.log("Opponent not found");
      }
    }
  });

  socket.on("disconnect", function () {
    allUsers[socket.id] = {
      socket: socket,
      online: false,
    };

    console.log(allUsers[socket.id]);
  });
});

// Start the server
httpServer.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
