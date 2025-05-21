let onlineUsers = new Map();

const initializeSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user online status
    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("userStatusUpdate", { userId, status: "online" });
    });

    // Handle private messaging
    socket.on("privateMessage", ({ from, to, message }) => {
      const receiverSocketId = onlineUsers.get(to);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", {
          from,
          message,
        });
      }
    });

    // Handle notifications
    socket.on("notification", ({ type, content, to }) => {
      const receiverSocketId = onlineUsers.get(to);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", {
          type,
          content,
        });
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      // Find and remove the disconnected user
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("userStatusUpdate", { userId, status: "offline" });
          break;
        }
      }
    });
  });
};

export { initializeSocketEvents };
