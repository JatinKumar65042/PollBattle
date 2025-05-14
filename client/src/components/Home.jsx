import { useState } from 'react';
import { connectSocket, getSocket } from '../utils/socket';
import PollRoom from './PollRoom';

function Home() {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joined, setJoined] = useState(false);
  const [question, setQuestion] = useState('');
  const [votes, setVotes] = useState({ A: 0, B: 0 });
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [createdAt, setCreatedAt] = useState(null);

  const handleCreate = () => {
    connectSocket();
    const socket = getSocket();
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'create_room',
        payload: { optionA, optionB }
      }));
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === 'room_created') {
        setRoomCode(data.payload.roomCode);
        setQuestion(data.payload.question);
        setOptionA(data.payload.optionA);
        setOptionB(data.payload.optionB);
        setCreatedAt(data.payload.createdAt);
        setJoined(true);

        socket.send(JSON.stringify({
          type: 'join_room',
          payload: { roomCode: data.payload.roomCode, username }
        }));
      }
    };
  };

  const handleJoin = () => {
    connectSocket();
    const socket = getSocket();
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'join_room', payload: { roomCode, username } }));
    };
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === 'joined') {
        setQuestion(data.payload.question);
        setVotes(data.payload.votes);
        setOptionA(data.payload.optionA);
        setOptionB(data.payload.optionB);
        setCreatedAt(data.payload.createdAt);
        setJoined(true);
      }
    };
  };

  if (joined) {
    return (
      <PollRoom
        username={username}
        roomCode={roomCode}
        question={question}
        votes={votes}
        optionA={optionA}
        optionB={optionB}
        createdAt={createdAt}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🎯 Live Poll Battle</h1>

        <input
          className="w-full px-4 py-2 mb-4 border rounded-md"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full px-4 py-2 mb-2 border rounded-md"
          placeholder="Option A (e.g. Tea)"
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
        />

        <input
          className="w-full px-4 py-2 mb-4 border rounded-md"
          placeholder="Option B (e.g. Coffee)"
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
        />

        <button
          className="w-full bg-indigo-500 text-white py-2 rounded-md font-semibold mb-4 hover:bg-indigo-600 transition"
          onClick={handleCreate}
          disabled={!username || !optionA || !optionB}
        >
          🚀 Create Room
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="absolute w-full border-t border-gray-300"></div>
          <span className="bg-white px-2 text-gray-500 text-sm z-10">OR</span>
        </div>

        <input
          className="w-full px-4 py-2 mb-2 border rounded-md"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button
          className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition"
          onClick={handleJoin}
          disabled={!username || !roomCode}
        >
          🔑 Join Room
        </button>
      </div>
    </div>
  );
}

export default Home;
