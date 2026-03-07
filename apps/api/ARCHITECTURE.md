# Backend Architecture Guide

## System Overview

The API Rate Monitor backend is a Node.js/Express application designed to track, monitor, and analyze API usage metrics. It follows a modular, service-oriented architecture with clear separation between routing, business logic, and data access layers.

---

## Architectural Patterns

### 1. Modular Architecture

Each feature is organized into self-contained modules:

```
modules/
  ├── auth/
  │   ├── auth.controller.ts    # HTTP request handlers
  │   ├── auth.routes.ts        # Route definitions
  │   └── auth.services.ts      # Business logic
  ├── organization/
  │   ├── organization.controller.ts
  │   ├── organization.routes.ts
  │   └── organization.services.ts
  └── api/
      ├── api.controller.ts
      ├── api.services.ts
      ├── api.types.ts
      ├── apiKey.controller.ts
      ├── apiKey.service.ts
      ├── track.controller.ts
      ├── track.service.ts
      ├── analytics.controller.ts
      ├── analytics.service.ts
      └── api.routes.ts
```

**Benefits:**
- Clear boundaries between features
- Easy to locate and modify code
- Facilitates team collaboration
- Supports independent testing

### 2. Layered Architecture

```
┌─────────────────────────────────┐
│    Routes (HTTP Interface)       │  - Route definitions
├─────────────────────────────────┤
│    Controllers (Request/Response)│  - Input validation
│                                  │  - Response formatting
├─────────────────────────────────┤
│    Services (Business Logic)     │  - Core functionality
│                                  │  - Transaction management
├─────────────────────────────────┤
│    Data Access (Database)        │  - SQL queries
│                                  │  - Connection pooling
└─────────────────────────────────┘
```

**Layer Responsibilities:**

**Routes Layer:**
- Define HTTP endpoints and methods
- Apply middleware (auth, validation)
- Register controllers

**Controller Layer:**
- Handle Express request/response objects
- Validate request data
- Format responses
- Handle HTTP status codes
- Error handling

**Service Layer:**
- Implement business logic
- Database transactions
- Data transformation
- Integration with external services

**Data Access Layer:**
- Direct database queries
- Connection management
- Query parameterization

### 3. Dependency Injection

Services and utilities are passed as dependencies:

```typescript
// Controller depends on service
import { createApi } from "./api.services"

export const createApiController = async (req, res) => {
  const result = await createApi(userId, name, baseUrl, rateLimit)
  return res.status(201).json(result)
}
```

**Benefits:**
- Easier unit testing (mock services)
- Loose coupling between layers
- Flexible for refactoring

---

## Design Decisions

### 1. PostgreSQL for Primary Storage

**Why PostgreSQL?**
- ACID compliance for data integrity
- Powerful aggregation functions (percentile_cont)
- Excellent indexing for time-series data
- JSON support for flexible schemas
- Mature ecosystem

**Usage Patterns:**
- Connection pooling for performance
- Parameterized queries for security
- Indexes on frequently queried columns
- Foreign keys for referential integrity

### 2. API Key Security

**Two-Part Key System:**
```
ak_live_abc123.def456789...
        ↑           ↑
    prefix      secret
```

**Design Rationale:**
- **Prefix**: Stored in database for fast lookup
- **Secret**: Hashed with bcrypt, never stored plain
- **Verification**: Constant-time comparison prevents timing attacks

**Security Properties:**
- Keys are cryptographically random (crypto.randomBytes)
- Bcrypt hashing with 10 salt rounds
- Resistant to rainbow table attacks
- Fast prefix lookup, secure secret verification

### 3. Clerk Authentication

**Why Clerk?**
- Managed authentication service
- JWT-based token verification
- User management handled externally
- Multi-factor authentication support
- Social login providers

**Integration Pattern:**
```
Client → Clerk → JWT Token → Backend → Verify Token → Process Request
```

**Local User Sync:**
- Clerk manages auth, we sync user records
- Local UUID for internal references
- Email stored for user communication

### 4. Time-Series Data Model

**Logging Pattern:**
```sql
api_usage_logs (
  id, api_id, endpoint, status_code, 
  response_time, recorded_at
)
```

**Optimizations:**
- Index on `api_id` for user queries
- Index on `recorded_at` for time-range queries
- Minute-level aggregation with `date_trunc`
- Percentile calculations for latency metrics

**Aggregation Examples:**
```sql
-- Error rate
COUNT(*) FILTER (WHERE status_code >= 400)

-- Latency percentiles
percentile_cont(0.95) WITHIN GROUP (ORDER BY response_time)

-- Requests per minute
date_trunc('minute', recorded_at)
```

### 5. Multi-Tenant Architecture

**Organization Model:**
```
users ←→ organization_members ←→ organizations
                  ↓
              role (admin/member)
```

**Benefits:**
- Teams can collaborate on APIs
- Role-based access control
- Data isolation between orgs
- Scalable for enterprise use

### 6. Socket.IO Integration

