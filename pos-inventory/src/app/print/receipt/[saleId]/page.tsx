"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import type { Paginated, SaleDTO } from "@/types/api";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

export default function ReceiptPage() {
  const params = useParams<{ saleId: string }>();
  const { data: sale } = useQuery<SaleDTO | undefined>({
    queryKey: ["sale", params.saleId],
    queryFn: async () => {
      const list = await apiFetch<Paginated<SaleDTO>>("/api/sales");
      return list.data.find((s) => s.id === params.saleId);
    },
  });

  const printPdf = () => {
    if (!sale) return;
    const doc = new jsPDF();
    doc.text("Shop Name", 10, 10);
    doc.text(`Sale #${sale.id}`, 10, 20);
    sale.items.forEach((it, idx) => {
      doc.text(`${it.name} x${it.quantity} - $${(it.price * it.quantity).toFixed(2)}`, 10, 40 + idx * 10);
    });
    doc.text(`Total: $${sale.totals.total.toFixed(2)}`, 10, 100);
    doc.save(`receipt-${sale.id}.pdf`);
  };

  if (!sale) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 print:p-0">
      <div className="max-w-sm mx-auto bg-white p-4 shadow print:shadow-none print:w-full">
        <h1 className="text-center font-semibold">Shop Name</h1>
        <div className="text-sm text-slate-600">{new Date(sale.createdAt).toLocaleString()}</div>
        <div className="my-3 border-t" />
        <div className="space-y-1">
          {sale.items.map((it) => (
            <div key={it.productId} className="flex justify-between text-sm">
              <span>{it.name} x{it.quantity}</span>
              <span>${(it.price * it.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="my-3 border-t" />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${sale.totals.total.toFixed(2)}</span>
        </div>
        <div className="mt-4 hidden print:block text-center text-xs">Thank you!</div>
      </div>
      <div className="mt-4 flex gap-2 no-print">
        <Button onClick={() => window.print()}>Print</Button>
        <Button variant="outline" onClick={printPdf}>Download PDF</Button>
      </div>
      <style jsx global>{`
        @media print {
          .no-print { display: none; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}
