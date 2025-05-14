# 🗳️ Live Poll Battle

A real-time poll application where users can create or join a poll room and vote live. Results are updated instantly using WebSockets.

---

## 🧠 Architecture

- **Frontend:** ReactJS with Tailwind CSS
- **Backend:** Node.js with WebSocket (`ws`)
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Communication:** WebSockets for live updates
- **Persistence:** In-memory room state on server, vote tracked with localStorage

---

## 📦 Setup Instructions

### 1. Clone the repo

```bash
    git clone https://github.com/your-username/live-poll-battle.git
    cd live-poll-battle
```

### Start the Backend

```bash
    cd server
    npm install
    npm run dev
```
Make sure port 3001 is available, or you can change it in the code.

### Start the frontend

```bash
    cd client
    npm install
    npm run dev
```
    
Visit http://localhost:5173 in your browser to use the app.


### ✨ Features Implemented
✅ Create Room — Generates a unique room code and initializes a poll.

✅ Join Room — Users can join an existing room using the room code.

✅ Live Voting — Users cast votes and see real-time vote count updates. One vote per user (tracked via localStorage)

✅ WebSocket Integration — All client-server interactions are handled using native WebSocket.

✅ Timeout Auto-Close — Each poll automatically ends after 60 seconds.

✅ Responsive UI — Clean and responsive interface built with Tailwind CSS.

✅ Copy room code button for sharing.

### 🧠 Architecture Overview

🔄 Vote State Sharing
- The server verifies that:
  - The room exists
  - The voting window is still open (within 60 seconds of creation)
  - The user hasn't already voted

- If valid:
  - The vote count (`A` or `B`) is updated
  - The user is marked as having voted
  - The server **broadcasts the updated vote totals** to all users in the room via WebSocket

This ensures real-time synchronization of votes across all connected clients.

Additionally, **each user stores their vote locally using `localStorage`**, which helps:
- Prevent re-voting across refreshes
- Display the user's selected option persistently

---

### 🏠 Room Management
When a user creates a room:

- A **6-character alphanumeric room code** is generated
- The backend initializes a `room` object with:
  - Custom poll options (`optionA` and `optionB`)
  - A question string (`optionA vs optionB`)
  - Vote counters: `{ A: 0, B: 0 }`
  - A `createdAt` timestamp
  - A map of connected users (`username → WebSocket`)
  - A `hasEnded` flag to disable voting after the time window

⏱️ **Global Countdown Timer:**  
- The server starts a 60-second timeout when the room is created
- After 60 seconds:
  - `hasEnded` is set to `true`
  - A `poll_ended` message is sent to all users in the room

When a user joins:

- The server checks:
  - Whether the room exists
  - Whether voting is still active (`!hasEnded`)
- If valid:
  - The user is added to the room
  - The current vote state, question, and `createdAt` timestamp are sent back

On the frontend:
- The client calculates remaining time based on `createdAt`
- The countdown is synchronized for all users regardless of when they join

🧠 All room and vote state is stored in **memory only**, keeping it simple, fast, and ideal for this real-time demo.

---

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