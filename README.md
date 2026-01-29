# Ustore99 Admin Panel (Next.js)

Production-ready admin panel for the Ustore99 clothing platform.

## Tech
- Next.js (App Router) + TypeScript
- Tailwind CSS (light theme)
- Redux Toolkit + RTK Query
- React Hook Form + Zod
- Toasts: Sonner

## Environment
Create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Run
```bash
npm install
npm run dev
```

Build:
```bash
npm run build
npm start
```

## Auth & RBAC
- Public route: `/login`
- Protected routes: `/admin/*` (enforced in `middleware.ts`)
- Cookie-based session:
  - Token cookie: `ustore99_token`
  - Role cookie: `ustore99_role` (optional but used to make RBAC redirects instant)
- Roles:
  - `SUPER_ADMIN`: full access
  - `SELLER`: only `/admin/overview` and `/admin/products`

If a `SELLER` hits a super-admin-only route, middleware redirects to `/admin/overview?unauthorized=1`, and the dashboard shows a “Not authorized” toast.

> Security note: role extraction in middleware uses a cookie and/or an unverified JWT payload decode to gate UI routes. Your backend **must** enforce RBAC server-side for real security.

## API integration
Endpoints are implemented via RTK Query and can be wired to your real backend:
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/products?page=&limit=&search=&category=&brand=&gender=&size=&color=&minPrice=&maxPrice=&isActive=`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Edit the paths (if needed) in:
- `src/features/auth/authApi.ts`
- `src/features/products/productsApi.ts`
