import { useEffect, useState } from 'react';
import { getSocket } from '../utils/socket';

function PollRoom({ username, roomCode, question, votes: initialVotes, optionA, optionB, createdAt }) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(localStorage.getItem(roomCode));
  const [ended, setEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#6a11cb] to-[#2575fc] px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 tracking-wide">{question}</h2>

        <div className="mb-4">
          <p className="text-gray-600 mb-1">
            Room Code: <span className="font-mono text-indigo-600 text-lg">{roomCode}</span>
          </p>
          <button
            onClick={copyToClipboard}
            className="text-sm bg-indigo-100 text-indigo-700 font-medium px-3 py-1 rounded hover:bg-indigo-200 transition"
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
        </div>

        <p className="text-sm text-red-600 mb-6 font-medium">⏳ Time Left: {timeLeft}s</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <button
            className={`w-full py-4 text-xl font-semibold rounded-2xl shadow-md transition
              ${voted || ended ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 text-white'}`}
            disabled={voted || ended}
            onClick={() => handleVote('A')}
          >
            🅰️ {optionA}
          </button>

          <button
            className={`w-full py-4 text-xl font-semibold rounded-2xl shadow-md transition
              ${voted || ended ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            disabled={voted || ended}
            onClick={() => handleVote('B')}
          >
            🅱️ {optionB}
          </button>
        </div>

        <div className="text-lg text-gray-700 font-medium space-y-1 mb-6">
          <p>🅰️ {optionA}: <span className="font-bold text-pink-600">{votes.A}</span></p>
          <p>🅱️ {optionB}: <span className="font-bold text-blue-600">{votes.B}</span></p>
        </div>

        {voted && (
          <p className="text-green-600 font-semibold text-lg mb-2">
            ✅ You voted for: {voted === 'A' ? optionA : optionB}
          </p>
        )}
        {ended && (
          <p className="text-red-600 font-semibold text-lg">🚫 Voting has ended.</p>
        )}
      </div>
    </div>
  );
}

export default PollRoom;
