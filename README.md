# API Rate Monitor SaaS

A full-stack SaaS application for monitoring API usage, tracking performance metrics, and analyzing endpoint behavior in real-time.

## 🚀 Overview

API Rate Monitor helps developers and teams track their API usage, monitor performance, and gain insights into their API behavior. Built with a modern tech stack and designed for scalability.

## 📦 Monorepo Structure

This is a Turborepo monorepo containing the following applications and packages:

### Apps

- **`api`**: Node.js/Express backend API server
  - Authentication with Clerk
  - PostgreSQL database
  - Redis for caching
  - Socket.IO for real-time updates
  - [📖 View Backend Documentation](./apps/api/README.md)
  
- **`web`**: Next.js frontend application
  - React-based UI
  - Server-side rendering
  - Authentication with Clerk
  - Real-time dashboard

### Packages

- **`@repo/ui`**: Shared React component library
  - Button, Card, Code components
  - Reusable across applications
  
- **`@repo/eslint-config`**: Shared ESLint configurations
  - Base config
  - Next.js config
  - React internal config
  
- **`@repo/typescript-config`**: Shared TypeScript configurations
  - Base config
  - Next.js config
  - React library config

## ✨ Features

- 🔐 **Secure Authentication**: Clerk-based authentication system
- 👥 **Multi-tenant Support**: Organization and team management
- 🔑 **API Key Management**: Generate and manage secure API keys
- 📊 **Usage Tracking**: Real-time API usage logging
- 📈 **Analytics Dashboard**: Performance metrics and insights
- ⚡ **Real-time Updates**: WebSocket-based live data
- 🗄️ **Robust Storage**: PostgreSQL for reliability
- 🚀 **High Performance**: Redis caching layer

## 🛠 Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL
- Redis
- Socket.IO
- Clerk
- bcrypt

### Frontend
- Next.js 14+
- React
- TypeScript
- Tailwind CSS (planned)
- Clerk

### DevOps
- Turborepo for monorepo management
- pnpm for package management
- ESLint for code quality
- TypeScript for type safety

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- PostgreSQL (v14+)
- Redis (v6+)
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd API_RATE_MONITOR_SAAS
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   For the backend:
   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env with your configuration
   ```

   For the frontend:
   ```bash
   cd apps/web
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   psql -U postgres
   CREATE DATABASE api_rate_monitor;
   
   # Run migrations (from apps/tables.md)
   psql -U postgres -d api_rate_monitor -f apps/tables.sql
   ```

5. **Start development servers**
   
   From the root directory:
   ```bash
   # Start all apps in development mode
   pnpm dev
   ```
   
   Or start individually:
   ```bash
   # Backend only
   cd apps/api
   pnpm dev
   
   # Frontend only
   cd apps/web
   pnpm dev
   ```

### Access the Application

- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Health Check**: http://localhost:8000/health

## 📚 Documentation

Comprehensive documentation is available for each component:

### Backend Documentation
- [Backend README](./apps/api/README.md) - Quick start and overview
- [Backend API Documentation](./apps/api/BACKEND_DOCUMENTATION.md) - Complete API reference
- [API Quick Reference](./apps/api/API_QUICK_REFERENCE.md) - Quick lookup guide
- [Architecture Guide](./apps/api/ARCHITECTURE.md) - System design and patterns

### Database
- [Database Schema](./apps/tables.md) - Table definitions and relationships

## 🏗️ Project Structure

```
API_RATE_MONITOR_SAAS/
├── apps/
│   ├── api/                    # Backend API server
│   │   ├── src/
│   │   │   ├── config/        # Configuration files
│   │   │   ├── middleware/    # Express middleware
│   │   │   ├── modules/       # Feature modules
│   │   │   ├── types/         # TypeScript types
│   │   │   ├── utils/         # Utility functions
│   │   │   └── socket.ts      # WebSocket setup
│   │   ├── index.ts           # Entry point
│   │   ├── app.ts             # Express config
│   │   └── routes.ts          # Route registration
│   │
│   ├── web/                    # Frontend application
│   │   ├── app/               # Next.js app directory
│   │   └── public/            # Static assets
│   │
│   └── tables.md              # Database schema
│
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── eslint-config/          # Shared ESLint config
│   └── typescript-config/      # Shared TS config
│
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # pnpm workspace config
└── turbo.json                  # Turborepo config
```

## 🔧 Development

### Building

Build all apps and packages:
```bash
pnpm build
```

Build specific app:
```bash
pnpm --filter api build
pnpm --filter web build
```

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm type-check
```

## 📊 API Endpoints Overview

```
GET    /health                  # Health check
POST   /auth/sync               # Sync user from Clerk
POST   /organizations           # Create organization
GET    /organizations           # List organizations
POST   /api                     # Create API
GET    /api                     # List APIs
POST   /api/:apiId/keys         # Generate API key
POST   /api/track               # Track API usage
GET    /api/:apiId/stats        # Get statistics
GET    /api/:apiId/endpoints    # Endpoint usage
GET    /api/:apiId/rpm          # Requests per minute
```

See [API Quick Reference](./apps/api/API_QUICK_REFERENCE.md) for detailed documentation.

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts (synced from Clerk)
- `organizations` - Organization management
- `organization_members` - User-org relationships
- `apis` - API configurations
- `api_keys` - Hashed API keys
- `api_usage_logs` - Usage metrics

See [Database Schema](./apps/tables.md) for complete details.

## 🔮 Roadmap

### Backend
- [x] Enforce per-API rate limiting on usage tracking
- [ ] Add Redis caching layer
- [ ] Real-time dashboard updates
- [ ] Alert system for threshold violations
- [ ] API key rotation
- [ ] Comprehensive testing suite

### Frontend
- [ ] Dashboard with real-time metrics
- [ ] API management interface
- [ ] Organization management UI
- [ ] Analytics visualizations
- [ ] Alert configuration UI

### DevOps
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Monitoring and logging
- [ ] Load testing

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

- [Turborepo](https://turborepo.org/) for monorepo management
- [Next.js](https://nextjs.org/) for the frontend framework
- [Clerk](https://clerk.com/) for authentication
- [PostgreSQL](https://www.postgresql.org/) for database
- [Express.js](https://expressjs.com/) for the backend framework

## 📞 Support

For questions or issues:
- Check the documentation in the respective app folders
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for developers who need reliable API monitoring**

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
