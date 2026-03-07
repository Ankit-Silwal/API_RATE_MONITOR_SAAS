# Backend API Documentation

## Overview

This is the backend API for the API Rate Monitor SaaS application. It provides endpoints for managing APIs, tracking their usage, generating API keys, and analyzing performance metrics. The system supports multi-tenant architecture with organizations and user management.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **WebSocket**: Socket.IO
- **Authentication**: Clerk
- **Password Hashing**: bcrypt
- **Development**: ts-node-dev

## Architecture

The backend follows a modular architecture with clear separation of concerns:

```
apps/api/
├── index.ts              # Application entry point
├── app.ts                # Express app configuration
├── routes.ts             # Route registration
└── src/
    ├── config/           # Database and Redis configuration
    ├── middleware/       # Authentication middleware
    ├── modules/          # Feature modules
    ├── types/            # TypeScript type definitions
    ├── utils/            # Utility functions
    └── socket.ts         # WebSocket configuration
```

## Database Schema

### Tables

#### `users`
Stores user account information synchronized from Clerk.
```sql
- id (uuid, PK)
- clerk_user_id (text, unique)
- email (text)
- created_at (timestamp)
```

#### `organizations`
Stores organization information for multi-tenant support.
```sql
- id (uuid, PK)
- name (text)
- created_at (timestamp)
```

#### `organization_members`
Junction table for user-organization relationships with role management.
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users)
- organization_id (uuid, FK -> organizations)
- role (text: 'member' | 'admin')
```

#### `apis`
Stores API configurations that users want to monitor.
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users)
- name (text)
- base_url (text)
- rate_limit (integer)
- created_at (timestamp)
```

#### `api_keys`
Stores hashed API keys for secure authentication.
```sql
- id (uuid, PK)
- api_id (uuid, FK -> apis)
- key_prefix (text)
- key_hash (text)
- created_at (timestamp)
```

#### `api_usage_logs`
Stores API usage metrics for analytics.
```sql
- id (uuid, PK)
- api_id (uuid, FK -> apis)
- endpoint (text)
- status_code (integer)
- response_time (integer - in milliseconds)
- recorded_at (timestamp)
```

**Indexes:**
- `idx_api_usage_api_id` on `api_usage_logs(api_id)`
- `idx_api_usage_logs_recorded_at` on `api_usage_logs(recorded_at)`

## Configuration

### Environment Variables

```env
# Server
PORT=8000

# Database
POSTGRES_PASSWORD=<your-postgres-password>
DATABASE_NAME=<your-database-name>

# Redis
REDIS_URL=<your-redis-url>

# Clerk Authentication
CLERK_SECRET_KEY=<your-clerk-secret-key>
```

### Database Configuration (`src/config/db.ts`)

Uses `pg` Pool for PostgreSQL connections:
- Host: localhost
- Port: 5432
- User: postgres
- Connection pooling enabled

### Redis Configuration (`src/config/redis.ts`)

Redis client for caching and session management:
- Connects on application startup
- Provides event handlers for errors and ready states
- Singleton pattern for client access

## Authentication

### Middleware (`src/middleware/auth.ts`)

**`requireAuth` Middleware**
- Validates requests using Clerk authentication
- Extracts user ID from JWT token
- Attaches `userId` to Express request object
- Currently bypassed for development (hardcoded user ID)

**Token Verification:**
```typescript
// Production flow (currently commented):
// 1. Extract Authorization header
// 2. Verify token with Clerk backend SDK
// 3. Attach userId and payload to request
// 4. Return 401 if invalid
```

## API Endpoints

### Base URL
```
http://localhost:8000
```

### Health Check

#### `GET /health`
Returns server health status.

**Response:**
```json
{
  "success": true,
  "health": "fit as fuck sir"
}
```

---

## Auth Module (`/auth`)

### Sync User

#### `POST /auth/sync`
Synchronizes user data from Clerk to the local database.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

**Flow:**
1. Validates authentication
2. Fetches user details from Clerk
3. Checks if user exists in database
4. Creates user record if not exists

---

## Organization Module (`/organizations`)

### Create Organization

#### `POST /organizations`
Creates a new organization and adds the creator as an admin.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Organization Name"
}
```

**Response:**
```json
{
  "organizationId": "uuid"
}
```

**Status Codes:**
- 201: Success
- 400: Missing name or creation failed
- 401: Unauthorized

### Get User Organizations

#### `GET /organizations`
Retrieves all organizations the authenticated user belongs to.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "organizations": [
    {
      "id": "uuid",
      "name": "Organization Name"
    }
  ]
}
```

---

## API Module (`/api`)

### Create API

#### `POST /api`
Creates a new API configuration to monitor.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My API",
  "baseUrl": "https://api.example.com",
  "rateLimit": 1000
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "My API",
  "base_url": "https://api.example.com",
  "rate_limit": 1000,
  "created_at": "2026-03-06T00:00:00.000Z"
}
```

**Status Codes:**
- 201: Success
- 401: Unauthorized
- 404: User not found
- 500: Server error

### Get User APIs

#### `GET /api`
Retrieves all APIs for the authenticated user.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "My API",
    "base_url": "https://api.example.com",
    "rate_limit": 1000,
    "created_at": "2026-03-06T00:00:00.000Z"
  }
]
```

