const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, 'public')));

let waitingUsers = [];

io.on('connection', (socket) => {
  console.log('✅ Bağlandı:', socket.id);

  socket.on('find-partner', () => {
    const partnerIndex = waitingUsers.findIndex(u => u.id !== socket.id);
    if (partnerIndex !== -1) {
      const partner = waitingUsers.splice(partnerIndex, 1)[0];
      const roomId = `room-${socket.id}-${partner.id}`;
      socket.join(roomId);
      partner.join(roomId);
      socket.currentRoom = roomId;
      partner.currentRoom = roomId;
      partner.emit('match-found', { roomId, initiator: true });
      socket.emit('match-found', { roomId, initiator: false });
      console.log(`🔗 Eşleşti: ${socket.id} <-> ${partner.id}`);
    } else {
      if (!waitingUsers.find(u => u.id === socket.id)) {
        waitingUsers.push(socket);
      }
      socket.emit('waiting');
      console.log(`⏳ Bekliyor: ${socket.id}`);
    }
  });

  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', { offer });
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', { answer });
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', { candidate });
  });

  socket.on('skip', () => {
    const roomId = socket.currentRoom;
    if (roomId) {
      socket.to(roomId).emit('partner-left');
      socket.leave(roomId);
      socket.currentRoom = null;
    }
  });

  socket.on('disconnect', () => {
    waitingUsers = waitingUsers.filter(u => u.id !== socket.id);
    if (socket.currentRoom) {
      socket.to(socket.currentRoom).emit('partner-left');
    }
    console.log('❌ Ayrıldı:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 BelugaChat Server: http://localhost:${PORT}`);
});
