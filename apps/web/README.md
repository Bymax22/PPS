# apps/web — Quick start

1. Copy the repository `.env.example` to `apps/web/.env` and configure the
   database, NextAuth, Ably, LiveKit, Cloudinary, and payment gateways.

2. Install and generate Prisma client:

```bash
cd apps/web
npm install
npx prisma generate --schema=prisma/schema.prisma
```

3. Run migrations (dev):

```bash
npx prisma migrate dev --name init --schema=prisma/schema.prisma
```

4. Start dev server:

```bash
npm run dev
```

## Seed curriculum records

The additive curriculum seed ensures the Zambian and Cambridge programs, grade-level
classes from Nursery through secondary school, and curriculum subject metadata:

```bash
npm run db:seed -- --dry-run
npm run db:seed
```

The seed refuses to write to non-local database hosts by default. Only after
confirming that the configured remote database is the intended target, explicitly
allow remote writes with `SEED_ALLOW_REMOTE=true npm run db:seed` (PowerShell:
`$env:SEED_ALLOW_REMOTE='true'; npm run db:seed`). It does not create sample users,
teachers, student enrollments, lessons, resources, or subscription plans.

See [README-LIVEKIT.md](./README-LIVEKIT.md) for LiveKit deployment and service configuration.

## Mobile money subscriptions

Parent checkout accepts only published subscription plans priced in ZMW; the
amount is always loaded and verified server-side. Parents can choose BroadPay or
DPO Pay. BroadPay's hosted checkout presents the supported MTN/Airtel options;
DPO is configured with the selected Zambia mobile network.

Configure the BroadPay public and secret keys in the server environment. In
DPO's merchant account, obtain the company token, service type, hosted-checkout
URL, Zambia payment-country value, and exact MTN/Airtel MNO values. Set these
as `DPO_COMPANY_TOKEN`, `DPO_SERVICE_TYPE`, `DPO_CHECKOUT_URL`,
`DPO_DEFAULT_PAYMENT_COUNTRY`, `DPO_MTN_MNO`, and `DPO_AIRTEL_MNO`. DPO's
hosted-checkout URL and Zambia routing values vary by account; the app does not
guess them. `APP_URL` must be the HTTPS origin configured for provider
callbacks. Configure `https://<APP_URL>/api/payments/dpo/webhook` as DPO's
server-to-server push notification URL in the merchant account. BroadPay
callbacks are signature-checked; DPO callbacks and browser returns are confirmed
by a server-to-server transaction verification before a subscription is
activated.

Create subscription plans with an explicit ZMW amount and duration before
opening checkout to parents. Plans in other currencies are not offered and no
currency conversion is performed. Deploy the Prisma schema changes before
enabling checkout.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
