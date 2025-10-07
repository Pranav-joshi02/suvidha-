import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-16 border-b bg-white flex items-center px-6 justify-between">
        <div className="font-semibold text-2xl text-slate-800">Inventory Management</div>
        <nav className="flex items-center gap-6 text-sm text-slate-700">
          <Link className="hover:text-emerald-700" href="/admin">Dashboard</Link>
          <Link className="hover:text-emerald-700" href="/admin/products">Inventory</Link>
          <Link className="hover:text-emerald-700" href="/admin/sales">Sales</Link>
          <Link className="hover:text-emerald-700" href="/admin/reports/balancesheet">Reporting</Link>
          <Link className="hover:text-emerald-700" href="/admin/settings/users">Settings</Link>
        </nav>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
    </div>
  );
}
