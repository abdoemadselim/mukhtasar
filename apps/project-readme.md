# Project Structure

This project follows a feature-based, clean architecture with a clear separation of concerns and route types (API vs UI). It supports both:

- **External API consumers** via `/api` (authenticated using opaque API keys)
- **Internal interface users** via `/` (e.g. via the Next frontend)

## 📁 Directory Structure

```
backend/
├── .vscode/               # VS Code configuration
├── dist/                  # Compiled TypeScript output
├── docs/                  # API documentation and design files
│   ├── api-doc.json
│   └── internal-doc.json
├── logs/                  # Application logs
│   ├── combined.log
│   ├── errors.log
│   ├── exceptions.log
│   └── newrelic_agent.log
├── node_modules/          # Dependencies
├── public/                # Static assets
│   ├── favicon.ico
│   └── logo-lg.png
├── src/                   # Source code
│   ├── features/          # Feature modules organized by business domain
│   │   ├── analytics/     # Analytics and tracking functionality
│   │   │   ├── controllers/
│   │   │   ├── data-access/
│   │   │   ├── domain/
│   │   │   ├── routes/
│   │   │   └── types.ts
│   │   ├── auth/          # Authentication and authorization
│   │   │   ├── controllers/
│   │   │   ├── data-access/
│   │   │   ├── domain/
│   │   │   └── routes/
│   │   ├── domain/        # Shared domain logic
│   │   │   └── data-access/
│   │   │       └── domain-repository.ts
│   │   ├── token/         # API token management
│   │   ├── url/           # URL shortening core functionality
│   │   └── user/          # User management
│   ├── lib/               # Shared utilities and libraries
│   │   ├── base-convertor/
│   │   ├── db/            # Database configuration
│   │   ├── email/
│   │   ├── error-handling/
│   │   ├── geo/           # Geolocation services
│   │   ├── logger/        # Logging utilities
│   │   ├── rate-limiting/
│   │   └── validation/
│   ├── middlewares/       # Express middlewares
│   │   ├── error-handler.ts
│   │   └── routes-context.ts
│   ├── routes/            # Main application routes
│   │   ├── api.routes.ts      # API routes aggregation
│   │   ├── public.routes.ts   # Public routes
│   │   └── ui.routes.ts       # UI routes aggregation
│   ├── templates/         # Template files
│   │   ├── env/
│   │   ├── env.production/
│   │   ├── combined.log
│   │   ├── errors.log
│   │   ├── exceptions.log
│   │   ├── newrelic_agent.log
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   └── main.ts            # Application entry point
├── package.json           # Project dependencies and scripts
├── README.md             # Project documentation
└── tsconfig.json         # TypeScript configuration
```

## 🏗️ Architecture Principles

### Feature-Based Organization
Each business feature is self-contained with its own:
- `controllers/` → Request handling and response formatting
- `routes/` → Express route definitions
- `data-access/` → Database operations and queries
- `domain/` → Business logic and entities
- `types.ts` → Feature-specific TypeScript types

### Route Separation
- `/api/**` → External API endpoints (authenticated via API keys)
- `/**` → Internal UI routes for frontend consumption

### Clean Architecture Layers
- **Routes** → Handle HTTP requests/responses
- **Controllers** → Coordinate between routes and domain logic
- **Domain** → Core business rules and use cases
- **Data Access** → Database operations and persistence

## 🔧 Key Features

### Core Features
- **Analytics** → URL click tracking and reporting
- **Auth** → Authentication and session management  
- **Token** → API key generation and validation
- **URL** → Link shortening and management
- **User** → Account creation and profile management

### Shared Services
- **Database** → Centralized DB connection and configuration
- **Error Handling** → Global error management and logging
- **Rate Limiting** → Request throttling and abuse prevention
- **Validation** → Input validation and sanitization
- **Geolocation** → IP-based location services
- **Email** → Notification and communication services

### Infrastructure
- **Logging** → Structured application logging
- **Middlewares** → Cross-cutting concerns (auth, CORS, etc.)
- **Templates** → Environment configurations and setup files

## 📊 Logging & Monitoring

The application maintains comprehensive logs:
- `combined.log` → All application events
- `errors.log` → Error-level events only
- `exceptions.log` → Unhandled exceptions
- `newrelic_agent.log` → Application performance monitoring

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp src/templates/env/.env.example .env
   ```

3. **Database Setup**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Development**
   ```bash
   npm run dev
   ```

5. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 🧪 Testing

Each feature includes its own test suite focusing on:
- Unit tests for domain logic
- Integration tests for data access
- API endpoint testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📚 API Documentation

- **Internal Documentation**: `docs/internal-doc.json`
- **External API Documentation**: `docs/api-doc.json`

## 🔒 Security Features

- API key authentication for external consumers
- Rate limiting to prevent abuse
- Input validation and sanitization
- Comprehensive error handling without information leakage