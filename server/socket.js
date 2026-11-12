const jwt = require('jsonwebtoken');

let io;

module.exports = {
  init: (server, options = {}) => {
    const { Server } = require('socket.io');
    io = new Server(server, options);

    io.use((socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Socket authentication required'));

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = { id: String(user.id), role: user.role };
        next();
      } catch {
        next(new Error('Invalid socket authentication'));
      }
    });

    io.on('connection', socket => {
      if (socket.user.role === 'client' || socket.user.role === 'worker') {
        socket.join(`${socket.user.role}:${socket.user.id}`);
      }
    });

    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket not initialized');
    return io;
  }
};