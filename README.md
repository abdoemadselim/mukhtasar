# Project Structure

This project follows a feature-based architecture with clean separation of concerns.

## 📁 Directory Structure

```
src/
├── features/           # Feature modules organized by business domain
│   ├── feature1/      # e.g URL shortening functionality
│   │   ├── data-access/    # Data layer for URL shortening
│   │   ├── domain/         # Business logic and entities
│   │   └── test/           # Feature-specific tests
|   |   |__ api.ts          # It works as the controller for this feature
│   ├── feature2/         # e.g. API tokens #
│   │   ├── data-access/    # Data layer for Token data operations
│   │   ├── domain/         # Token business logic
│   │   └── test/           # Token-related tests
|   |   |__ api.ts          # It works as the controller for this feature
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
Each feature is self-contained with its own:
- **Data Access Layer**: Handles database operations and external API calls
- **Domain Layer**: Contains business logic, entities, and use cases
- **Test Layer**: Feature-specific unit and integration tests

### Clean Architecture
- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Inversion**: Higher-level modules don't depend on lower-level modules
- **Testability**: Each layer can be tested independently

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