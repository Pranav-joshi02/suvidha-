import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Kpi({ label, value, subdued }: { label: string; value: string | number; subdued?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-500">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${subdued ? "text-amber-600" : ""}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="text-slate-700 text-xl font-semibold">Welcome Nirmal!</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Total Products" value={5483} />
        <Kpi label="Daily Revenue" value="$2,859" />
        <Kpi label="Daily Profit" value="$1,483" />
        <Kpi label="Low Stock" value={38} subdued />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Expenses vs Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 grid place-items-center text-slate-400">Chart placeholder</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Stores by Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-slate-600">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span>Store {i + 1}</span>
                  <span>{(80 - i * 6).toString()}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
