# 🎯 Live Poll Battle

A real-time polling web application where users can create or join a room, vote on a question, and see live vote updates. Built with React on the frontend and WebSocket-powered backend for live interactivity.

---

## 🚀 Setup Instructions

### Backend

1. **Navigate to the backend directory** (if in separate folder).
2. Install dependencies:
   ```bash
   npm install
Start the WebSocket server:

bash
Copy
Edit
node index.js
Ensure port 3001 is available (or modify the port if needed).

Frontend
Navigate to the frontend project directory.

Install dependencies:

bash
Copy
Edit
npm install
Start the development server:

bash
Copy
Edit
npm run dev
Open your browser at http://localhost:5173 (or whichever port Vite is using).

✨ Features Implemented
Create Room: Start a new poll room with a unique code and default question.

Join Room: Enter a room code and username to join an existing poll room.

Live Voting: All connected users see vote counts update in real-time.

WebSocket Integration: Bi-directional live communication without page reloads.

Styled UI: Clean and modern UI using Tailwind CSS for responsiveness.

🧠 Architecture Overview
🔄 Vote State Sharing
The vote state is managed centrally on the server in memory. When a user votes, the server updates the vote count and broadcasts the new state to all users in that room using WebSockets. This ensures that everyone sees the updated vote counts live without delay.

🏠 Room Management
When a user clicks Create Room, the frontend sends a create_room event.

The backend responds with a generated room code and a default poll question.

The user is then automatically joined to the room using a join_room message.

For Join Room, users input a room code and username, which is sent via WebSocket.

The server verifies and tracks users per room using an in-memory mapping of room codes to their participants and votes.

Room data and connections are stored using basic JavaScript objects, ensuring simplicity and performance. No external database is used, so restarting the server will reset all room data.

