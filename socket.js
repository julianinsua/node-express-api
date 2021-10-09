const { Server } = require("socket.io");

let io;

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: { origin: "http://localhost:3000" },
    });
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error("Socket instance is undefined");
    }
    return io;
  },
};
