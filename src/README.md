## Insighta Web

Phase 5 web portal for Insighta.

This app is the frontend shell only. The Express/Node backend is not implemented yet, so the UI is wired to a proxy layer that expects a separate backend service to exist later.

## Current setup

The app includes these screens:

- Login
- Dashboard
- Profiles list
- Profile detail
- Search
- Account

It also includes a small Next.js proxy layer for these backend routes:

- `/api/auth/github`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/profiles`
- `/api/profiles/search`
- `/api/profiles/export`
- `/api/profiles/:id`

## Local development

Set the backend URL before running the app:

```bash
BACKEND_URL=http://localhost:5000 npm run dev
```

If the backend is not running yet, the UI still loads, but auth and profile data will fall back to empty or signed-out states.

## How to implement the backend later

Use an Express app with these basics:

1. Create a server entry such as `server.ts` or `app.ts`.
2. Add JSON parsing, CORS, and cookie middleware.
3. Implement the auth routes first:
	- `GET /auth/github`
	- `GET /auth/github/callback`
	- `POST /auth/refresh`
	- `POST /auth/logout`
4. Implement the profile routes next:
	- `GET /api/profiles`
	- `GET /api/profiles/search`
	- `GET /api/profiles/export`
	- `GET /api/profiles/:id`
	- `POST /api/profiles`
5. Return HTTP-only cookies for web login and keep the JSON error shape consistent.
6. Point this app at that server with `BACKEND_URL` once it is deployed.

## Deployment

The included `netlify.toml` is ready for a standard Next.js deployment on Netlify.
Set `BACKEND_URL` in the Netlify environment so HTTP-only auth cookies and API proxying work against the live backend.