**Purpose:**
- Real-time dashboard updates
- Live alert notifications
- WebSocket-based communication

**Current State:**
- Configured but not actively used
- Ready for future real-time features

**Pattern:**
```typescript
// Initialize once
initSocket(httpServer)

// Use anywhere
const io = getIo()
io.emit('apiUsage', data)
```

---

## Data Flow Diagrams

### API Creation Flow
```
Client Request
     ↓
requireAuth Middleware → Verify JWT
     ↓
createApiController → Validate input
     ↓
createApi Service → Insert to DB
     ↓
Response with API ID
```

### API Key Generation Flow
```
Client Request
     ↓
requireAuth Middleware
     ↓
generateApiKeyController
     ↓
createApiKey Service
     ↓
generateApiKeys() → Random bytes
     ↓
hashApiKey() → Bcrypt hash
     ↓
Store prefix + hash
     ↓
Return full key (only time visible)
```

### Usage Tracking Flow
```
Client Request with x-api-key
     ↓
trackUsageController → Extract key
     ↓
trackApiUsage Service
     ↓
Split key → prefix.secret
     ↓
DB: Find by prefix
     ↓
bcrypt.compare(secret, hash)
     ↓
Redis rate check using API rate_limit
  ↓
If allowed: Insert usage log
     ↓
Response: Usage logged
```

### Analytics Flow
```
Client Request
     ↓
requireAuth Middleware
     ↓
getApiStatsController
     ↓
getApiStats Service
     ↓
Aggregate Query:
  - COUNT(*)
  - COUNT() FILTER
  - percentile_cont()
     ↓
Format and return metrics
```

---

## Code Organization Principles

### 1. Single Responsibility

Each file/function has one clear purpose:
- **Controllers**: Handle HTTP
- **Services**: Implement logic
- **Utils**: Reusable functions

### 2. DRY (Don't Repeat Yourself)

Common logic extracted to utilities:
- `generateApiKeys()` - Key generation
- `hashApiKey()` - Hashing logic
- `getUserIdFromClerkId()` - ID mapping

### 3. Explicit Over Implicit

Clear naming and type definitions:
```typescript
interface CreateApiBody {
  name: string
  baseUrl: string
  rateLimit: number
}
```

### 4. Error Handling Patterns

**Service Layer:**
```typescript
try {
  const result = await performOperation()
  return result
} catch (error) {
  throw new Error("Operation failed")
}
```

**Controller Layer:**
```typescript
try {
  const result = await service()
  return res.status(200).json(result)
} catch (error) {
  return res.status(500).json({ error: error.message })
}
```

---

## Database Design Principles

### 1. Normalized Schema

- Third normal form (3NF)
- No redundant data
- Foreign key relationships

### 2. UUID Primary Keys

**Benefits:**
- Globally unique
- Non-sequential (security)
- Distributed system ready
- No auto-increment collisions

### 3. Timestamps

All tables include `created_at`:
- Audit trail
- Chronological ordering
- Time-based filtering

### 4. Cascade Deletes

```sql
api_id uuid references apis(id) on delete cascade
```

**Rationale:**
- Automatic cleanup
- Data consistency
- Prevents orphaned records

### 5. Check Constraints

```sql
role text check(role in ('member', 'admin'))
```

**Benefits:**
- Data validation at DB level
- Prevent invalid states
- Self-documenting schema

---

## Performance Considerations

### 1. Database Connection Pooling

```typescript
const pool = new Pool({
  // Reuses connections
  // Prevents connection exhaustion
})
```

### 2. Strategic Indexing

```sql
CREATE INDEX idx_api_usage_api_id ON api_usage_logs(api_id)
CREATE INDEX idx_api_usage_logs_recorded_at ON api_usage_logs(recorded_at)
```

**Impact:**
- Fast lookup by API
- Efficient time-range queries
- Improved aggregation performance

### 3. Query Optimization

- Use specific columns instead of `SELECT *`
- WHERE clauses use indexed columns
- GROUP BY on indexed columns
- LIMIT results when appropriate

### 4. Async/Await Pattern

All I/O operations are asynchronous:
```typescript
async function createApi(userId, name, baseUrl, rateLimit) {
  const result = await pool.query(...)
  return result.rows[0]
}
```

**Benefits:**
- Non-blocking operations
- Better resource utilization
- Handles concurrent requests

---

## Security Architecture

### 1. Defense in Depth

Multiple security layers:
- Authentication (Clerk JWT)
- Authorization (user ID checks)
- SQL injection prevention (parameterized queries)
- API key hashing (bcrypt)
- CORS restrictions

### 2. Principle of Least Privilege

- Database user with minimal permissions
- Route-level authentication
- User can only access own resources

### 3. Input Validation

```typescript
if (!name) {
  return res.status(400).json({ error: "Name required" })
}
```

### 4. Secure Random Generation

```typescript
crypto.randomBytes(24) // Cryptographically secure
```

### 5. Constant-Time Comparison

```typescript
bcrypt.compare(secret, hash) // Prevents timing attacks
```

---

## Scalability Considerations

