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

const isProduction = process.env.NODE_ENV === 'production';

const safeLogValue = value => String(value || '')
  .replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, '[REDACTED_MONGO_URI]')
  .replace(/Bearer\s+[^\s]+/gi, 'Bearer [REDACTED_TOKEN]');

const logError = (err, context = 'Request error') => {
  console.error(context, {
    name: err.name,
    code: err.code,
    stack: safeLogValue(err.stack)
  });
};

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/admin', require('./routes/admin'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('BuildHire server is running!');
});

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  next(error);
});

app.use((err, req, res, next) => {
  logError(err);
  const statusCode = err.statusCode || err.status || 500;
  const safeStatusCode = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
  const message = safeStatusCode === 404
    ? 'Route not found'
    : isProduction ? 'Internal server error' : err.message || 'Internal server error';

  res.status(safeStatusCode).json({ message });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected!');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    logError(err, 'MongoDB connection failed');
    process.exit(1);
  });