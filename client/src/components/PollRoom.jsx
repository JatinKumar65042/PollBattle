import { useEffect, useState } from 'react';
import { getSocket } from '../utils/socket';

function PollRoom({ username, roomCode, question, votes: initialVotes, optionA, optionB, createdAt }) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(localStorage.getItem(roomCode));
  const [ended, setEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const socket = getSocket();

  useEffect(() => {
    const now = Date.now();
    const secondsPassed = Math.floor((now - createdAt) / 1000);
    const remaining = Math.max(0, 60 - secondsPassed);
    setTimeLeft(remaining);

    if (remaining === 0) {
      setEnded(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  useEffect(() => {
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === 'vote_update') {
        setVotes(data.payload);
      } else if (data.type === 'poll_ended') {
        setEnded(true);
      }
    };
  }, []);

  const handleVote = (choice) => {
    if (voted || ended) return;

    socket.send(JSON.stringify({
      type: 'vote',
      payload: { roomCode, username, vote: choice }
    }));

    localStorage.setItem(roomCode, choice);
    setVoted(choice);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-500 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{question}</h2>
        <p className="text-gray-500 mb-2">Room Code: <span className="font-mono text-indigo-600">{roomCode}</span></p>
        <p className="text-sm text-red-600 mb-4">Time Left: {timeLeft}s</p>

        <div className="flex justify-around mb-6">
          <button
            className={`px-6 py-3 rounded-xl font-semibold text-white transition duration-300
              ${voted || ended ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
            disabled={voted || ended}
            onClick={() => handleVote('A')}
          >
            {optionA}
          </button>

          <button
            className={`px-6 py-3 rounded-xl font-semibold text-white transition duration-300
              ${voted || ended ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            disabled={voted || ended}
            onClick={() => handleVote('B')}
          >
            {optionB}
          </button>
        </div>

        <div className="text-lg text-gray-700 space-y-1 mb-4">
          <p>{optionA}: <span className="font-bold text-pink-600">{votes.A}</span></p>
          <p>{optionB}: <span className="font-bold text-blue-600">{votes.B}</span></p>
        </div>

        {voted && (
          <p className="text-green-600 font-semibold mb-2">
            You voted for: {voted === 'A' ? optionA : optionB}
          </p>
        )}
        {ended && (
          <p className="text-red-600 font-semibold">Voting has ended.</p>
        )}
      </div>
    </div>
  );
}

export default PollRoom;
