require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
// Custom mongo sanitize middleware for Express 5 compatibility (mutating req.query in-place)
const mongoSanitize = () => (req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) sanitize(req.query);
  next();
};
const hpp = require('hpp');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const http = require('http');
const { Server } = require('socket.io');
const notificationService = require('./utils/notification');
const { apiLimiter, validateEnvVars } = require('./middleware/security');

// Validate environment variables before starting
validateEnvVars();

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(mongoSanitize());
app.use(hpp());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ── Database ──────────────────────────────────────────────────
const { enableMockDb } = require('./utils/dbFallback');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️ Running in Mock DB mode using server/db_mock.json');
    enableMockDb();
  });

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

notificationService.setIO(io);

io.on('connection', (socket) => {
  console.log('🟢 New Client Connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔴 Client Disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 PolicyPulse API running on http://localhost:${PORT}`);
});

// Start AI Neural Microservice on Port 5001
const aiApp = require('./aiService');
const AI_PORT = process.env.AI_PORT || 5001;
const aiServer = aiApp.listen(AI_PORT, () => {
  console.log(`🤖 PolicyPulse AI Neural Engine running on http://localhost:${AI_PORT}`);
});
aiServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`ℹ️ Port ${AI_PORT} already running (external AI service detected).`);
  } else {
    console.error('AI Service Error:', err.message);
  }
});

