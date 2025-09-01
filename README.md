### Table of contents
- [What is Mukhtasar?](#what-is-mukhtasar)
- [URL Shortening Core Mechanism](#url-shortening-core-mechanism)
- [High Level Design](#high-level-design)
- [Architectural Components](#architectural-components)
- [Directory Structure](#directory-structure)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Organization](#organization)
- [Core Features](#core-features)
- [Logging \& Observability](#logging--observability)
- [Getting Started](#getting-started)
- [Backend Internals](#backend-internals)
  - [DB Schema](#db-schema)

---

## What is Mukhtasar?
Mukhtasar is an Arabic URL shortener service built for Arabs. 
The project is a monorepo that follows a feature-based architecture  
- **External API consumers** via `/api` (authenticated using opaque API keys)  
- **Internal interface users** via `/ui` (e.g. via the Next frontend)  
- **Public endpoints (mainly, URL redirection)** via `/`  

## URL Shortening Core Mechanism
At its heart, a URL shortener has **two primary functions**:

1. **URL Creation**  
   - User submits a long URL (e.g., `https://example.com/very/long/link`).  
   - The system generates a **short alias** (e.g., `https://mukhtasar.pro/abc123`) or (the provided user's alias is used)  
   - The alias and original URL are stored in the database.  
   
   ![High level](docs/imgs/url-shortener-id-generation.png)

   For more details on how it is work, and why base62, etc.  

   Check either of the following two resources:  
   1. *System Design Interview* book, chapter 8 (Design a URL shortener)  
   2. Neetcode (Design URL Shortener problem):  
      `https://systemdesignschool.io/problems/url-shortener/solution`

2. **URL Redirection**  
   - When a user visits the short alias (`/abc123`), the system looks up the original URL.  
   - Redirects the user to the original destination with minimal latency.  

---

## High Level Design
**URL Redirection**:  
![Redirection High Level](docs/imgs/redirection%20high%20level.png)
   
Two requests under the same domain:  
- https://mukhtasar.pro/* → should respond with a page  
- https://mukhtasar.pro/[alias] → should respond with a redirection to original URL  

A reverse proxy routes traffic based on the request path:  
- If the path starts with a reserved keyword (`pages`, `dashboard`, `auth`), the request is forwarded to the frontend.  
- Otherwise, it’s treated as a short URL and forwarded to the backend for redirection.  

For performance, URL mappings are cached both at the proxy layer and in Redis, ensuring the fastest possible redirects.  

**URL Creation**:  
![URL creation High Level](docs/imgs/creation%20high%20level.png)

**Why fetch Unique IDs in batches?**  
Instead of querying the database for a new unique ID every time a URL is created, the backend fetches a batch of IDs (e.g., 1000) in a single request. These IDs are then stored locally in memory on the backend server.  
- When a new short URL is created, the server simply consumes one ID from the batch.  
- Once the batch is exhausted, the backend requests another batch from the database.  

**What is a machine sequence?**  
To ensure scalability, each web server is assigned a **machine sequence**.  
- When traffic grows, a new web server can be added along with its own machine sequence.  
- Each machine sequence is tied to a **database shard**.  
- This guarantees that ID generation remains unique across multiple servers.  

**Scaling strategy:**  
To scale horizontally, add:  
- A new web server (with its machine sequence installed), and  
- A database shard associated with that same sequence.  

---

## Architectural Components
The system consists of **three main parts**:

1. **Backend (Express + PostgreSQL + Redis)**  
2. **Frontend (NextJS)**  
3. **Shared** (Mainly shared validation schemas, and types)
4. **Worker (Cloudflare Worker)**  
   - Edge-optimized redirection for speed with in-memory cache for hot URLs  
   - Calls backend asynchronously to send analytics events.  
   - Works as a reverse proxy in frontend of (frontend, and backed servers)

---

## Directory Structure

### Backend
```
apps/backend/
├── .vscode/               # VS Code configuration
├── dist/                  # Compiled TypeScript output
├── docs/                  # API documentation and design files
│   ├── api-doc.json
│   |
├── logs/                  # Application logs
│   ├── combined.log
│   ├── errors.log
│   ├── exceptions.log
│   └── newrelic_agent.log
├── node_modules/          # Dependencies
├── public/                # Static assets
│   |
├── src/                   # Source code
│   ├── features/          # Feature modules organized by business domain
│   │   ├── analytics/     # Analytics and tracking functionality
│   │   │   ├── controllers/   # responsible only for preparing the request for the service, takes the output from service and prepare the final response representation (AKA request and response representation)
│   │   │   |   ├── api.controller.ts   # The file defines the controllers of API routes
│   │   │   |   ├── ui.controller.ts   # The file defines the controllers of The NEXTJS interface
│   │   │   ├── data-access/
│   │   │   ├── domain/    # All the business logic lives here
│   │   │   ├── routes/    # The feature routes
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
│   │   ├── public.routes.ts   # Public routes (mainly URL redirection)
│   │   └── ui.routes.ts       # UI routes aggregation
│   ├── templates/         # Template files
│   └── main.ts            # Application entry point
├── package.json           # Project dependencies and scripts
├── README.md             # Project documentation
└── tsconfig.json         # TypeScript configuration
```
### Frontend
```
apps/frontend/
├── public/                    # Static assets
└── src/
    ├── app/                   # Only the end pages
    │   ├── (root)/           # Root group layout
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── auth/             # Authentication pages
    │   │   ├── (root)/       # Auth group layout
    │   │   │   ├── layout.tsx
    │   │   │   ├── login/
    │   │   │   │   └── page.tsx
    │   │   │   └── signup/
    │   │   │       └── page.tsx
    │   │   └── verify/
    │   │       └── page.tsx
    │   ├── dashboard/        # Protected dashboard pages
    │   │   ├── layout.tsx
    │   │   ├── urls/
    │   │   ├── tokens/
    │   │   ├── domains/
    │   │   └── analytics/
    │   ├── globals.css       # Global styles
    │   ├── layout.tsx        # Root layout
    │   ├── loading.tsx       # Global loading UI
    │   ├── error.tsx         # Global error UI
    │   └── not-found.tsx     # 404 page
    │
    ├── components/           # Shared/reusable components
    │   ├── ui/              # Base UI components (shadcn/ui)
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   ├── data-table/      # Reusable data table components
    │   ├── sidebar/         # Sidebar-related components
    │   ├── forms/           # Shared form components
    │   │   ├── form-field.tsx
    │   │   └── form-error.tsx
    │   └── layout/          # Layout components
    │
    ├── features/            # Feature modules organized by business domain
    │   ├── analytics/       # Analytics and tracking functionality
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/
    │   ├── auth/            # Authentication
    │   ├── token/           # API token management
    │   └── url/             # URL shortening core functionality
    │  
    ├── lib/                 # Shared utilities and libraries
    │   └── api-client.ts    # HTTP client=
    │ 
    ├── hooks/               # Global/shared hooks
    │  
    ├── context/             # Global context providers
    │   └── client-provider.tsx
    └── fonts.ts             # Font configurations
```
## Organization

**Feature-Based Organization**

Each business feature (e.g. URL, Tokens, Analytics) is self-contained with its own:

**Backend:**
- `routes/api.ts` → Express routes for external APIs
- `routes/ui.ts` → Express routes for internal interface usage
- `data-access/` → DB Layer (repositories, seeds, etc.)
- `domain/` →  All feature logic
- `controllers/api.ts` → API routes handlers
- `controllers/ui.ts` → Internal interface routes handlers

**Frontend:**
- `components/` → feature-specific UI components
- `service/` → feature-specific API calls
- `hooks/` → feature-specific Hooks (mainly, React Query wrappers around services)
- `context/` → feature-specific context

## Core Features

- **Analytics** → URL click tracking and reporting
- **Auth** → Authentication and session management  
- **Token** → API key generation and validation
- **URL** → Link shortening and management
- **User** → Account creation and profile management

## Logging & Observability
The project uses Winston for structured logging and New Relic for performance monitoring, error tracking, and live observability.
- `combined.log` → All application events
- `errors.log` → Error-level events only
- `exceptions.log` → Unhandled exceptions

## Getting Started
Follow these steps to run the project locally:

1. **Prerequisites**
   Make sure you have the following installed:
   - **Node.js** (v14+ as per `package.json`)
   - **npm** (v6+)
   - **PostgreSQL** (v14+ recommended)

2. **Clone the Repository**
    ```bash
    git clone git@github.com:abdoemadselim/mukhtasar.git
    cd mukhtasar
    ```

3. **Install Dependencies**
   ```bash
   pnpm install
   ```

4. **Setup PostgreSQL**:
   If you don’t have PostgreSQL installed, download it here:
   👉 https://www.postgresql.org/download/

5. Create a new db user and database
   ```
   psql -U postgres
   CREATE USER mukhtasar_user WITH PASSWORD 'yourpassword';
   CREATE DATABASE mukhtasar OWNER mukhtasar_user;
   GRANT ALL PRIVILEGES ON DATABASE mukhtasar TO mukhtasar_user;
   ```
6. **Setup Environment Variables**:
   ```
   cd apps/backemd
   cp .env.example .env
   ```
   Update the db config variables in .env file with with your connection details
      ```
      DATABASE_URL=postgresql://mukhtasar_user:yourpassword@localhost:5432/mukhtasar
      DB_CONNECTION_STRING=postgresql://mukhtasar_user:yourpassword@localhost:5432/mukhtasar
      ```

7. **Build all projects (frontend, backend, shared)**
    ```bash
    pnpm build
    ```
    This would build all projects for you (Compiles TypeScript, copies assets, and runs migrations.)

8.  **Start all projects in dev environment at once (frontend, backend)**
    ```bash
    pnpm start-dev
    ```
    **Or run separately in multiple terminals**:

      **Terminal 1 - Backend**
      ```bash
      pnpm dev:backend
      ```

      **Terminal 2 - Frontend**
      ```bash
      pnpm dev:frontend
      ```

## Backend Internals

### DB Schema
![DB ERD](apps/backend/docs//imgs/db%20schema.png)