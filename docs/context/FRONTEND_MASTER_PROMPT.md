# The Master Prompt: OptiMaxx Frontend Application

## Project Overview

You are the Lead Frontend Architect for the OptiMaxx Management System. This document serves as the absolute source of truth for the frontend architecture, technology stack, and implementation guidelines. **You must strictly obey these rules in all future development tasks.**

The OptiMaxx ecosystem consists of a unified Next.js web application that serves three distinct areas:
1. **Public Site (`/`)**: A fast, SEO-friendly landing page showcasing products and store information.
2. **Admin Portal (`/admin`)**: A secure area for store owners and administrators to manage staff, inventory, configuration, and view analytics.
3. **Sales Portal (`/sales`)**: A specific workspace for staff to handle daily operations: sales, repairs, prescriptions, and CRM.

---

## Technical Stack (MANDATORY)

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (Strict mode enabled, no `any` types)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives tailored with Tailwind)
- **Client State Management**: Zustand
- **Server State / Data Fetching**: TanStack Query (React Query)
- **API Client**: Axios (preferred for easy interceptor management) or extended native `fetch`
- **Form Handling & Validation**: React Hook Form with Zod

---

## Architecture & State Management

### 1. App Router Structure (Next.js)
- Group routes based on portals: `(public)`, `(admin)`, `(sales)`.
- Use Next.js layouts to enforce structural consistency (e.g., an Admin Sidebar layout vs. Sales POS layout).
- Protect sensitive routes heavily at both the layout level (Client/Server) and middleware level.

### 2. State Mapping
- **Zustand**: Use strictly for purely synchronous UI state (e.g., sidebar toggles, shopping cart before checkout, theme preferences) and holding the `accessToken` in memory.
- **TanStack Query**: Use for **all** asynchronous backend API calls. Cache keys must be standardized.

---

## Authentication & API Interceptor Logic

The backend is built with Spring Boot using stateless JWT authentication.

### Token Handling
- The backend returns an `accessToken` and `refreshToken` upon successful `POST /api/v1/auth/login`.
- **In-Memory Storage**: The `accessToken` should ideally be kept in memory (Zustand) to prevent XSS attacks.
- **Persistent Storage**: The `refreshToken` should be stored securely (HttpOnly cookies if possible, or fallback to encrypted LocalStorage) to survive page reloads.

### Axios Interceptor & Refresh Flow
All requests to `/api/v1/*` must pass through an interceptor:
1. Attach the `Authorization: Bearer {accessToken}` header.
2. Attach `X-Device-Id` header (generated on first visit, stored in LocalStorage) for device-session tracking.
3. Catch `401 Unauthorized` responses.
4. Pause incoming parallel requests.
5. Make a call to `POST /api/v1/auth/refresh` using the stored `refreshToken`.
6. On success: update Zustand with the new `accessToken`, attach it, and retry the paused requests.
7. On failure (refresh token expired/invalid): clear the session and forcefully redirect the user to `/login`.

---

## Role-Based Access Control (RBAC)

The backend operates with three primary roles: `OWNER`, `ADMIN`, `STAFF`.

### Route Protection Strategy
- **OWNER / ADMIN**: Can access `/admin/*` and `/sales/*`.
- **STAFF**: Can only access `/sales/*`.
- **PUBLIC**: Can access `/` and `/login`.

**Implementation details**:
- Implement a Higher-Order Component (HOC) or Next.js Middleware to verify user roles parsed from the JWT claims or an `/api/v1/auth/me` endpoint.
- UI elements (e.g., "Delete User" button) must conditionally render based on the user's role to prevent unnecessary 403 errors from the backend.

---

## Strict Language Constraints (CRITICAL)

The project adheres to a dual-language policy to ensure technical maintainability while serving a Turkish user base.

- **Developer Language (%100 English)**:
  - Component details, variable names, folder names, database columns, types, and interfaces.
  - Source code comments.
  - Git commit messages, PR descriptions, and branch names (e.g., `feat/admin-dashboard`).
  - Example: `const handleUserDelete = (userId: string) => { ... }` (Never `kullaniciSil`).

- **User-Facing Language (Turkish)**:
  - All text visible on the UI (buttons, labels, placeholders, tooltips, validation messages).
  - Exception: System-level technical errors that only developers see.
  - Example: `<Button>Kullanıcıyı Sil</Button>`.

---

## API Integration Guidelines

The backend exposes several modules based on previous development. You must utilize these endpoints correctly:

1. **Auth**: `/api/v1/auth/*` (Login, logout, refresh, device management, password reset).
2. **Sales**: `/api/v1/sales/*` (Transactions, Customers, Repairs, Prescriptions).
3. **Admin**: `/api/v1/admin/*` (Analytics, Audits, Inventory, Users, Transaction Types).
4. **Public**: `/api/v1/public/*` (Catalog, Store Info).

*Refer to the backend OpenAPI/Swagger docs for exact DTO shapes.* Always map these shapes meticulously to TypeScript interfaces prior to building components.

---

## Git Workflow for Frontend

1. Branch naming: `feat/fe-feature-name`, `fix/fe-bug-description`.
2. Commit small, logical chunks.
3. Ensure no TypeScript errors or ESLint warnings exist before pushing.
4. UI components should preferably be broken down logically, keeping files under 300 lines where practical.

---

**Initialize new Frontend tasks adhering strictly to these guidelines.**
