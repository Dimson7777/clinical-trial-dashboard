# Architecture Decision Records (ADRs) & Engineering Rationale

This document captures the architectural decisions, trade-offs, and design principles applied in the **Clinical Trial Data Dashboard**.

---

## ADR 1: React + Vite for Frontend Architecture

### Context
The technical challenge requires a modern JavaScript/TypeScript framework for the clinical researcher dashboard, demanding fast interaction times, high responsiveness, strict typing, and quick feedback during trial data navigation.

### Decision
We chose **React 18 + Vite** with **TypeScript** and **React Router v6**.

### Rationale & Trade-offs
- **Vite over Create React App (CRA)**: Instant Hot Module Replacement (HMR) powered by native ES modules via esbuild and Rollup, producing highly optimized production bundles without Webpack bloat.
- **SPA over Next.js / SSR**: A clinical trial dashboard is an authenticated, internal tool behind login credentials where SEO is irrelevant. A Client-Side Rendered (CSR) Single Page Application served from high-performance static Nginx web servers eliminates server-side rendering vulnerabilities and optimizes container memory footprint.
- **TypeScript**: Enforces strong compile-time contracts matching backend Pydantic schemas (`Participant`, `Metrics`, `User`), preventing runtime undefined property bugs in healthcare and trial workflows.

---

## ADR 2: FastAPI for Backend Services

### Context
The backend must expose RESTful endpoints for trial participants and operational metrics with input validation, JWT authentication, and automatic OpenAPI schema generation.

### Decision
We chose **FastAPI** with **Pydantic v2** and **Uvicorn**.

### Rationale & Trade-offs
- **FastAPI vs Flask/Django**:
  - Pydantic v2 integration provides fast parsing and validation.
  - Native asynchronous support (`asynccontextmanager` lifespan) with synchronous worker ergonomics.
  - Automatic interactive documentation (`/docs` via Swagger UI and `/redoc`) for seamless cross-team integration.
- **Clean Layered Architecture**:
  - Routers (`routers/`) strictly handle HTTP request unwrapping, status codes, and dependency resolution.
  - Services (`services/`) encapsulate business logic and database queries.
  - Core (`core/`) handles cross-cutting concerns (security, logging, configuration).
  - Schemas (`schemas/`) define unambiguous data transfer contracts.

---

## ADR 3: SQLite for Technical Challenge vs PostgreSQL for Production

### Context
The application must execute reliably out-of-the-box with zero host-level configuration across development environments and automated containers.

### Decision
We implemented **SQLite with SQLAlchemy 2.0** for local evaluation and containerized demo runs, architecting models and configurations to enable seamless migration to **PostgreSQL**.

### Rationale & Trade-offs
- **Challenge Benefits**: Zero external database dependency, zero network wait on startup, and instantaneous in-memory testing (`sqlite:///:memory:` with `StaticPool`).
- **Production Path**: All models use standard SQLAlchemy declarative mappings (`Mapped`, `mapped_column`, portable string-based UUID identifiers). Switching to PostgreSQL requires changing `DATABASE_URL=postgresql+psycopg://user:pass@host:5432/db` with no ORM code rewrites.

---

## ADR 4: JWT Authentication and Access Control

### Context
Researcher access to clinical trial participant data requires access control and authenticated state handling.

### Decision
We implemented stateless **JSON Web Tokens (JWT)** using `PyJWT` with HS256 HMAC signing, combined with `bcrypt` for salted password hashing.

### Rationale & Trade-offs
- **Stateless Tokens**: The backend does not need session state storage (like Redis) during evaluation while guaranteeing secure API route authorization via HTTP Bearer headers.
- **Security Guardrails**:
  - Password length capped at 72 bytes in Pydantic schemas to avoid bcrypt truncation vulnerabilities.
  - Unauthenticated attempts emit standard `401 Unauthorized` with `WWW-Authenticate: Bearer` headers.
  - Frontend automatically catches `401` errors via an API client interceptor, triggering session cleanup and redirecting to `/login`.

---

## ADR 5: React Context API vs External State Stores (Redux / Zustand)

### Context
The application manages authentication state, user identity, and trial data filters across routes.

### Decision
We implemented **React Context API** (`AuthContext`) combined with local component state.

### Rationale & Trade-offs
- **Right-Sized Complexity**: For a 4-hour technical challenge, introducing Redux Toolkit or Zustand adds boilerplate without functional benefit. React Context + `localStorage` persistence perfectly models authentication state.
- **Data Freshness**: Trial participant lists and metrics are fetched directly through modular API client services (`api/participants.ts`, `api/metrics.ts`), ensuring researchers always view authoritative real-time database state.

---

## ADR 6: Multi-Stage Containerization with Nginx Reverse Proxy

### Context
The system must run reliably in Docker with a single `docker compose up` command without CORS friction or port configuration issues.

### Decision
We built a multi-stage Dockerfile for the frontend using `node:22-alpine` to compile static assets and `nginx:alpine` to serve them, with an Nginx reverse proxy configuration routing `/api/` traffic directly to the `backend:8000` container.

### Rationale & Trade-offs
- **Single-Origin Simplicity**: In Docker production mode, frontend requests go to `/api/*` on port 3000, eliminating CORS preflight overhead in production deployments.
- **Direct Backend Port**: Backend also exposes port 8000 for direct API consumers, testing suites, and OpenAPI documentation.

---

## Production Roadmap (Beyond 4-Hour Scope)

1. **Database Migrations**: Integrate **Alembic** for tracked schema versioning.
2. **PostgreSQL + Read Replicas**: Deploy managed PostgreSQL with row-level security and read replicas for analytical queries.
3. **Role-Based Access Control (RBAC)**: Distinguish roles: `Investigator`, `Data Manager`, `Regulatory Auditor`, and `Read-Only Monitor`.
4. **Audit Logging & 21 CFR Part 11 Compliance**: Immutable audit trails recording every read/write to participant clinical records.
5. **AI Agent Integration**: Secure REST/gRPC interfaces for automated trial cohort matching and synthetic patient generation.
