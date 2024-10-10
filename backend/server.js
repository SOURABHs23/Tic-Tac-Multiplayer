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

  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;

    let opponentPlayer;

    for (const key in allUsers) {
      const user = allUsers[key];
      console.log(user.playerName + " userssss");

      if (user.online && !user.playing && socket.id !== key) {
        console.log("uo");
        opponentPlayer = user;
        break;
      }
    }

    console.log(opponentPlayer?.playerName + "openentpayer");

    if (opponentPlayer) {
      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "circle",
      });
      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "cross",
      });

      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      console.log("Oppenent foundd");
    } else {
      currentUser.socket.emit("OpponentNotFound");
      console.log("Opponent not found");
    }
  });

  socket.on("disconnect", function () {
    const currentUser = allUsers[socket.id];
    currentUser.online = false;
  });
});

// Start the server
httpServer.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
