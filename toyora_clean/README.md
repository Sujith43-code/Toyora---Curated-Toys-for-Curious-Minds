# Toyora — Curated Toys for Curious Minds

Toyora is a React + Vite toy ecommerce storefront with a frontend-only admin panel. The current version intentionally runs without a backend, authentication, database, or external payment gateway. Store data is persisted locally in the browser with `localStorage`.

## Requirements

- Node.js 20.19+ or 22.12+ recommended
- npm

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL printed by Vite.

## Production build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Admin panel

Open the Admin Panel from the storefront or directly at the `#/admin` hash route. There is no login or authentication step in this frontend-only version.

## Data and payments

Cart, wishlist, catalogue edits, orders, reviews, categories, inventory, and settings use browser-local storage. Checkout supports demo payment-method selection; no real payment is processed until a payment gateway/backend is added.

## Netlify

The project includes `public/_redirects` so the built single-page application can be served correctly by Netlify.
