"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatISO, startOfMonth, startOfQuarter, startOfToday, startOfYear, subDays } from "date-fns";
import type { BalanceSheetRowDTO } from "@/types/api";
import Papa from "papaparse";
import jsPDF from "jspdf";

function presetRange(preset: string) {
  const today = startOfToday();
  switch (preset) {
    case "today":
      return { from: today, to: today };
    case "last7":
      return { from: subDays(today, 6), to: today };
    case "thisMonth":
      return { from: startOfMonth(today), to: today };
    case "lastMonth": {
      const first = startOfMonth(subDays(today, today.getDate()));
      return { from: first, to: subDays(first, 1) };
    }
    case "thisQuarter":
      return { from: startOfQuarter(today), to: today };
    case "thisYear":
      return { from: startOfYear(today), to: today };
    default:
      return { from: subDays(today, 6), to: today };
  }
}

export default function BalanceSheetPage() {
  const [range, setRange] = useState(() => presetRange("last7"));
  const { data } = useQuery<{ data: BalanceSheetRowDTO[]; totals: { revenue: number; cost: number; profit: number } }>({
    queryKey: ["balancesheet", range],
    queryFn: () =>
      apiFetch(`/api/reports/balancesheet?from=${formatISO(range.from, { representation: "date" })}&to=${formatISO(range.to, { representation: "date" })}`),
  });

  const downloadCsv = () => {
    const csv = Papa.unparse(data?.data || []);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "balance-sheet.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Balance Sheet", 10, 10);
    let y = 20;
    (data?.data || []).forEach((row: BalanceSheetRowDTO) => {
      doc.text(`${row.date}  R:${row.revenue} C:${row.cost} P:${row.profit}`, 10, y);
      y += 8;
    });
    if (data?.totals)
      doc.text(`Totals  R:${data.totals.revenue} C:${data.totals.cost} P:${data.totals.profit}`, 10, y + 10);
    doc.save("balance-sheet.pdf");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setRange(presetRange("today"))}>Today</Button>
            <Button variant="outline" onClick={() => setRange(presetRange("last7"))}>Last 7 days</Button>
            <Button variant="outline" onClick={() => setRange(presetRange("thisMonth"))}>This Month</Button>
            <Button variant="outline" onClick={() => setRange(presetRange("thisQuarter"))}>This Quarter</Button>
            <Button variant="outline" onClick={() => setRange(presetRange("thisYear"))}>This Year</Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadCsv}>Download CSV</Button>
            <Button variant="outline" onClick={downloadPdf}>Download PDF</Button>
          </div>
          <div className="border rounded overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Revenue</th>
                  <th className="text-left p-2">Cost</th>
                  <th className="text-left p-2">Profit</th>
                </tr>
              </thead>
              <tbody>
                {(data?.data || []).map((row) => (
                  <tr key={row.date} className="border-t">
                    <td className="p-2">{row.date}</td>
                    <td className="p-2">{row.revenue}</td>
                    <td className="p-2">{row.cost}</td>
                    <td className="p-2">{row.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.totals && (
            <div className="text-right text-sm text-slate-700">Totals — Revenue: {data.totals.revenue} · Cost: {data.totals.cost} · Profit: {data.totals.profit}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
