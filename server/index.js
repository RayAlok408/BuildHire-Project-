const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
app.set('trust proxy', 1);

const socketIO = require('./socket');
const defaultOrigins = process.env.NODE_ENV === 'production'
  ? 'https://build-hire-project.vercel.app'
  : 'https://build-hire-project.vercel.app,http://localhost:3000';
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins)
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const corsOptions = { origin: allowedOrigins };

socketIO.init(server, { cors: corsOptions });

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false
});

app.use('/api', apiLimiter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('DB Error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));

app.get('/', (req, res) => {
  res.send('BuildHire server is running!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));