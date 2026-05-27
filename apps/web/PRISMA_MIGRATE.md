# Prisma migrations & local development

1. Install dependencies (from `apps/web`):

```bash
npm install
```

2. Create `.env` in `apps/web` or at repo root with `DATABASE_URL` and `NEXTAUTH_SECRET`.

3. Generate Prisma client and run migrations (development):

```bash
npx prisma generate --schema=prisma/schema.prisma
npx prisma migrate dev --name init --schema=prisma/schema.prisma
```

4. Start dev server:

```bash
npm run dev
```

Note: In production use `prisma migrate deploy` and set `DATABASE_URL` to production DB.
