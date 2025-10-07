# Quick Start Guide

Get up and running with the POS & Inventory Management System in minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation & Setup

1. **Navigate to the project directory**:
   ```bash
   cd pos-inventory-app
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Go to [http://localhost:3000](http://localhost:3000)

## Login Credentials

### Admin Access
- **Email**: `admin@pos.com`
- **Password**: `admin123`

### Staff Access
- **Email**: `staff@pos.com`
- **Password**: `staff123`

## Quick Tour

### As Admin

1. **Dashboard** (`/admin`)
   - View KPI cards (Total Products, Daily Revenue, etc.)
   - See quick actions for common tasks
   - Monitor inventory values and top stores

2. **Products** (`/admin/products`)
   - Click "Add Product" to create a new product
   - Search and filter products
   - Edit or delete existing products

3. **Point of Sale** (`/admin/pos`)
   - Search for products
   - Click products to add to cart
   - Adjust quantities and apply discounts
   - Click "Complete Sale" to process

4. **Reports** (`/admin/reports`)
   - Select date range presets (Today, Last 7 days, etc.)
   - View balance sheet with revenue, cost, and profit
   - Export to CSV or PDF
   - Check top-selling products

5. **Sales History** (`/admin/sales`)
   - View all sales transactions
   - Filter by date range
   - Click "View Receipt" to see details

### As Staff

1. **POS** (`/staff/pos`)
   - Quickly record sales
   - Add products to cart
   - Complete transactions

2. **Check Stock** (`/staff/inventory`)
   - Search products
   - View stock levels
   - Check product status

## Key Features to Try

### 1. Record a Sale
1. Login as Admin or Staff
2. Go to POS page
3. Search for "Wireless Mouse"
4. Click to add to cart
5. Adjust quantity if needed
6. Click "Complete Sale"
7. View the receipt page

### 2. Export Balance Sheet
1. Login as Admin
2. Go to Reports page
3. Select "Balance Sheet" tab
4. Choose a date preset (e.g., "Last 7 Days")
5. Click "Download CSV" or "Download PDF"

### 3. Manage Products
1. Login as Admin
2. Go to Inventory/Products
3. Click "Add Product"
4. Fill in the form
5. Click "Create Product"
6. Product appears in the list

### 4. Print a Receipt
1. After completing a sale
2. You're redirected to the receipt page
3. Click "Print Receipt" to open print dialog
4. Or click "Download PDF" to save

## Mock Data

The application comes with pre-populated mock data:

- **8 Products** across 4 categories
- **2 Users** (1 Admin, 1 Staff)
- **Sample Sales** transactions
- **Balance Sheet** data for last 7 days
- **Top Products** analytics

All data is stored in memory and resets on page refresh.

## Troubleshooting

### Server won't start
- Make sure port 3000 is available
- Try: `npm run dev -- -p 3001` to use a different port

### Mock API not working
- Check browser console for errors
- Ensure `mockServiceWorker.js` is in the `public/` folder
- Try clearing browser cache and reloading

### Styling issues
- Make sure all dependencies are installed
- Try: `npm install` again
- Delete `.next` folder and restart server

## Next Steps

- Explore all admin features
- Try the different date range presets in Reports
- Test the POS flow from product selection to receipt
- Check out the responsive design on different screen sizes

## Need Help?

Refer to the main [README.md](./README.md) for detailed documentation.

---

Enjoy using the POS & Inventory Management System! 🎉