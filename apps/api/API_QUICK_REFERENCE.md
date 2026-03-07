# API Quick Reference

Quick endpoint reference for the API Rate Monitor backend.

## Base URL
```
http://localhost:8000
```

## Authentication
Protected management and analytics endpoints require:
```
Authorization: Bearer <clerk-jwt-token>
```

`POST /api/track` uses `x-api-key` and does not require a bearer token.

---

## Endpoints

### Health Check
```http
GET /health
```

### Auth
```http
POST /auth/sync                          # Sync user from Clerk
```

### Organizations
```http
POST   /organizations                    # Create organization
GET    /organizations                    # List user's organizations
```

### APIs
```http
POST   /api                              # Create API
GET    /api                              # List user APIs
DELETE /api/:id                          # Delete API
```

### API Keys
```http
POST   /api/:apiId/keys                  # Generate API key
```

### Usage Tracking
```http
POST   /api/track                        # Track API usage
Header: x-api-key: <generated-key>
Body: { endpoint, status, response_time }
```

Notes:
- Enforces Redis-backed per-API `rate_limit`
- Returns `429` when the limit is exceeded

### Analytics
```http
GET    /api/:apiId/stats                 # Get API statistics
GET    /api/:apiId/endpoints             # Get endpoint usage
GET    /api/:apiId/rpm                   # Get requests per minute
```

---

## Request/Response Examples

### Create API
```bash
curl -X POST http://localhost:8000/api \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API",
    "baseUrl": "https://api.example.com",
    "rateLimit": 1000
  }'
```

### Generate API Key
```bash
curl -X POST http://localhost:8000/api/<apiId>/keys \
  -H "Authorization: Bearer <token>"
```

### Track Usage
```bash
curl -X POST http://localhost:8000/api/track \
  -H "x-api-key: ak_live_abc123.def456..." \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "/users/profile",
    "status": 200,
    "response_time": 145
  }'
```

### Get Statistics
```bash
curl http://localhost:8000/api/<apiId>/stats \
  -H "Authorization: Bearer <token>"
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `429` - Rate Limit Exceeded
- `404` - Not Found
- `500` - Internal Server Error

---

## Environment Variables

```env
PORT=8000
POSTGRES_PASSWORD=<password>
DATABASE_NAME=<dbname>
REDIS_URL=<redis-url>
CLERK_SECRET_KEY=<clerk-secret>
```

---

## Database Tables

- `users` - User accounts
- `organizations` - Organizations
- `organization_members` - User-org relationships
- `apis` - API configurations
- `api_keys` - Hashed API keys
- `api_usage_logs` - Usage metrics

---

## API Key Format

```
ak_live_<6-hex-chars>.<48-hex-chars>
         ↑ prefix      ↑ secret
```

**Example:**
```
ak_live_a1b2c3.d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

## Metrics Explanation

### API Stats Response
- `totalRequests`: Total number of requests
- `errorRequests`: Requests with status >= 400
- `errorRate`: Percentage of errors
- `p50Latency`: Median response time (ms)
- `p95Latency`: 95th percentile (ms)
- `p99Latency`: 99th percentile (ms)

---

## WebSocket

Socket.IO server available at same port:
```javascript
io.on('connection', (socket) => {
  // Client connected
})
```

CORS origin: `http://localhost:3000`
