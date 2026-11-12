const jwt = require('jsonwebtoken');
const User = require('./models/User');

let io;

module.exports = {
  init: (server, options = {}) => {
    const { Server } = require('socket.io');
    io = new Server(server, options);

    io.use(async (socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Socket authentication required'));

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const account = await User.findById(user.id).select('blocked');
        if (!account || account.blocked) return next(new Error('Socket access denied'));
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