### Current State (Single Server)
```
Client → Express Server → PostgreSQL + Redis
```

### Future Horizontal Scaling
```
     Load Balancer
          ↓
    ┌─────┴─────┐
    ↓           ↓
Server 1    Server 2
    ↓           ↓
    └─────┬─────┘
          ↓
    PostgreSQL (Primary)
          ↓
    Redis (Shared)
```

**Prepared For:**
- Stateless server design
- Connection pooling
- UUIDs for distributed IDs
- Redis for shared state

### Vertical Scaling
- PostgreSQL read replicas
- Redis cluster
- Database partitioning by user_id

---

## Testing Strategy (Recommended)

### 1. Unit Tests
- Test services in isolation
- Mock database calls
- Test utility functions

### 2. Integration Tests
- Test API endpoints
- Use test database
- Verify data persistence

### 3. Security Tests
- API key validation
- Authorization checks
- SQL injection prevention

---

## Monitoring & Observability

### Recommended Additions

**Logging:**
- Request/response logging
- Error tracking (Sentry)
- Performance metrics

**Metrics:**
- Request rate
- Response times
- Error rates
- Database query times

**Alerts:**
- High error rate
- Slow queries
- Database connection exhaustion

---

## Development Workflow

### Local Setup
```bash
1. Install dependencies: npm install
2. Setup PostgreSQL database
3. Setup Redis
4. Configure .env file
5. Run migrations (create tables)
6. Start dev server: npm run dev
```

### Adding New Features

**1. Create Module Structure:**
```
modules/newfeature/
  ├── newfeature.controller.ts
  ├── newfeature.routes.ts
  ├── newfeature.services.ts
  └── newfeature.types.ts
```

**2. Define Types:**
```typescript
// newfeature.types.ts
export interface CreateFeatureBody {
  // Define request structure
}
```

**3. Implement Service:**
```typescript
// newfeature.services.ts
export async function createFeature(data) {
  const result = await pool.query(...)
  return result.rows[0]
}
```

**4. Implement Controller:**
```typescript
// newfeature.controller.ts
export async function createFeatureController(req, res) {
  const result = await createFeature(req.body)
  return res.status(201).json(result)
}
```

**5. Define Routes:**
```typescript
// newfeature.routes.ts
router.post('/', requireAuth, createFeatureController)
```

**6. Register Routes:**
```typescript
// routes.ts
import newfeatureRoutes from './modules/newfeature/newfeature.routes'
app.use('/newfeature', newfeatureRoutes)
```

---

## Common Patterns

### Controller Pattern
```typescript
export async function actionController(req, res) {
  // 1. Check authentication
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // 2. Extract and validate input
  const { field } = req.body
  if (!field) {
    return res.status(400).json({ error: "Field required" })
  }

  // 3. Call service
  try {
    const result = await serviceFunction(req.userId, field)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
```

### Service Pattern
```typescript
export async function serviceFunction(userId, data) {
  // 1. Validate business rules
  // 2. Perform database operations
  const result = await pool.query(
    `INSERT INTO table (user_id, data) VALUES ($1, $2) RETURNING *`,
    [userId, data]
  )
  // 3. Return data
  return result.rows[0]
}
```

---

## Configuration Management

### Environment-Based Config
```typescript
const config = {
  port: process.env.PORT || 8000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432')
  }
}
```

### Centralized Configuration
- `src/config/db.ts` - Database setup
- `src/config/redis.ts` - Redis setup
- Future: `src/config/index.ts` - Central config

---

## Best Practices Followed

1. ✅ TypeScript for type safety
2. ✅ Async/await for async operations
3. ✅ Parameterized SQL queries
4. ✅ Connection pooling
5. ✅ Environment variables for secrets
6. ✅ Modular code organization
7. ✅ RESTful API design
8. ✅ HTTP status code standards
9. ✅ Error handling in controllers
10. ✅ Secure API key generation

---

## Architecture Improvements (Roadmap)

### Short Term
- [ ] Add request validation middleware (express-validator)
- [ ] Implement Redis caching for frequently accessed data
- [ ] Improve rate limiting strategy (sliding windows/burst controls)
- [ ] Set up structured logging (Winston/Pino)

### Medium Term
- [ ] Implement database migrations (TypeORM/Knex)
- [ ] Add API documentation (Swagger)
- [ ] Set up comprehensive testing suite
- [ ] Implement background job processing (Bull)

### Long Term
- [ ] Microservices architecture (if needed)
- [ ] Event-driven architecture with message queues
- [ ] GraphQL API option
- [ ] Implement CQRS pattern for analytics

---

## Conclusion

This architecture provides:
- 🔒 **Security**: Multiple layers of protection
- 📈 **Scalability**: Prepared for growth
- 🧩 **Modularity**: Easy to extend and maintain
- ⚡ **Performance**: Optimized queries and indexing
- 🛠️ **Maintainability**: Clear structure and patterns

The modular design and clear separation of concerns make it easy to add new features, fix bugs, and scale the application as needed.
