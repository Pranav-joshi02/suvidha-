import { http, HttpResponse, delay } from "msw";
import { addDays, formatISO, subDays } from "date-fns";
import type { UserDTO, ProductDTO, SaleDTO, BalanceSheetRowDTO, Paginated } from "@/types/api";

const API_BASE = "/api";

// In-memory mock DB
const users: Array<UserDTO & { password: string }> = [
  { id: "u1", name: "Shop Owner", role: "ADMIN", email: "owner@example.com", password: "password" },
  { id: "u2", name: "Staff One", role: "STAFF", email: "staff@example.com", password: "password" },
];

const products: ProductDTO[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `p${i + 1}`,
  name: `Product ${i + 1}`,
  sku: `SKU-${1000 + i}`,
  category: i % 2 === 0 ? "Beverages" : "Snacks",
  costPrice: 10 + i,
  sellPrice: 15 + i,
  stock: (i * 3) % 40,
  status: "ACTIVE",
}));

const sales: SaleDTO[] = [];

function makeToken(user: UserDTO) {
  return btoa(JSON.stringify({ sub: user.id, role: user.role, name: user.name }));
}

export const handlers = [
  // Auth
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };
    const user = users.find((u) => u.email === email && u.password === password);
    await delay(400);
    if (!user) return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
    const token = makeToken(user);
  const { password: _pw, ...safeUser } = user;
    return HttpResponse.json({ token, user: safeUser });
  }),

  http.get(`${API_BASE}/me`, ({ request }) => {
    const auth = request.headers.get("authorization");
    if (!auth) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    const token = auth.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const user = users.find((u) => u.id === payload.sub);
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    return HttpResponse.json({ id: user.id, name: user.name, role: user.role, email: user.email });
  }),

  // Products
  http.get(`${API_BASE}/products`, () => {
    return HttpResponse.json(products);
  }),

  // Sales
  http.post(`${API_BASE}/sales`, async ({ request }) => {
    const body = await request.json();
    const { productId, quantity, soldById } = body as { productId: string; quantity: number; soldById: string };
    const product = products.find((p) => p.id === productId);
    if (!product) return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    if (product.stock < quantity) return HttpResponse.json({ message: "Insufficient stock" }, { status: 400 });

    product.stock -= quantity;
    const total = product.sellPrice * quantity;
    const cost = product.costPrice * quantity;
    const profit = total - cost;
    const sale: SaleDTO = {
      id: `s${sales.length + 1}`,
      createdAt: new Date().toISOString(),
      items: [{ productId, name: product.name, quantity, price: product.sellPrice, cost: product.costPrice }],
      totals: { total, cost, profit },
      soldById,
    };
    sales.unshift(sale);
    await delay(300);
    return HttpResponse.json(sale);
  }),

  http.get(`${API_BASE}/sales`, ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    let result = sales;
    if (from || to) {
      result = result.filter((s) => {
        const t = new Date(s.createdAt).getTime();
        return (!from || t >= new Date(from).getTime()) && (!to || t <= new Date(to).getTime());
      });
    }
    const response: Paginated<SaleDTO> = { data: result, page: 1, limit: result.length, total: result.length };
    return HttpResponse.json(response);
  }),

  http.get(`${API_BASE}/reports/balancesheet`, ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    // synthesize daily lines for the range
    const start = from ? new Date(from) : subDays(new Date(), 6);
    const end = to ? new Date(to) : new Date();
    const days = Math.max(1, Math.round((+end - +start) / (24 * 3600 * 1000)) + 1);
    const data: BalanceSheetRowDTO[] = Array.from({ length: days }).map((_, i) => {
      const date = addDays(start, i);
      const revenue = 200 + Math.round(Math.random() * 400);
      const cost = Math.round(revenue * (0.6 + Math.random() * 0.2));
      const profit = revenue - cost;
      return { date: formatISO(date, { representation: "date" }), revenue, cost, profit };
    });
    const totals = data.reduce(
      (acc, d) => ({ revenue: acc.revenue + d.revenue, cost: acc.cost + d.cost, profit: acc.profit + d.profit }),
      { revenue: 0, cost: 0, profit: 0 }
    );
    return HttpResponse.json({ data, totals });
  }),
];
