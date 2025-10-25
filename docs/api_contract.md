# Gym Manager API Contract

## Overview

This document describes the REST API contract for the Gym Manager application. It is aligned with the current frontend route structure and the endpoints used within the React application. The contract defines resources for authentication, members, trainers, classes, bookings, programs, and payments. It specifies request and response schemas, role-based access control (RBAC), supported status codes, pagination and filtering, a unified error shape, and sample cURL calls.

The current frontend supports a mock mode controlled by the environment variable `REACT_APP_USE_MOCKS=true`. In mock mode, the frontend bypasses network calls for certain screens and uses in-memory demo data, making it compatible with the contract while allowing UI development without a backend. When `REACT_APP_USE_MOCKS` is false, requests are sent to `REACT_APP_API_BASE_URL` as configured in `src/api/httpClient.js`.

Base URL:
- Configure via environment variable: `REACT_APP_API_BASE_URL` (e.g., https://api.example.com)
- All examples below use a base URL alias: `$API`


## Authentication

### Summary

- JWT-based bearer authentication.
- After login or register, client stores `{ token, user }` in Redux (see `authSlice`).
- Authorization header: `Authorization: Bearer <token>` for protected endpoints.

### RBAC Roles

- owner: Gym owner/admin
- trainer: Trainer portal user
- member: Member portal user

### Endpoints

#### POST /auth/login

Authenticate a user and return a token and basic profile.

Request body:
```json
{
  "email": "string",
  "password": "string"
}
```

Responses:
- 200 OK
```json
{
  "token": "jwt-string",
  "user": {
    "id": "string",
    "name": "string",
    "role": "owner|trainer|member",
    "email": "string"
  }
}
```
- 400 Bad Request (validation)
- 401 Unauthorized (invalid credentials)
- 429 Too Many Requests (optional)
- 500 Internal Server Error

cURL:
```bash
curl -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

#### POST /auth/register

Register a new user and return a token and profile.

Request body:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "owner|trainer|member"
}
```

Responses:
- 201 Created
```json
{
  "token": "jwt-string",
  "user": {
    "id": "string",
    "name": "string",
    "role": "owner|trainer|member",
    "email": "string"
  }
}
```
- 400 Bad Request (validation)
- 409 Conflict (email exists)

cURL:
```bash
curl -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"secret","role":"member"}'
```

#### GET /auth/me

Return current authenticated user’s profile.

Authorization:
- Bearer token required

Responses:
- 200 OK
```json
{
  "id": "string",
  "name": "string",
  "role": "owner|trainer|member",
  "email": "string"
}
```
- 401 Unauthorized

cURL:
```bash
curl -H "Authorization: Bearer $TOKEN" "$API/auth/me"
```

#### POST /auth/refresh

Refresh token (optional).

Request:
```json
{ "refreshToken": "string" }
```

Responses:
- 200 OK
```json
{ "token": "new-jwt-string" }
```
- 401 Unauthorized

cURL:
```bash
curl -X POST "$API/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh-token>"}'
```

#### POST /auth/logout

Revoke token (optional server-side).

Responses:
- 204 No Content
- 401 Unauthorized

cURL:
```bash
curl -X POST "$API/auth/logout" -H "Authorization: Bearer $TOKEN" "$API/auth/logout"
```


## Members

Frontend usage: Owner screens list and create members. Endpoints are defined in `src/api/endpoints.js`.

Base path: /members

RBAC:
- owner: full access (list, create, update, delete, read)
- trainer: read assigned members (optional; not used by current UI)
- member: read self only via /members/{id} when id matches authenticated user (optional)

### GET /members

List members with pagination and filtering.

Query parameters:
- page: integer (default 1)
- limit: integer (default 20, max 100)
- q: free-text search on name/email
- status: active|paused

Responses:
- 200 OK
```json
{
  "data": [
    { "id": "string", "name": "string", "email": "string", "status": "active|paused", "createdAt": "ISO8601" }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "hasNext": false
  }
}
```

cURL:
```bash
curl -H "Authorization: Bearer $TOKEN" "$API/members?page=1&limit=20&q=john&status=active"
```

### POST /members

Create a member.

Request:
```json
{
  "name": "string",
  "email": "string",
  "status": "active|paused"
}
```

Responses:
- 201 Created
```json
{ "id": "string", "name": "string", "email": "string", "status": "active|paused", "createdAt": "ISO8601" }
```
- 400 Bad Request
- 409 Conflict (email exists)

cURL:
```bash
curl -X POST "$API/members" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Ava Wilson","email":"ava@example.com","status":"active"}'
```

### GET /members/{id}

Read a member by id.

Responses:
- 200 OK
```json
{ "id": "string", "name": "string", "email": "string", "status": "active|paused", "createdAt": "ISO8601" }
```
- 404 Not Found

### PATCH /members/{id}

Update member fields.

Request:
```json
{ "name": "string", "email": "string", "status": "active|paused" }
```

Responses:
- 200 OK (updated resource)
- 400 Bad Request
- 404 Not Found

### DELETE /members/{id}

Delete a member.

Responses:
- 204 No Content
- 404 Not Found


## Trainers

Frontend usage: Owner manages trainers. Endpoints map in `src/api/endpoints.js`.

Base path: /trainers

RBAC:
- owner: full access
- trainer: read self via /trainers/{id}
- member: none

### GET /trainers

List trainers with pagination.

Query parameters:
- page, limit, q (search on name/specialty), specialty (string)

Responses:
- 200 OK
```json
{
  "data": [
    { "id": "string", "name": "string", "email": "string", "specialty": "string", "createdAt": "ISO8601" }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 2, "hasNext": false }
}
```

### POST /trainers

Create trainer.

Request:
```json
{ "name": "string", "email": "string", "specialty": "string" }
```

Responses:
- 201 Created (resource)

### GET /trainers/{id} • PATCH /trainers/{id} • DELETE /trainers/{id}

- Standard read / partial update / delete semantics.
- 200 on read/update, 204 on delete, 404 when not found.

cURL example (create):
```bash
curl -X POST "$API/trainers" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Alex Morgan","email":"alex@gym.com","specialty":"HIIT"}'
```


## Classes

Frontend usage: Owner manages classes and fetches list; Member browses classes; Trainer sees timetable (local data now). Endpoints map in `src/api/endpoints.js`.

Base path: /classes

RBAC:
- owner: full access
- trainer: read (their assigned classes optional extension)
- member: read list and detail

### GET /classes

List classes with pagination and filters.

Query parameters:
- page, limit
- q: search on title or trainer
- trainerId: filter by trainer
- from, to: ISO dates to filter by schedule window (if applicable)
- sort: e.g., "title_asc" or "title_desc"

Responses:
- 200 OK
```json
{
  "data": [
    { "id": "string", "title": "string", "trainer": "string", "trainerId": "string", "capacity": 20, "scheduledAt": "ISO8601" }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 2, "hasNext": false }
}
```

cURL:
```bash
curl "$API/classes?page=1&limit=10&q=yoga"
```

### POST /classes

Create a class.

Request:
```json
{ "title": "string", "trainerId": "string", "capacity": 10, "scheduledAt": "ISO8601" }
```

Responses:
- 201 Created (resource)

### GET /classes/{id} • PATCH /classes/{id} • DELETE /classes/{id}

- 200 on read/update, 204 on delete, 404 when not found.

Note: The owner UI currently posts to `/classes` with fields: `title`, `trainer`, `capacity`. Backend SHOULD accept either:
- a reference-based schema: `trainerId`, or
- a simpler string `trainer` initially for mock compatibility.

Recommended canonical schema is with `trainerId` and server can compute `trainer` display value.


## Bookings

Frontend usage: Member Bookings uses local demo data today. API below defines the intended contract. The `endpoints.js` file declares a generic `/bookings` path under `classes`, which can serve as the main booking collection.

Base path: /bookings

RBAC:
- member: can list/create/cancel own bookings
- owner: can view or manage all bookings (optional)
- trainer: can view bookings for classes they own (optional)

### GET /bookings

List bookings.

Query parameters:
- page, limit
- memberId: filter by member
- classId: filter by class
- status: confirmed|waitlist|canceled
- from, to: date range on class time

Responses:
- 200 OK
```json
{
  "data": [
    { "id": "string", "memberId": "string", "classId": "string", "status": "confirmed|waitlist|canceled", "createdAt": "ISO8601" }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 2, "hasNext": false }
}
```

### POST /bookings

Create a booking.

Request:
```json
{ "classId": "string" }
```

Responses:
- 201 Created
```json
{ "id": "string", "memberId": "string", "classId": "string", "status": "confirmed|waitlist", "createdAt": "ISO8601" }
```
- 400 Bad Request (invalid)
- 409 Conflict (duplicate or capacity reached)

cURL:
```bash
curl -X POST "$API/bookings" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"classId":"c1"}'
```

### PATCH /bookings/{id}

Update booking status (e.g., cancel).

Request:
```json
{ "status": "canceled" }
```

Responses:
- 200 OK (resource)
- 403 Forbidden (not your booking unless owner)
- 404 Not Found


## Programs

Frontend usage: Trainer manages programs locally (in-memory). API below defines intended contract.

Base path: /programs

RBAC:
- trainer: create, list, update, delete programs they own
- owner: administrative oversight (optional)
- member: read programs assigned to them (optional future)

### GET /programs

List programs.

Query parameters:
- page, limit
- trainerId (filter by owner)
- q (title search)

Responses:
- 200 OK
```json
{
  "data": [
    { "id": "string", "title": "string", "weeks": 4, "trainerId": "string", "createdAt": "ISO8601" }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 1, "hasNext": false }
}
```

### POST /programs

Create a program.

Request:
```json
{ "title": "string", "weeks": 4 }
```

Responses:
- 201 Created (resource)

### GET /programs/{id} • PATCH /programs/{id} • DELETE /programs/{id}

Standard resource semantics with access controls (trainer owner or admin).


## Payments

Frontend usage: OwnerPayments fetches from `/payments` when not in mock mode. The endpoints map does not yet include payments; backend should provide this collection.

Base path: /payments

RBAC:
- owner: full access
- member: read their own payments (optional)
- trainer: none

### GET /payments

List recent payments.

Query parameters:
- page, limit
- memberId (filter by member)
- from, to (date range)
- minAmount, maxAmount

Responses:
- 200 OK
```json
{
  "data": [
    { "id": "string", "memberId": "string", "amount": 49.99, "date": "ISO8601", "method": "card|cash|transfer", "status": "succeeded|refunded|failed" }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 2, "hasNext": false }
}
```

### POST /payments

Record a payment.

Request:
```json
{
  "memberId": "string",
  "amount": 49.99,
  "method": "card|cash|transfer",
  "note": "string"
}
```

Responses:
- 201 Created (resource)

### GET /payments/{id}

Read payment.

Responses:
- 200 OK
- 404 Not Found


## Common Conventions

### Headers

- Content-Type: application/json
- Authorization: Bearer <token> (for protected endpoints)

### Pagination

- Request with `page` and `limit` query parameters.
- Response envelope includes:
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "hasNext": true
  }
}
```

### Sorting and Filtering

- Free-text search via `q`.
- Additional filters per resource as listed above.
- Use explicit fields like `status`, `trainerId`, `memberId`, date ranges `from`/`to`.

### Error Response Shape

All errors should follow a consistent structure:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {
      "field": "reason"
    },
    "requestId": "string"
  }
}
```

