# Project Structure

This project follows a feature-based, clean architecture with a clear separation of concerns and route types (API vs UI). It supports both:

- **External API consumers** via `/api` (authenticated using opaque API keys)
- **Internal interface users** via `/` (e.g. via the Next frontend)

## 📁 Directory Structure

```
.husky/ The folder husky generates for hooking the commitlint to git commit
|
docs/ Diagrams and design files
|
src/
├── features/           # Feature modules organized by business domain
│   ├── feature1/         # e.g URL shortening functionality
|   |   ├── routes/
│   |   |   ├── api.ts            # External API routes (e.g., /api/shorten)
│   |   |   └── ui.ts             # Internal interface routes (e.g., /shorten)
│   │   ├── data-access/    # Data layer for URL shortening
│   │   ├── domain/         # Business logic and entities
│   │   └── test/           # Feature-specific tests
│   ├── feature2/         # e.g. API tokens #
|   |   ├── routes/
│   |   |   ├── api.ts            # External API routes (e.g., /api/shorten)
│   |   |   └── ui.ts             # Internal interface routes (e.g., /shorten)
│   │   ├── data-access/    # Data layer for Token data operations
│   │   ├── domain/         # Token business logic
│   │   └── test/           # Token-related tests
├── routes/
│   ├── api.ts # Main router for /api endpoints
  │ └── ui.ts # Main router for internal UI routes
├── lib/                # Shared utilities and libraries
│   ├── db/             # Database configuration and connection
│   │   └── db-connection.ts
│   └── error-handler/  # Global error handling
│       └── errors-types.ts (defines the different errors types/classes)
└── public/             # Static assets and public files
└── main.ts         # Application entry point
```

## 🏗️ Architecture Principles

### Feature-Based Organization
### Feature-Based Modularity
Each business feature (e.g. URL, Tokens, Analytics) is self-contained with its own:
- `routes/api/` → Express routes for external APIs
- `routes/ui/` → Express routes for internal interface usage
- `data-access/` → DB logic (SQL, queries)
- `domain/` → Use cases, business rules
- `test/` → Focused tests per feature

### Route Separation
- `/api/**` → Designed for API clients (authenticated via opaque API keys)
- `/**`     → Designed for internal users via the internal UI (e.g., Next.js app)

### Clean Architecture
- **Separation of concerns** between routes, domain logic, and persistence
- **Testability** and **scalability** are key priorities

## 🔧 Key Components

### Features
- **Analytics**: Tracking and reporting functionality
- **Tokens**: Authentication and authorization management
- **URL Management**: Core URL operations with CRUD functionality
- **User Management**: User accounts and profiles

### Shared Libraries
- **Database**: Centralized database connection and configuration
- **Error Handling**: Global error management and logging
- **Utilities**: Common helper functions and types

## 🚀 Getting Started