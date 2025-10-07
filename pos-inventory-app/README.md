# POS & Inventory Management System

A modern, full-featured Point of Sale and Inventory Management system built with Next.js, TypeScript, and TailwindCSS.

## 🚀 Features

### Authentication
- JWT-based authentication with role-based access control
- Two user roles: **Admin** and **Staff**
- Secure token storage in localStorage
- Auto-redirect based on user role

### Admin Features
- **Dashboard**: KPI cards showing total products, daily revenue, profit, and low-stock items
- **Product Management**: Full CRUD operations with search, filtering, and pagination
- **Point of Sale**: Fast in-store sales recording with product search and basket management
- **Sales History**: View all transactions with filters for date range, staff, and products
- **Reports**: 
  - Daily and monthly sales reports
  - Balance sheet with customizable date ranges
  - Top 5 selling products
  - Export to CSV and PDF
- **Settings**: 
  - User management (add/remove staff)
  - Store configuration
  - Low-stock threshold settings

### Staff Features
- **POS Terminal**: Quick access to record sales
- **Inventory Check**: View product stock levels
- Simplified interface focused on daily operations

### Additional Features
- **Printable Receipts**: Clean, professional receipts with print and PDF download
- **Export Functionality**: Balance sheets in CSV and PDF formats
- **Sync Status**: Online/offline indicator with manual sync option
- **Responsive Design**: Works on desktop, tablets, and POS terminals
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query (React Query) + Zustand
- **Forms**: react-hook-form + Zod validation
- **Tables**: @tanstack/react-table
- **Charts**: Recharts
- **Icons**: Lucide React
- **Export**: PapaParse (CSV), jsPDF (PDF)
- **Mock API**: MSW (Mock Service Worker)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   cd pos-inventory-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

### Admin Account
- **Email**: admin@pos.com
- **Password**: admin123

### Staff Account
- **Email**: staff@pos.com
- **Password**: staff123

## 📁 Project Structure

```
pos-inventory-app/
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin-only pages
│   │   ├── page.tsx        # Dashboard
│   │   ├── products/       # Product management
│   │   ├── pos/            # Point of Sale
│   │   ├── sales/          # Sales history
│   │   ├── reports/        # Reports & analytics
│   │   └── settings/       # Settings
│   ├── staff/              # Staff pages
│   │   ├── page.tsx        # Staff dashboard
│   │   ├── pos/            # Staff POS
│   │   └── inventory/      # Check stock
│   ├── print/              # Printable pages
│   │   └── receipt/        # Receipt printer
│   ├── login/              # Authentication
│   └── layout.tsx          # Root layout
├── components/
│   ├── layouts/            # Page layouts
│   │   ├── admin-layout.tsx
│   │   └── staff-layout.tsx
│   └── ui/                 # Reusable UI components
├── hooks/                  # Custom React hooks
│   ├── use-auth.ts         # Authentication
│   ├── use-products.ts     # Product operations
│   ├── use-sales.ts        # Sales operations
│   ├── use-reports.ts      # Reports data
│   └── use-toast.ts        # Toast notifications
├── lib/
│   ├── api.ts              # API client
│   ├── auth.ts             # Auth utilities
│   ├── types.ts            # TypeScript types
│   ├── utils.ts            # Helper functions
│   ├── export.ts           # CSV/PDF export
│   └── mocks/              # Mock API layer
│       ├── data.ts         # Mock data
│       ├── handlers.ts     # MSW handlers
│       └── browser.ts      # MSW setup
├── providers/              # React providers
│   ├── query-provider.tsx  # TanStack Query
│   └── msw-provider.tsx    # MSW initialization
└── public/                 # Static assets
    └── mockServiceWorker.js
```

## 🎨 Design System

The application uses a consistent design system based on:
- **Colors**: Teal/Cyan primary colors matching the design mockups
- **Typography**: Inter font family
- **Spacing**: Tailwind's default spacing scale
- **Components**: shadcn/ui for consistent, accessible components

## 🔧 Mock API

The application uses Mock Service Worker (MSW) to simulate a backend API. This allows the frontend to be fully functional without requiring a real backend.

### Mock Data Includes:
- 2 Users (1 Admin, 1 Staff)
- 8 Products across 4 categories
- Sample sales transactions
- Dashboard KPIs
- Balance sheet data
- Top products analytics

### API Endpoints:
- `POST /api/auth/login` - User authentication
- `GET /api/me` - Get current user
- `GET /api/products` - List products (with filters)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/dashboard` - Get KPIs
- `GET /api/reports/balancesheet` - Get balance sheet
- `GET /api/reports/top-products` - Get top products

## 📊 Key Features Details

### Balance Sheet Export
- **Presets**: Today, Last 7 Days, This Month, Last Month, This Quarter, This Year
- **Custom Range**: Select any date range
- **Export Formats**: CSV and PDF
- **Data Included**: Daily breakdown of revenue, cost, profit, and sales count

### Printable Receipts
- Professional layout with shop details
- Line items with quantities and prices
- Totals, discounts, and taxes
- Print-friendly CSS
- PDF download option

### Sync Functionality
- Online/offline status indicator
- Manual sync button
- Tracks last sync time
- Shows pending changes count

## 🚀 Deployment

### Build for Production:
```bash
npm run build
npm start
```

### Environment Variables:
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=/api
```

## 🔄 Integrating with Real Backend

To connect to a real backend:

1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. Remove or disable MSW provider in `app/layout.tsx`
3. Ensure backend implements the same API endpoints
4. Update authentication to use HTTP-only cookies if preferred

## 📝 Development Notes

### Adding New Features:
1. Create types in `lib/types.ts`
2. Add API hooks in `hooks/`
3. Create page in `app/`
4. Update mock API handlers if needed

### Styling Guidelines:
- Use Tailwind utility classes
- Follow shadcn/ui component patterns
- Maintain consistent spacing and colors
- Ensure responsive design

## 🐛 Troubleshooting

### MSW Not Working:
1. Ensure `mockServiceWorker.js` is in the `public/` folder
2. Check browser console for MSW initialization messages
3. Clear browser cache and reload

### Build Errors:
1. Delete `.next` folder and rebuild
2. Clear npm cache: `npm cache clean --force`
3. Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

## 📄 License

This project is for demonstration purposes.

## 🤝 Contributing

This is a demo project. For production use, implement proper backend API, security measures, and testing.

## 📞 Support

For issues or questions, please refer to the documentation or create an issue in the repository.

---

Built with ❤️ using Next.js and modern web technologies.