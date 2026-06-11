# JS Pro 1 API

REST API riêng cho JS Pro 1 Blog UI.

## Stack

- Node.js 24 LTS trong `.nvmrc` và Docker image.
- TypeScript, Fastify v5, TypeBox JSON Schema.
- Prisma ORM, PostgreSQL 18.
- Opaque session token qua HTTP-only cookie.
- OpenAPI tại `/docs`.
- Vitest với `fastify.inject`.

## Chạy local

```bash
npm install
cp .env.example .env
docker compose up -d postgres
npm run db:deploy
npm run db:seed
npm run dev
```

API mặc định chạy tại `http://localhost:4000`.

## Kiểm tra

```bash
npm run typecheck
npm run lint
npm run test
```

Integration test cần DB test cô lập:

```bash
docker compose -f docker-compose.test.yml up -d postgres-test
DATABASE_URL="<test database URL>" npm run db:deploy
DATABASE_URL="<test database URL>" npm run db:seed
DATABASE_URL="<test database URL>" npm run test:integration
docker compose -f docker-compose.test.yml down -v
```

Public E2E chạy trực tiếp qua domain thật. Script này đăng ký user test có
namespace riêng, tạo nháp, publish, kiểm tra public detail, rồi archive bài test
để không giữ bài trong public listing.

```bash
E2E_BASE_URL=https://jspro1-api.f8team.dev npm run test:e2e:public
```

## Endpoint chính

- `GET /health`
- `GET /ready`
- `GET /api/site`
- `GET /api/pages/:slug`
- `GET /api/home`
- `GET /api/categories`
- `GET /api/categories/:slug`
- `GET /api/tags`
- `GET /api/media-assets`
- `GET /api/posts/:slug`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/me/posts`
- `POST /api/me/posts`
- `PATCH /api/me/posts/:id`
- `POST /api/me/posts/:id/publish`
- `POST /api/me/posts/:id/archive`
- `PATCH /api/me/preferences`
- `POST /api/contact-messages`

## Quy ước lỗi

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu gửi lên chưa hợp lệ.",
    "details": {}
  }
}
```
