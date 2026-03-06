# API Rate Monitor - Backend

A robust Node.js backend service for monitoring API usage, tracking performance metrics, and analyzing endpoint behavior.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## ✨ Features

- 🔐 **Authentication**: Clerk-based JWT authentication
- 👥 **Multi-tenant**: Organization and team management
- 🔑 **API Key Management**: Secure key generation and validation
- 📊 **Usage Tracking**: Log and monitor API requests
- 📈 **Analytics**: Real-time statistics and performance metrics
- ⚡ **WebSocket Support**: Ready for real-time updates
- 🗄️ **PostgreSQL**: Robust data persistence
- 🚀 **Redis Ready**: Configured for caching and rate limiting

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: Clerk
- **WebSocket**: Socket.IO
- **Security**: bcrypt for password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- Redis (v6+)
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   cd apps/api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Create database**
   ```bash
   psql -U postgres
   CREATE DATABASE api_rate_monitor;
   ```

5. **Run migrations**
   ```bash
   # Execute SQL from apps/tables.md
   psql -U postgres -d api_rate_monitor -f ../tables.sql
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8000`

## 📚 Documentation

Comprehensive documentation is available in the following files:

- **[BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)** - Complete API reference, database schema, and feature documentation
- **[API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)** - Quick lookup guide for endpoints and examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture, design decisions, and patterns

### Quick Links

- [API Endpoints Reference](./API_QUICK_REFERENCE.md#endpoints)
- [Database Schema](./BACKEND_DOCUMENTATION.md#database-schema)
- [Authentication Guide](./BACKEND_DOCUMENTATION.md#authentication)
- [Analytics Features](./BACKEND_DOCUMENTATION.md#analytics)
- [Architecture Overview](./ARCHITECTURE.md#system-overview)

## 📁 Project Structure

```
apps/api/
├── index.ts                    # Application entry point
├── app.ts                      # Express app configuration
├── routes.ts                   # Route registration
├── package.json
├── tsconfig.json
└── src/
    ├── config/
    │   ├── db.ts              # PostgreSQL configuration
    │   └── redis.ts           # Redis configuration
    ├── middleware/
    │   └── auth.ts            # Authentication middleware
    ├── modules/
    │   ├── auth/              # User authentication
    │   ├── organization/      # Organization management
    │   └── api/               # API monitoring core
    │       ├── api.*          # API CRUD
    │       ├── apiKey.*       # Key generation
    │       ├── track.*        # Usage tracking
    │       └── analytics.*    # Metrics & analytics
    ├── types/
    │   └── express.d.ts       # TypeScript definitions
    ├── utils/
    │   ├── generateApiKeys.ts # Key generation utility
    │   └── hashApiKeys.ts     # Hashing utility
    └── socket.ts              # WebSocket configuration
```

## 💻 Development

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run test     # Run tests (not yet implemented)
```

### Development Server

The dev server uses `ts-node-dev` for:
- Automatic restarts on file changes
- Fast TypeScript compilation
- Error reporting in terminal

### Making Changes

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

See [ARCHITECTURE.md](./ARCHITECTURE.md#adding-new-features) for detailed guide on adding new features.

## 🔧 Environment Variables

Create a `.env` file in the `apps/api` directory:

```env
# Server Configuration
PORT=8000

# Database Configuration
POSTGRES_PASSWORD=your_password_here
DATABASE_NAME=api_rate_monitor

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

### Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 8000 |
| `POSTGRES_PASSWORD` | PostgreSQL password | Yes | - |
| `DATABASE_NAME` | Database name | Yes | - |
| `REDIS_URL` | Redis connection URL | Yes | - |
| `CLERK_SECRET_KEY` | Clerk API secret key | Yes | - |

## 🌐 API Endpoints

### Core Endpoints

```
GET    /health                          # Health check
POST   /auth/sync                       # Sync user
POST   /organizations                   # Create organization
GET    /organizations                   # List organizations
POST   /api                             # Create API
GET    /api                             # List APIs
DELETE /api/:id                         # Delete API
POST   /api/:apiId/keys                 # Generate API key
POST   /api/track                       # Track usage
GET    /api/:apiId/stats                # Get statistics
GET    /api/:apiId/endpoints            # Get endpoint usage
GET    /api/:apiId/rpm                  # Get requests/minute
```

For detailed endpoint documentation, see [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts
- `organizations` - Organizations for multi-tenancy
- `organization_members` - User-organization relationships
- `apis` - API configurations to monitor
- `api_keys` - Hashed API keys for authentication
- `api_usage_logs` - API usage metrics and analytics

See [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md#database-schema) for complete schema details.

## 🔒 Security Features

- ✅ JWT authentication via Clerk
- ✅ API keys hashed with bcrypt
- ✅ Parameterized SQL queries (SQL injection prevention)
- ✅ CORS configuration
- ✅ Secure random key generation
- ✅ Constant-time secret comparison

## 📈 Monitoring & Analytics

The system tracks:

- **Total Requests**: Count of all API calls
- **Error Rate**: Percentage of failed requests
- **Latency Percentiles**: P50, P95, P99 response times
- **Endpoint Usage**: Request distribution across endpoints
- **Time Series**: Requests per minute over time

## 🔮 Roadmap

- [ ] Implement rate limiting enforcement
- [ ] Add Redis caching layer
- [ ] Real-time dashboard updates via WebSocket
- [ ] Alert system for threshold violations
- [ ] API key rotation and expiration
- [ ] Export analytics data (CSV/JSON)
- [ ] Webhook integration
- [ ] Custom metrics and dimensions
- [ ] Team permissions and roles
- [ ] Billing integration

## 🐛 Known Issues

1. **Authentication bypass in development**: Token verification is currently commented out
2. **Redis not utilized**: Configured but not integrated
3. **No rate limiting enforcement**: Rate limits stored but not enforced
4. **API key management**: Cannot list or revoke keys yet

See [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md#known-issues--todos) for complete list and production checklist.

## 🧪 Testing

Testing suite is not yet implemented. Planned:

- Unit tests for services
- Integration tests for API endpoints
- Security tests for authentication
- Load testing for performance

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow existing code patterns
4. Add tests for new features
5. Update documentation
6. Submit a pull request

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [PostgreSQL](https://www.postgresql.org/) for robust data storage
- [Express.js](https://expressjs.com/) for the web framework
- [Socket.IO](https://socket.io/) for WebSocket support

## 📞 Support

For questions or issues:
- Check the [documentation](./BACKEND_DOCUMENTATION.md)
- Review [architecture guide](./ARCHITECTURE.md)
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for developers who need reliable API monitoring**
