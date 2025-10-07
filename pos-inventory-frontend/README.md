# POS & Inventory Management System

A modern, responsive Point of Sale and Inventory Management system built with Next.js, TypeScript, and Tailwind CSS. This application provides comprehensive tools for managing products, processing sales, generating reports, and handling user management.

## 🚀 Features

### Authentication & User Management
- JWT-based authentication with secure token storage
- Role-based access control (Admin/Staff)
- User management with different permission levels
- Secure logout functionality

### Point of Sale (POS)
- Fast product search with real-time filtering
- Shopping basket with quantity management
- Automatic price and profit calculations
- Touch-friendly interface for tablets/terminals
- Keyboard navigation support
- Real-time stock validation

### Product Management
- Complete product CRUD operations
- Category-based organization
- Stock level monitoring with low-stock alerts
- Cost and selling price management
- Profit margin calculations
- SKU tracking

### Sales & Receipts
- Complete sale processing
- Printable receipts with professional formatting
- PDF receipt generation and download
- Receipt includes shop details, items, taxes, and totals
- Print-optimized styling for thermal and standard printers

### Reports & Analytics
- Daily and monthly sales reports
- Interactive charts with revenue, cost, and profit trends
- KPI dashboard with key metrics
- Balance sheet export (CSV & PDF)
- Date range filtering with presets
- Top-selling products analysis

### Inventory Management
- Real-time stock tracking
- Low stock threshold alerts
- Stock updates on sales
- Category-based filtering
- Search functionality across products

### Settings & Configuration
- Shop information management
- Tax rate configuration
- Low stock threshold settings
- Currency settings
- User role management

### Sync & Offline Support
- Online/offline status monitoring
- Automatic sync when connection restored
- Manual sync capability
- Real-time sync status indicators
- Optimistic UI updates

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query + Zustand
- **Forms**: react-hook-form + zod
- **Tables**: @tanstack/react-table
- **Charts**: recharts
- **Icons**: lucide-react
- **Authentication**: JWT (custom implementation)
- **PDF Generation**: jsPDF
- **CSV Export**: papaparse
- **Mock API**: MSW (Mock Service Worker)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pos-inventory-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Demo Credentials

The application includes mock data and authentication for demonstration:

### Admin Access
- **Email**: admin@demo.com
- **Password**: password
- **Permissions**: Full access to all features

### Staff Access
- **Email**: staff@demo.com
- **Password**: password
- **Permissions**: POS operations and basic reporting

## 📱 Application Structure

### Admin Dashboard (`/admin`)
- KPI cards showing key metrics
- Quick action buttons for common tasks
- Navigation to all admin features

### Staff Dashboard (`/staff`)
- Simplified interface for POS operations
- Quick access to sales processing
- Basic inventory checking

### Key Pages & Routes

#### Authentication
- `/login` - Login page with role-based redirection

#### Admin Routes
- `/admin` - Admin dashboard
- `/admin/products` - Product listing and management
- `/admin/products/new` - Add new product
- `/admin/products/[id]/edit` - Edit existing product
- `/admin/sales` - POS system for admins
- `/admin/reports/daily` - Daily sales reports
- `/admin/reports/monthly` - Monthly sales reports
- `/admin/reports/balancesheet` - Balance sheet export
- `/admin/settings` - General settings
- `/admin/settings/users` - User management

#### Staff Routes
- `/staff` - Staff dashboard
- `/staff/pos` - Point of sale system

#### Shared Routes
- `/print/receipt/[saleId]` - Printable receipt view

## 🎨 UI/UX Features

### Design System
- Consistent color scheme with blue/cyan primary colors
- Professional, clean interface design
- Responsive layout for desktop, tablet, and mobile
- Accessible components with proper ARIA labels
- Touch-friendly buttons and interactions

### User Experience
- Fast search with real-time filtering
- Keyboard shortcuts for POS operations
- Optimistic UI updates for better perceived performance
- Loading states and error handling
- Toast notifications for user feedback
- Print-optimized receipt layouts

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### Mock API
The application uses MSW (Mock Service Worker) for API simulation:
- Automatic initialization in development mode
- Realistic API responses with proper error handling
- Persistent data during session (resets on page refresh)
- Configurable delays for testing loading states

## 📊 Mock Data

The application includes comprehensive mock data:
- **Users**: Admin and staff users with different roles
- **Categories**: Electronics, Clothing, Books, Home & Garden, Food & Beverages
- **Products**: 8 sample products with varying stock levels
- **Sales**: Historical sales data for reporting
- **Settings**: Shop configuration with tax rates and thresholds

## 🖨 Printing & Export Features

### Receipt Printing
- Browser-native print dialog
- Optimized for thermal receipt printers (80mm width)
- Clean layout with shop branding
- Itemized listing with quantities and prices
- Tax calculations and totals
- Professional footer with sale ID

### PDF Generation
- Client-side PDF creation using jsPDF
- Thermal receipt format (80mm x variable height)
- Automatic filename generation with date and sale ID
- Includes all receipt information in print-ready format

### CSV Export
- Balance sheet data export
- Sales history export
- Configurable date ranges
- Proper CSV formatting with headers

## 🔄 Sync System

### Online/Offline Detection
- Automatic network status monitoring
- Visual indicators for connection state
- Graceful degradation when offline
- Automatic sync when connection restored

### Sync Features
- Manual sync trigger
- Automatic periodic sync (5-minute intervals)
- Sync status indicators (online, offline, syncing, error)
- Toast notifications for sync events
- Last sync timestamp display

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deployment Platforms
The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

### Environment Setup
1. Set production environment variables
2. Configure API endpoints
3. Set up SSL certificates
4. Configure domain and DNS

## 🔒 Security Features

### Authentication
- JWT token storage in secure HTTP-only cookies
- Automatic token expiration handling
- Role-based route protection
- Secure logout with token cleanup

### Data Protection
- Input validation with Zod schemas
- XSS protection through React's built-in escaping
- CSRF protection through SameSite cookies
- Secure headers configuration

## 📈 Performance Optimizations

### Frontend Performance
- React Query for efficient data fetching and caching
- Optimistic UI updates for better UX
- Component lazy loading
- Image optimization (when needed)
- Bundle splitting and code optimization

### Data Management
- Efficient state management with Zustand
- Query invalidation for real-time updates
- Debounced search inputs
- Pagination for large datasets

## 🧪 Testing

### Mock Service Worker
- Realistic API simulation
- Configurable response delays
- Error scenario testing
- Offline behavior simulation

### Manual Testing Scenarios
1. **Authentication Flow**: Login/logout with different roles
2. **POS Operations**: Add products, modify quantities, complete sales
3. **Product Management**: CRUD operations, stock validation
4. **Reporting**: Generate reports, export data
5. **Offline Mode**: Test sync behavior and offline functionality

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions, issues, or feature requests:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs
4. Provide mockups or examples for feature requests

## 🔮 Future Enhancements

Potential features for future development:
- Barcode scanning integration
- Multi-location inventory management
- Advanced reporting with custom date ranges
- Email receipt functionality
- Inventory forecasting
- Supplier management
- Purchase order system
- Advanced user permissions
- API integration with accounting software
- Mobile app companion

---

**Built with ❤️ using Next.js and modern web technologies**