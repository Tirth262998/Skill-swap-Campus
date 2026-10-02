# Week 1 API integration handoff

**Status: PENDING BACKEND.** The repository currently has no backend source, model definitions, API documentation, environment configuration, or endpoint implementation. The root README mentions Express, MongoDB/Mongoose, JWT, and Socket.IO, but those stack notes do not establish an API contract.

No endpoint paths, methods, request/response fields, error formats, auth persistence rules, profile fields, or completion rules are assumed in the frontend.

## Contract checklist

| Capability | Status | Contract information needed from backend |
|---|---|---|
| Register | PENDING BACKEND | Exact route and method; accepted request fields and validation; success response; duplicate-email and other error responses; whether registration creates an authenticated session |
| Login | PENDING BACKEND | Exact route and method; accepted request fields; success response; invalid-credential errors; how authentication is issued and returned |
| Logout | PENDING BACKEND | Whether a logout endpoint is required; exact method, route, and response; client-side cookie/token clearing requirements |
| Current user / auth refresh | PENDING BACKEND | Whether an endpoint is needed; exact route and response; how the client discovers a valid session after refresh; token/session expiry behavior |
| Create profile | PENDING BACKEND | Exact route and method; model-supported fields; required/optional fields and validation; success response and errors |
| Get current profile | PENDING BACKEND | Exact route and method; response shape; behavior when no profile exists |
| Update current profile | PENDING BACKEND | Exact route and method; accepted fields; response shape and validation/error format |
| Onboarding/profile completion | PENDING BACKEND | Source of truth for completion and exact required profile fields; skills must be excluded from Week 1 completion |

## Teammate integration details to provide

1. The running backend base URL for local development and the intended `VITE_API_BASE_URL` value.
2. The exact route, HTTP method, request schema, success response, authentication requirement, and error response for each implemented capability above.
3. The real auth mechanism (JWT, cookie, session, or other), how credentials are sent, persistence/refresh/expiry behavior, and logout behavior.
4. User and profile model fields, which profile fields are required, and how a missing profile is represented.
5. The backend's CORS allowed frontend origin, methods, allowed headers, and credentials setting if cookies are used.
6. The actual frontend/backend ports and any API documentation or test account setup.

Until this information is available, the frontend forms remain disabled and preview-only. No credentials or profile data are sent.
