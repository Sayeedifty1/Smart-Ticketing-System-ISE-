# Transit Ticketing System

A full-stack **transit ticketing** prototype: purchase tickets (day, monthly, city), pay with Stripe, and validate at gates. Includes a validator emulator and live audit feed.

## Stack

| Layer   | Tech |
|--------|------|
| Client | React (Vite), Tailwind CSS, React Router, Stripe.js, lucide-react |
| Server | Node.js (Express), Prisma ORM, MongoDB, JWT, Stripe |

## Project layout

```
transit-ticketing/
├── client/          → React + Vite + Tailwind (dashboard, purchase, validator UI)
├── server/          → Express API, Prisma, auth, payments, validation
├── .gitignore       → ignores .env, node_modules, dist, etc.
└── README.md
```

## Features

- **Auth:** Register / login with JWT; protected Dashboard, Purchase, Validator
- **Purchase:** Day ticket, monthly plan, city tickets (e.g. Lemgo, Berlin); Stripe.js payment with test card `4242 4242 4242 4242`
- **Dashboard:** My tickets, ticket history by status (Unused / Used / Expired)
- **Validator:** Smart Gate countdown, NFC-style validation by `ticketId` or `nfcId`, Live Audit Feed (GRANT/DENY counts)

## Quick start

### 1. Server

```bash
cd server
cp .env.example .env
# Edit .env: set DATABASE_URL (MongoDB), PORT, JWT_SECRET, STRIPE_SECRET_KEY
npm install
npx prisma generate
npm run dev
```

API runs at **http://localhost:5001** (or `PORT` in `.env`). Health: `GET /health`.

### 2. Client

```bash
cd client
cp .env.example .env
# Edit .env: VITE_API_URL, VITE_STRIPE_PUBLISHABLE_KEY
npm install
npm run dev
```

App runs at **http://localhost:5173**.

## Configuration

- **Server:** `server/.env` — `DATABASE_URL`, `PORT`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, Stripe webhook secret. Never commit `.env`.
- **Client:** `client/.env` — `VITE_API_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`.