### Delete API

#### `DELETE /api/:id`
Deletes an API configuration.

**Headers:**
- `Authorization: Bearer <token>`

**Parameters:**
- `id` (path): API UUID

**Response:**
```json
{
  "message": "API deleted"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: API not found

---

## API Key Management

### Generate API Key

#### `POST /api/:apiId/keys`
Generates a new API key for the specified API.

**Headers:**
- `Authorization: Bearer <token>`

**Parameters:**
- `apiId` (path): API UUID

**Response:**
```json
{
  "message": "API key generated",
  "apiKey": "ak_live_abc123.def456...",
  "keyId": "uuid",
  "createdAt": "2026-03-06T00:00:00.000Z"
}
```

**Key Format:**
- Prefix: `ak_live_<6-char-hex>`
- Secret: `<48-char-hex>`
- Full Key: `prefix.secret`

**Security:**
- Secret is hashed with bcrypt (10 salt rounds)
- Only prefix and hash are stored in database
- Full key shown only once at generation

---

## Usage Tracking

### Track API Usage

#### `POST /api/track`
Logs API usage for analytics.

**Headers:**
- `x-api-key: <api-key>`

**Notes:**
- Uses API-key authentication for tracking (no bearer token required)
- Enforces Redis-backed per-API `rate_limit` before inserting usage logs

**Request Body:**
```json
{
  "endpoint": "/users/profile",
  "status": 200,
  "response_time": 145
}
```

**Response:**
```json
{
  "message": "Usage logged"
}
```

**When Rate Limit Is Exceeded:**
```json
{
  "message": "Rate limit exceeded"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid payload
- 401: Invalid API key
- 429: Rate limit exceeded
- 500: Server error

**Validation:**
1. Extracts API key from header
2. Splits key into prefix and secret
3. Looks up key by prefix
4. Verifies secret with bcrypt
5. Enforces API `rate_limit` with Redis before logging
6. Logs usage to database

---

## Analytics

### Get API Statistics

#### `GET /api/:apiId/stats`
Returns aggregated statistics for an API.

**Headers:**
- `Authorization: Bearer <token>`

**Parameters:**
- `apiId` (path): API UUID

**Response:**
```json
{
  "totalRequests": 10000,
  "errorRequests": 250,
  "errorRate": 2.5,
  "p50Latency": 100,
  "p95Latency": 250,
  "p99Latency": 500
}
```

**Metrics:**
- **totalRequests**: Total number of logged requests
- **errorRequests**: Requests with status code >= 400
- **errorRate**: Percentage of error requests
- **p50Latency**: 50th percentile response time (median)
- **p95Latency**: 95th percentile response time
- **p99Latency**: 99th percentile response time

### Get Endpoint Usage

#### `GET /api/:apiId/endpoints`
Returns request counts grouped by endpoint.

**Parameters:**
- `apiId` (path): API UUID

**Response:**
```json
[
  {
    "endpoint": "/users/profile",
    "requests": 5000
  },
  {
    "endpoint": "/users/settings",
    "requests": 3000
  }
]
```

### Get Requests Per Minute

#### `GET /api/:apiId/rpm`
Returns time-series data of requests per minute.

**Parameters:**
- `apiId` (path): API UUID

**Response:**
```json
[
  {
    "minute": "2026-03-06T10:00:00.000Z",
    "requests": 150
  },
  {
    "minute": "2026-03-06T10:01:00.000Z",
    "requests": 160
  }
]
```

**Note:** Uses PostgreSQL's `date_trunc()` function to aggregate by minute.

---

## WebSocket Support

### Socket.IO Configuration (`src/socket.ts`)

**Initialization:**
```typescript
initSocket(httpServer)
```

**CORS Settings:**
- Origin: `http://localhost:3000`

**Events:**
- `connection`: Client connects
- `disconnected`: Client disconnects

**Usage:**
```typescript
import { getIo } from './src/socket'

const io = getIo()
io.emit('event', data)
```

**Future Use Cases:**
- Real-time dashboard updates
- Live API usage notifications
- Instant alert broadcasting

---

## Utility Functions

### Generate API Keys (`utils/generateApiKeys.ts`)

```typescript
generateApiKeys()
```

**Returns:**
```typescript
{
  fullKey: string,    // "ak_live_abc123.def456..."
  prefix: string,     // "ak_live_abc123"
  secret: string      // "def456..."
}
```

**Implementation:**
- Uses Node.js `crypto.randomBytes()`
- Prefix: 3 bytes (6 hex chars)
- Secret: 24 bytes (48 hex chars)
- Cryptographically secure random generation

### Hash API Key (`utils/hashApiKeys.ts`)

```typescript
hashApiKey(secret: string): Promise<string>
```

**Parameters:**
- `secret`: The secret portion of the API key

**Returns:**
- Bcrypt hash with 10 salt rounds

**Security:**
- Industry-standard bcrypt algorithm
- Protects against rainbow table attacks
- Resistant to brute force

---

## Module Structure

### Auth Module
**Files:**
- `auth.controller.ts` - Request handlers
- `auth.routes.ts` - Route definitions
- `auth.services.ts` - Business logic

**Responsibilities:**
- User synchronization with Clerk
- Session management

### Organization Module
**Files:**
- `organization.controller.ts` - Request handlers
- `organization.routes.ts` - Route definitions
- `organization.services.ts` - Business logic

**Responsibilities:**
- Organization CRUD operations
- Member management
- Role-based access

### API Module
**Files:**
- `api.controller.ts` - API management handlers
- `api.services.ts` - API business logic
- `api.types.ts` - TypeScript interfaces
- `apiKey.controller.ts` - Key generation handlers
- `apiKey.service.ts` - Key generation logic
- `track.controller.ts` - Usage tracking handlers
- `track.service.ts` - Usage tracking logic
- `analytics.controller.ts` - Analytics handlers
- `analytics.service.ts` - Analytics queries
- `api.routes.ts` - Route definitions

**Responsibilities:**
- API configuration management
- API key generation and validation
- Usage tracking and logging
- Analytics and reporting

---

## Type Definitions

### Express Request Extension (`types/express.d.ts`)

Extends Express Request with Clerk authentication:

```typescript
declare global {
  namespace Express {
    interface Request {
      userId?: string
      clerkPayLoad?: JwtPayload
    }
  }
}
```

### API Types (`modules/api/api.types.ts`)

```typescript
interface CreateApiBody {
  name: string
  baseUrl: string
  rateLimit: number
}
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**400 Bad Request:**
```json
{
  "error": "Invalid request",
  "message": "Description of the error"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Operation failed",
  "error": "Error description"
}
```

---

## Security Features

### Authentication
- JWT-based authentication via Clerk
- Token verification on protected routes
- User session management

### API Key Security
- Keys are hashed with bcrypt before storage
- Prefix allows fast lookup without exposing secrets
- Secret comparison uses constant-time algorithm
- Keys generated with cryptographically secure randomness

### Database Security
- Parameterized queries prevent SQL injection
- Connection pooling for resource management
- Foreign key constraints maintain data integrity
- Cascade deletes prevent orphaned records

### CORS Configuration
- Restricted to frontend origin (`http://localhost:3000`)
- Credentials enabled for cookie-based auth
- Prevents unauthorized cross-origin requests

---

## Database Queries

### Performance Optimizations

**Indexes:**
- `api_usage_logs(api_id)` - Fast usage log lookups
- `api_usage_logs(recorded_at)` - Efficient time-based queries

**Aggregation Functions:**
- `percentile_cont()` - Latency percentile calculations
- `COUNT() FILTER` - Conditional counting for error rates
- `date_trunc()` - Time-series grouping

**Connection Management:**
- Pool connections for concurrent requests
- Explicit client release in tracking service
- Connection error handling

---

## Development

### Running the Server

```bash
npm run dev
```

Starts the server with:
- Hot reload enabled
- TypeScript transpilation
- Port: 8000 (default)

### Scripts

```json
{
  "dev": "ts-node-dev --respawn --transpile-only index.ts",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

---

## Known Issues & TODOs

### Current State

1. **Authentication Bypass**: The `requireAuth` middleware has token verification commented out with a hardcoded user ID for development.

2. **No API Key Listing**: Cannot retrieve or revoke existing API keys.

3. **Limited WebSocket Usage**: Socket.IO is configured but not actively used for real-time features.

4. **Redis Used Minimally**: Redis currently backs rate limiting but is not yet used for caching.

### Production Checklist

- [ ] Enable Clerk token verification
- [ ] Add API key management endpoints (list, revoke)
- [ ] Expand Redis usage for response/query caching
- [ ] Add request validation middleware
- [ ] Implement comprehensive error logging
- [ ] Add database migrations system
- [ ] Set up monitoring and alerting
- [ ] Configure production CORS origins
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement request throttling
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline

---

## API Response Times

The system tracks response times in milliseconds for each API call. This data is used to calculate latency percentiles (P50, P95, P99) which help identify performance bottlenecks.

---

## Future Enhancements

1. **Real-time Dashboard**: Use Socket.IO to push live metrics to connected clients
2. **Alert System**: Notify users when APIs exceed thresholds
3. **Rate Limiting Strategy**: Add advanced policies (burst controls, sliding windows)
4. **API Key Rotation**: Scheduled key expiration and rotation
5. **Team Management**: Enhanced organization features with permissions
6. **Webhook Integration**: Allow APIs to send usage data via webhooks
7. **Custom Metrics**: User-defined metrics and dimensions
8. **Export Functionality**: CSV/JSON export of analytics data
9. **API Versioning**: Support for multiple API versions
10. **Billing Integration**: Usage-based billing via Stripe

---

## Support

For issues or questions, please refer to the project repository or contact the development team.

---

**Last Updated:** March 7, 2026
**API Version:** 1.0.0
