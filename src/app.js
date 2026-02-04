const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const auditRoutes = require('./routes/audit');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const errorLogger = require('./middleware/errorLogger');
const helmetConfig = require('./config/helmet');
const corsConfig = require('./config/cors');

const app = express();

app.use(helmetConfig);
app.use(corsConfig);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.use(requestLogger);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', auditRoutes);

app.use(errorLogger);
app.use(errorHandler);

module.exports = app;
