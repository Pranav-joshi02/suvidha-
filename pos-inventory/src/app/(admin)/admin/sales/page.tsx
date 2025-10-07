"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, useAuth } from "@/lib/auth";
import type { ProductDTO, SaleDTO } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Product = Pick<ProductDTO, "id" | "name" | "sellPrice" | "costPrice" | "stock">;

export default function POSPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  const { data: products } = useQuery<Product[]>({ queryKey: ["products"], queryFn: () => apiFetch<ProductDTO[]>("/api/products") });

  const saleMutation = useMutation({
    mutationFn: async () =>
      apiFetch<SaleDTO>("/api/sales", {
        method: "POST",
        body: JSON.stringify({ productId: selected!.id, quantity: qty, soldById: user?.id }),
      }),
    onSuccess: (sale: SaleDTO) => {
      toast.success("Sale recorded");
      window.open(`/print/receipt/${sale.id}`, "_blank");
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Error"),
  });

  const filtered = (products || []).filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const total = selected ? selected.sellPrice * qty : 0;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Point of Sale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search product" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
          <div className="max-h-64 overflow-auto divide-y rounded border">
            {filtered.map((p) => (
              <button
                key={p.id}
                className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${selected?.id === p.id ? "bg-emerald-50" : ""}`}
                onClick={() => setSelected(p)}
              >
                <div className="flex items-center justify-between">
                  <span>{p.name}</span>
                  <span className="text-sm text-slate-600">${p.sellPrice.toFixed(2)} · Stock {p.stock}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Totals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-slate-600">Selected: {selected ? selected.name : "—"}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</Button>
            <Input type="number" className="w-20 text-center" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
            <Button variant="outline" onClick={() => setQty((q) => q + 1)}>+</Button>
          </div>
          <div className="text-2xl font-semibold">${total.toFixed(2)}</div>
          <Button disabled={!selected || saleMutation.isPending} onClick={() => saleMutation.mutate()} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Complete Sale
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
