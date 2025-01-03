import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  connectedUsers.set(socket.id, {
    id: socket.id,
    cursor: { line: 0, column: 0 }
  });

  // Broadcast to all clients about new user
  io.emit('users', Array.from(connectedUsers.values()));

  socket.on('cursorMove', (position) => {
    // Update user's cursor position
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.cursor = position;
      // Broadcast to all other clients
      socket.broadcast.emit('userCursorMove', {
        userId: socket.id,
        position
      });
    }
  });

  socket.on('codeChange', (code) => {
    socket.broadcast.emit('codeUpdate', code);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers.delete(socket.id);
    io.emit('users', Array.from(connectedUsers.values()));
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});