import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const wss = new WebSocketServer({ port: 3001 });
console.log("WebSocket server started on ws://localhost:3001");

const rooms = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const { type, payload } = data;

    if (type === 'create_room') {
      const roomCode = generateRoomCode();
      const optionA = payload.optionA;
      const optionB = payload.optionB;
      const question = `${optionA} vs ${optionB}`;
      const createdAt = Date.now();

      rooms[roomCode] = {
        question,
        optionA,
        optionB,
        votes: { A: 0, B: 0 },
        users: {},
        hasEnded: false,
        createdAt
      };

      ws.send(JSON.stringify({
        type: 'room_created',
        payload: { roomCode, question, optionA, optionB, createdAt }
      }));

      setTimeout(() => {
        rooms[roomCode].hasEnded = true;
        broadcastToRoom(roomCode, { type: 'poll_ended' });
      }, 60000);

    } else if (type === 'join_room') {
      const { roomCode, username } = payload;
      const room = rooms[roomCode];

      if (!room || room.hasEnded) {
        ws.send(JSON.stringify({ type: 'error', payload: 'Room not found or voting ended.' }));
        return;
      }

      room.users[username] = { ws, hasVoted: false };

      ws.send(JSON.stringify({
        type: 'joined',
        payload: {
          roomCode,
          question: room.question,
          votes: room.votes,
          optionA: room.optionA,
          optionB: room.optionB,
          createdAt: room.createdAt
        }
      }));
    } else if (type === 'vote') {
      const { roomCode, username, vote } = payload;
      const room = rooms[roomCode];

      if (!room || room.hasEnded || !room.users[username] || room.users[username].hasVoted) return;

      if (vote === 'A' || vote === 'B') {
        room.votes[vote]++;
        room.users[username].hasVoted = true;

        broadcastToRoom(roomCode, {
          type: 'vote_update',
          payload: room.votes
        });
      }
    }
  });
});

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function broadcastToRoom(roomCode, message) {
  const room = rooms[roomCode];
  if (!room) return;

  Object.values(room.users).forEach(({ ws }) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}
