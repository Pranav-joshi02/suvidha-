# POS Inventory Frontend (Next.js)

This is a frontend-only implementation for an in-store POS and inventory management application. It includes mocked APIs (MSW) so you can run and demo the UI without a backend.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000/login

Test accounts:
- owner@example.com / password (Admin)
- staff@example.com / password (Staff)

## Tech
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query + Zustand
- react-hook-form + zod
- recharts
- @tanstack/react-table
- lucide-react icons
- MSW for mocked API
- papaparse (CSV) + jspdf (PDF)

## Structure
- `src/app/(auth)/login` — JWT login page
- `src/app/(admin)/admin` — Admin layout and dashboard
- `src/app/(admin)/admin/sales` — POS
- `src/app/(admin)/admin/reports/balancesheet` — Balance sheet export UI
- `src/app/print/receipt/[saleId]` — Printable receipt view
- `src/mocks` — MSW handlers and worker setup

## Notes
- Token is stored in Zustand persisted storage (localStorage) for demo. Switch to HttpOnly cookie when backend is ready.
- Print stylesheet hides controls for clean receipts.
- Offline sync to be implemented with IndexedDB + queue.
