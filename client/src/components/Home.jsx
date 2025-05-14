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
  const [nameError, setNameError] = useState(false);

  const handleCreate = () => {
    if (!username.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
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
    console.log(username) ;
    if (!username.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
  
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
      } else if (data.type === 'error') {
        alert("❌ " + data.payload);
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
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 tracking-wide">🎯 Live Poll Battle</h1>

        <input
          className={`w-full px-4 py-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 ${
            nameError ? 'border-red-500 ring-red-400' : 'border-gray-300 focus:ring-indigo-400'
          }`}
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full px-4 py-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Option A (e.g. Tea)"
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
        />

        <input
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Option B (e.g. Coffee)"
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
        />

        <button
          className="w-full bg-indigo-500 text-white py-3 rounded-lg shadow-2xl font-semibold mb-6 hover:bg-indigo-600 transition"
          onClick={handleCreate}
          disabled={!optionA || !optionB}
        >
          🚀 Create Room
        </button>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute w-full border-t border-gray-300"></div>
          <span className="bg-white px-3 text-gray-500 text-sm z-10">OR</span>
        </div>

        <input
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button
          className="w-full bg-green-500 text-white py-3 shadow-2xl rounded-lg font-semibold hover:bg-green-600 transition"
          onClick={handleJoin}
          disabled={!roomCode}
        >
          🔑 Join Room
        </button>
      </div>
    </div>
  );
}

export default Home;
