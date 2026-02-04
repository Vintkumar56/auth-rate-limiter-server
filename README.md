# API Rate Limiter + Authentication Server

A production-ready Node.js + Express backend featuring JWT authentication, role-based access control, Redis-based rate limiting, and comprehensive audit logging.

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis (ioredis)
- **Authentication**: JWT (Access + Refresh tokens)
- **Security**: Helmet, CORS, bcrypt, Zod validation
- **Logging**: Structured JSON logging with audit trails

### Project Structure
```
src/
├── config/
│   ├── database.js      # MongoDB connection
│   ├── redis.js         # Redis connection
│   ├── helmet.js        # Security headers config
│   └── cors.js          # CORS configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User endpoints
│   ├── adminController.js   # Admin endpoints
│   └── auditController.js   # Audit log management
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── authorizeRoles.js    # RBAC middleware
│   ├── rateLimiter.js       # Redis rate limiting
│   ├── audit.js            # Audit logging
│   ├── requestLogger.js    # Request logging
│   ├── errorLogger.js      # Error logging
│   └── errorHandler.js     # Centralized error handling
├── models/
│   ├── User.js              # User schema
│   └── AuditLog.js          # Audit log schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── user.js              # User routes
│   ├── admin.js             # Admin routes
│   ├── audit.js             # Audit routes
│   └── health.js            # Health check
├── utils/
│   ├── jwt.js               # JWT utilities
│   ├── logger.js            # Structured logging
│   └── validation.js        # Zod schemas
├── app.js                   # Express app setup
└── server.js                # Server startup with graceful shutdown
```

## 🔐 Authentication System

### JWT Lifecycle
1. **Registration**: User creates account → Access token (15min) + Refresh token (7d)
2. **Login**: Credentials verified → New token pair issued
3. **Access**: Protected routes require valid access token
4. **Refresh**: Expired access token → Use refresh token for new pair
5. **Logout**: Refresh token invalidated on server

### Token Details
- **Access Token**: 15 minutes, used for API requests
- **Refresh Token**: 7 days, stored in database, used for token renewal
- **Secret Keys**: Separate secrets for access and refresh tokens

## 🛡️ Role-Based Access Control (RBAC)

### User Roles
- **user**: Standard user access
- **admin**: Administrative privileges

### Protected Endpoints
- `GET /api/user/profile` - Authenticated users only
- `GET /api/admin/dashboard` - Admin users only
- `GET /api/admin/audit-logs` - Admin audit trail access

### Middleware Chain
```
Request → authenticate → authorizeRoles → audit → rateLimit → Controller
```

## ⚡ Rate Limiting Strategy

### Redis-Based Implementation
- **Fixed Window Counter**: Simple and efficient
- **Key Format**: `rate:user:<userId>` or `rate:ip:<ip>`
- **Auto-Expiration**: Redis TTL handles window cleanup

### Rate Limits
- **Admin**: 500 requests per 15 minutes
- **User**: 100 requests per 15 minutes
- **IP Fallback**: 50 requests per 15 minutes (unauthenticated)

### Response Headers
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests left in current window
- `X-RateLimit-Reset`: Window reset timestamp

## 📊 Audit Logging Strategy

### Automatic Logging
- **Login**: Successful authentication events
- **Token Refresh**: Token renewal events
- **Protected Access**: Access to user-only endpoints
- **Admin Access**: Access to admin-only endpoints

### Audit Log Schema
```javascript
{
  userId: ObjectId,
  action: 'LOGIN' | 'TOKEN_REFRESH' | 'PROTECTED_ACCESS' | 'ADMIN_ACCESS',
  endpoint: String,
  method: String,
  timestamp: Date,
  metadata: Object
}
```

### Admin Audit Trail
- `GET /api/admin/audit-logs` - Paginated audit log viewing
- Filtering by userId and action type
- Efficient MongoDB indexes for performance

## 🔒 Security Features

### Input Validation
- **Zod Schemas**: Type-safe validation for all inputs
- **Sanitization**: Email normalization, string trimming
- **Error Messages**: Clear, user-friendly validation errors

### Security Headers
- **Helmet**: Content Security Policy, HSTS, XSS protection
- **CORS**: Environment-based origin whitelisting
- **Rate Limiting**: DDoS protection and API abuse prevention

### Password Security
- **bcrypt**: 12-round salted hashing
- **Secure Storage**: Passwords never exposed in responses
- **Validation**: Minimum 6 characters with complexity checks

## 🚀 Deployment Guide

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Upstash Redis account
- Render account (or preferred hosting)

### Environment Setup
1. **MongoDB Atlas**:
   - Create free cluster
   - Get connection string
   - Configure network access (0.0.0.0/0 for testing)

2. **Upstash Redis**:
   - Create free Redis database
   - Get REST URL (redis://username:password@host:port)

3. **Environment Variables**:
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rate-limiter-auth
REDIS_URL=redis://user:pass@host:port
JWT_ACCESS_SECRET=your-production-access-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
ALLOWED_ORIGINS=https://yourdomain.com
```

### Render Deployment
1. **Connect GitHub Repository**
2. **Configure Build Command**: `npm install`
3. **Configure Start Command**: `npm start`
4. **Add Environment Variables**
5. **Deploy and Test**

### Production Checklist
- [ ] Change all default secrets
- [ ] Configure proper CORS origins
- [ ] Enable MongoDB authentication
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Test rate limiting under load
- [ ] Verify audit log retention

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### User
- `GET /api/user/profile` - Get user profile (auth required)

### Admin
- `GET /api/admin/dashboard` - Admin dashboard (admin only)
- `GET /api/admin/audit-logs` - View audit logs (admin only)

### System
- `GET /api/health` - Health check endpoint

## 🔧 Development

### Local Setup
```bash
# Clone repository
git clone <repository-url>
cd backend-project

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start MongoDB and Redis locally
# Update .env with local connection strings

# Start development server
npm run dev
```

### Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📈 Performance Considerations

### Database Optimization
- **Indexes**: Optimized for userId, timestamp, and action queries
- **Pagination**: Efficient cursor-based pagination for audit logs
- **Connection Pooling**: MongoDB connection reuse

### Redis Efficiency
- **Pipeline Operations**: Single INCR + EXPIRE per request
- **Auto-Cleanup**: TTL handles window expiration
- **Memory Management**: Fixed-size counters

### Application Performance
- **Async Logging**: Non-blocking audit and request logging
- **Middleware Order**: Optimized for early termination
- **Error Handling**: Graceful degradation on failures

## 🛠️ Monitoring & Maintenance

### Health Monitoring
- `/api/health` endpoint for load balancer checks
- Structured logging for centralized monitoring
- Error tracking with detailed context

### Audit Trail Management
- Regular log rotation for storage management
- Retention policies based on compliance requirements
- Export capabilities for compliance reporting

### Security Maintenance
- Regular secret rotation
- Monitor failed login attempts
- Rate limit adjustment based on usage patterns

---

This backend provides a solid foundation for secure, scalable applications with enterprise-grade features including authentication, authorization, rate limiting, and comprehensive audit logging.
