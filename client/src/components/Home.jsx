import { useState } from 'react';
import { connectSocket, getSocket } from '../utils/socket';
import PollRoom from './PollRoom';

function Home() {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joined, setJoined] = useState(false);
  const [question, setQuestion] = useState('');
  const [votes, setVotes] = useState({ A: 0, B: 0 });

  const handleCreate = () => {
    connectSocket();
    const socket = getSocket();
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'create_room' }));
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === 'room_created') {
        setRoomCode(data.payload.roomCode);
        setQuestion(data.payload.question);
        setJoined(true);
        socket.send(JSON.stringify({ type: 'join_room', payload: { roomCode: data.payload.roomCode, username } }));
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
        setJoined(true);
      }
    };
  };

  if (joined) {
    return <PollRoom username={username} roomCode={roomCode} question={question} votes={votes} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">🎯 Live Poll Battle</h1>
            <input className="w-full px-4 py-2 mb-4 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Enter your name" onChange={(e) => setUsername(e.target.value)} />
            <br />
            <button className="w-full bg-indigo-500 text-white font-semibold py-2 rounded-md hover:bg-indigo-600 transition mb-4" onClick={handleCreate}>🚀 Create Room</button>
            <div className="relative flex items-center justify-center my-4">
                <div className="absolute w-full border-t border-gray-300"></div>
                <span className="bg-white px-2 text-gray-500 text-sm z-10">OR</span>
            </div>
            <input className="w-full px-4 py-2 mb-4 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Enter room code" onChange={(e) => setRoomCode(e.target.value)} />
            <button className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition" onClick={handleJoin}>Join Room</button>
        </div>
    </div>
  );
}

export default Home;