# POS & Inventory Management System

A comprehensive point of sale and inventory management system built with Next.js, TypeScript, and modern React patterns.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Staff)
- Secure token storage
- Automatic route protection

### 📊 Admin Dashboard
- Real-time KPI cards (Total Products, Daily Revenue, Daily Profit, Low Stock Count)
- Quick action buttons for common tasks
- Responsive design for tablets and desktop

### 🛒 Point of Sale (POS)
- Searchable product catalog
- Real-time cart management
- Quantity controls
- Automatic price calculations
- Profit tracking
- Optimistic UI updates

### 📦 Product Management
- Product listing with search and filters
- Add/Edit product forms
- Stock level monitoring
- Category management
- SKU tracking

### 📈 Sales & Reporting
- Sales history with pagination
- Daily and monthly reports
- Balance sheet generation
- Export functionality (CSV/PDF)
- Top products analysis

### ⚙️ Settings & Configuration
- User management (Add/Remove staff)
- Low stock threshold settings
- Shop information management
- Password change functionality

### 🖨️ Receipt & Export
- Printable receipt generation
- PDF download functionality
- Professional receipt formatting
- Print-optimized layouts

### 🔄 Online/Offline Sync
- Offline data storage
- Sync status indicators
- Conflict resolution
- Background sync capabilities

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms**: react-hook-form + zod
- **Tables**: @tanstack/react-table
- **Charts**: recharts
- **Icons**: lucide-react
- **Database**: Prisma (SQLite for development)
- **API Mocking**: MSW (Mock Service Worker)
- **Export**: papaparse (CSV), jsPDF (PDF)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pos-inventory-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

**Admin Account:**
- Email: admin@shop.com
- Password: password123

**Staff Account:**
- Email: staff@shop.com
- Password: password123

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin-only pages
│   ├── staff/             # Staff-only pages
│   ├── login/             # Authentication
│   └── print/             # Printable pages
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   ├── pos/              # Point of Sale components
│   ├── products/         # Product management
│   └── ui/               # shadcn/ui components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── mocks/           # MSW mock handlers
├── providers/            # React providers
└── types/               # TypeScript type definitions
```

## API Integration

The application is designed to work with a backend API. The expected API endpoints are:

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `POST /api/sales` - Create sale
- `GET /api/sales` - List sales with pagination

### Reports
- `GET /api/reports/kpis` - Get dashboard KPIs
- `GET /api/reports/balancesheet` - Get balance sheet data
- `GET /api/reports/daily` - Get daily report
- `GET /api/reports/monthly` - Get monthly report

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user

## Development

### Mock API
The application uses MSW (Mock Service Worker) for API mocking during development. Mock data includes:
- Sample products with various categories
- Mock sales transactions
- User accounts for testing
- KPI data for dashboards

### Database Schema
The Prisma schema defines the following models:
- User (Admin/Staff roles)
- Product (with categories)
- Sale (with line items)
- Category
- Setting

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL="file:./dev.db"
```

## Features in Detail

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for tablets and POS terminals
- Accessible keyboard navigation

### Offline Support
- Service worker implementation
- Local data caching
- Sync indicators
- Conflict resolution

### Export Functionality
- CSV export for data analysis
- PDF generation for receipts and reports
- Print-optimized layouts
- Customizable templates

### Security
- JWT token management
- Role-based route protection
- Input validation and sanitization
- XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.