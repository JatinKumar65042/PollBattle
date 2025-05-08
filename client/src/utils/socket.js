let socket;

export const connectSocket = () => {
  socket = new WebSocket("ws://localhost:3001");
};

export const getSocket = () => socket;
