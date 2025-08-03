// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Permette l'accesso da qualsiasi frontend
    methods: ['GET', 'POST']
  }
});

// Elenco giocatori connessi
let players = [];

io.on('connection', (socket) => {
  console.log(`✅ Nuovo giocatore connesso: ${socket.id}`);

  socket.on('joinGame', (playerData) => {
    players.push({ id: socket.id, ...playerData });
    io.emit('updatePlayers', players); // Invia la lista a tutti
  });

  socket.on('disconnect', () => {
    console.log(`❌ Giocatore disconnesso: ${socket.id}`);
    players = players.filter(p => p.id !== socket.id);
    io.emit('updatePlayers', players);
  });
});

// Avvia il server
server.listen(3001, () => {
  console.log('🚀 Server backend avviato su http://localhost:3001');
});