Examples:
- 400 Bad Request (validation):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body.",
    "details": { "email": "Email is required." }
  }
}
```
- 401 Unauthorized:
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid token."
  }
}
```
- 403 Forbidden:
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action."
  }
}
```
- 404 Not Found:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found."
  }
}
```

### Status Codes

- 200 OK: Successful read or update returning content
- 201 Created: Resource created
- 204 No Content: Successful operation with no body (e.g., delete, logout)
- 400 Bad Request: Invalid payload or query parameters
- 401 Unauthorized: Missing/invalid credentials
- 403 Forbidden: Authenticated but not permitted by RBAC
- 404 Not Found: Resource or route not found
- 409 Conflict: Resource state conflict, e.g., duplicates or capacity reached
- 422 Unprocessable Entity: Semantic validation failure (optional)
- 429 Too Many Requests: Rate limit exceeded (optional)
- 500 Internal Server Error: Server error


## Security and RBAC

- The `Authorization: Bearer` token governs access.
- Routes should enforce:
  - owner: full management access across resources
  - trainer: scoped reads and writes to resources they own (e.g., their programs; optionally their classes and related bookings)
  - member: access to their own profile, their bookings, and publicly available classes list and details

Example route protections:
- /members (GET/POST/PATCH/DELETE): owner only, except member may read self by id
- /trainers: owner manages; trainer reads self
- /classes: read for all roles; write for owner
- /bookings: member manages own, owner can oversee; trainer read for their classes (optional)
- /programs: trainer owns CRUD; owner may view; member read if assigned (optional)
- /payments: owner; member may read own history (optional)


