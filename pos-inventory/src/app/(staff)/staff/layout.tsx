import { ReactNode } from "react";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-16 border-b bg-white flex items-center px-6">
        <div className="font-semibold text-2xl text-slate-800">POS</div>
      </header>
      <main className="max-w-3xl mx-auto p-6">{children}</main>
    </div>
  );
}
