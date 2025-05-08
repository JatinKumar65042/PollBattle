# 🎯 Live Poll Battle

A real-time polling web application where users can create or join a room, vote on a question, and see live vote updates. Built with React on the frontend and WebSocket-powered backend for live interactivity.

---

## 🚀 Setup Instructions

### Backend

1. Navigate to the backend directory (if using separate folders for frontend and backend).
2. Install dependencies:
   ```bash
   npm install
Start the WebSocket server:

    ```bash
    node index.js
    Make sure port 3001 is available, or you can change it in the code.
    ```
    

### Frontend
Navigate to the frontend project directory.

Install dependencies:

```bash
    npm install
```

Start the frontend using Vite:

    ```bash 
    npm run dev
    ```
    
Visit http://localhost:5173 in your browser to use the app.

### ✨ Features Implemented
✅ Create Room — Generates a unique room code and initializes a poll.

✅ Join Room — Users can join an existing room using the room code.

✅ Live Voting — Users cast votes and see real-time vote count updates.

✅ WebSocket Integration — All client-server interactions are handled using native WebSocket.

✅ Timeout Auto-Close — Each poll automatically ends after 60 seconds.

✅ Responsive UI — Clean and responsive interface built with Tailwind CSS.

### 🧠 Architecture Overview
🔄 Vote State Sharing
Vote states are handled entirely on the backend using an in-memory rooms object. When a vote is cast:

The server checks if the user hasn't already voted and that the poll hasn't ended.

If valid, it updates the vote count and broadcasts the updated state to all users in the room via WebSocket.

This ensures real-time synchronization of votes across all clients.

### 🏠 Room Management
When a user creates a room, a 6-character alphanumeric code is generated.

The backend initializes a room object with:

A default question (“Cats vs Dogs”)

A vote count for each option (A and B)

A list of connected users

A flag to determine if voting has ended

After 60 seconds, the server marks the poll as ended and notifies all users in the room.

When joining a room, the backend checks for room existence and whether voting is still active before allowing access.

All room and vote data is stored in memory, making it simple and fast (but ephemeral).

### 📂 Project Structure (Simplified)
```bash
project-root/
├── backend/
│   └── index.js               # WebSocket server and room logic
├── frontend/
│   ├── src/
│   │   ├── Home.jsx           # Room creation and join logic
│   │   ├── PollRoom.jsx       # Voting interface
│   │   └── utils/socket.js    # WebSocket connection utils
│   └── index.html / main.jsx  # Entry point
├── package.json
└── README.md