## Alignment with Frontend

- Endpoints map: see `src/api/endpoints.js`
  - auth: /auth/login, /auth/register, /auth/me, /auth/refresh, /auth/logout
  - members: /members, /members/{id}
  - trainers: /trainers, /trainers/{id}
  - classes: /classes, /classes/{id}
  - bookings: /bookings
- Payments: `/payments` is used directly in OwnerPayments page; consider adding to `endpoints.js` for consistency.
- The frontend adds Authorization headers automatically when a token is present (`src/api/httpClient.js`).
- Mock compatibility:
  - When `REACT_APP_USE_MOCKS=true`, some owner pages (Members, Classes, Trainers, Payments) serve demo data locally and simulate latency. This is fully compatible with the API shape documented here; wire up the same shapes server-side to allow seamless switching to real data.


## Sample End-to-End cURL Flow

1) Register a member:
```bash
curl -X POST "$API/auth/register" -H "Content-Type: application/json" \
  -d '{"name":"Demo Member","email":"member@example.com","password":"secret","role":"member"}'
```

2) Login as owner:
```bash
OWNER_TOKEN=$(curl -s -X POST "$API/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"secret"}' | jq -r .token)
```

3) Create a trainer:
```bash
curl -X POST "$API/trainers" \
  -H "Authorization: Bearer $OWNER_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Alex Morgan","email":"alex@gym.com","specialty":"HIIT"}'
```

