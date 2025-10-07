"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/sonner";

// Lazily start MSW in development for mocked APIs
async function startMocks() {
  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("@/mocks/browser");
    // Avoid double-starting in Fast Refresh
    if (!(window as unknown as { __msw_worker_started?: boolean }).__msw_worker_started) {
      await worker.start({ onUnhandledRequest: "bypass" });
      (window as unknown as { __msw_worker_started?: boolean }).__msw_worker_started = true;
    }
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  useEffect(() => {
    startMocks();
  }, []);

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
