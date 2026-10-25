# Deployment configuration

## Vercel

Set these build-time environment variables for the **Production** environment of each Vercel project, then redeploy:

| Project | Variable | Value |
| --- | --- | --- |
| `frontend` | `REACT_APP_API_URL` | `https://zerodha-backend-2ozm.onrender.com` |
| `frontend` | `REACT_APP_DASHBOARD_URL` | `https://zerodha-dashboard-one-eosin.vercel.app` |
| `dashboard` | `REACT_APP_API_URL` | `https://zerodha-backend-2ozm.onrender.com` |
| `dashboard` | `REACT_APP_FRONTEND_URL` | `https://zerodha-frontend-snowy.vercel.app` |

The React apps default to `localhost:3002`, `localhost:3001`, and `localhost:3000` in development. API clients send credentials automatically. Vercel environment-variable changes take effect only after a new deployment.

## Render backend

Configure these environment variables in the Render service:

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URL` | Yes | MongoDB connection URI; keep secret |
| `TOKEN_KEY` | Yes | Long, random JWT signing secret; keep secret and stable across deploys |
| `NODE_ENV` | Yes | Set to `production` for secure production cookies |
| `COOKIE_SAME_SITE` | No | Leave unset or use `none` for the current cross-site hosts. Use `lax` only after moving all apps to same-site custom domains. |
| `CORS_ORIGINS` | No | Optional comma-separated additional exact browser origins (no trailing slash), for custom domains or approved previews |

The backend already allows the two local development origins and the two listed Vercel production origins. Never put MongoDB or JWT secrets in Vercel or frontend code.

## Cross-site cookie limitation

The current frontend, dashboard, and API use unrelated hosting domains (`vercel.app` and `onrender.com`). Production cookies therefore need `Secure; SameSite=None`, but browsers and privacy settings may block third-party cookies regardless. This setting is necessary for the current topology, not a guarantee that browsers will accept the cookie. Signup/login can return successfully while a later profile request has no cookie.

For reliable browser authentication, attach all three services to subdomains of a domain you control—for example `www.example.com`, `app.example.com`, and `api.example.com`. Configure the Vercel projects and Render custom domain, then set:

- Both Vercel projects' `REACT_APP_API_URL` to `https://api.example.com`.
- Frontend `REACT_APP_DASHBOARD_URL` to `https://app.example.com`.
- Dashboard `REACT_APP_FRONTEND_URL` to `https://www.example.com`.
- Render `CORS_ORIGINS` to `https://www.example.com,https://app.example.com`.
- Render `COOKIE_SAME_SITE` to `lax`.

Replace `example.com` with the domain you own. Keep HTTPS enabled. The browser then treats the requests as same-site while the API cookie remains host-only on the API hostname; do not set a broad cookie `Domain`.

An Origin allowlist also rejects browser requests from unapproved origins. This is an additional CSRF defense; it does not change which API endpoints are protected by JWT authentication.

## Deployment verification

1. Confirm the Render service has `MONGO_URL`, `TOKEN_KEY`, and `NODE_ENV=production` configured without printing their values.
2. Set the Vercel variables above and redeploy both Vercel projects.
3. From each production app, check browser developer tools for successful CORS responses and for a `token` cookie marked `HttpOnly`, `Secure`, and `SameSite=None`. If the browser blocks it as third-party, move to the custom-domain setup above.
4. Sign up with a new test account, sign in, and verify `/profile`, `/watchlist`, `/allHoldings`, `/allPositions`, and `/orders`; then test simulated order creation and logout.
5. Do not use production authentication as verified until these browser checks pass. No production account or database data is needed for local build checks.