4) Create a class referencing a trainer:
```bash
curl -X POST "$API/classes" \
  -H "Authorization: Bearer $OWNER_TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"HIIT Morning","trainerId":"t1","capacity":20,"scheduledAt":"2025-01-10T09:00:00Z"}'
```

5) Member books the class:
```bash
MEMBER_TOKEN=$(curl -s -X POST "$API/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"member@example.com","password":"secret"}' | jq -r .token)

curl -X POST "$API/bookings" \
  -H "Authorization: Bearer $MEMBER_TOKEN" -H "Content-Type: application/json" \
  -d '{"classId":"c1"}'
```

6) List payments (owner):
```bash
curl -H "Authorization: Bearer $OWNER_TOKEN" "$API/payments?page=1&limit=20"
```


## Schemas

These represent canonical shapes. Fields like ids are strings and timestamps are ISO8601.

- User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "owner|trainer|member"
}
```

- Member
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "status": "active|paused",
  "createdAt": "ISO8601"
}
```

- Trainer
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "specialty": "string",
  "createdAt": "ISO8601"
}
```

- Class
```json
{
  "id": "string",
  "title": "string",
  "trainerId": "string",
  "trainer": "string",
  "capacity": 20,
  "scheduledAt": "ISO8601",
  "createdAt": "ISO8601"
}
```

- Booking
```json
{
  "id": "string",
  "memberId": "string",
  "classId": "string",
  "status": "confirmed|waitlist|canceled",
  "createdAt": "ISO8601"
}
```

- Program
```json
{
  "id": "string",
  "title": "string",
  "weeks": 4,
  "trainerId": "string",
  "createdAt": "ISO8601"
}
```

- Payment
```json
{
  "id": "string",
  "memberId": "string",
  "amount": 49.99,
  "method": "card|cash|transfer",
  "status": "succeeded|refunded|failed",
  "date": "ISO8601"
}
```


## Notes for Backend Implementation

- Ensure CORS is enabled for the frontend origin in development.
- Implement consistent error shape across endpoints.
- Consider idempotency for POST endpoints where appropriate (e.g., booking same class twice should not duplicate).
- Implement rate limiting for auth routes.
- Return pagination meta exactly as specified to align with consumers.
- For progressive rollout, backend may first support read-only lists for Members/Trainers/Classes/Payments to unblock UI wiring, followed by POST/PATCH/DELETE.
