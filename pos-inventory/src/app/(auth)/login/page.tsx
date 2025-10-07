"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { LucideLogIn } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const result = await login(values.email, values.password);
    setLoading(false);
    if (result.ok) {
      toast.success("Welcome back!");
      router.replace(result.role === "ADMIN" ? "/admin" : "/staff");
    } else {
      toast.error(result.error ?? "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-teal-50 to-emerald-100 p-4">
      <Card className="w-full max-w-3xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-semibold text-teal-700">Login</CardTitle>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="username" aria-label="Email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="current-password" aria-label="Password" {...form.register("password")} />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <button type="button" className="text-sm text-teal-700 hover:underline">Forgot your password?</button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  <LucideLogIn className="h-4 w-4 mr-2" /> {loading ? "Signing in..." : "Login"}
                </Button>
              </div>
            </form>
          </div>
          <div className="hidden md:block bg-gradient-to-br from-emerald-400 to-teal-500" aria-hidden>
            {/* Decorative panel matching inspiration UI */}
          </div>
        </div>
        <CardContent className="hidden" />
      </Card>
    </div>
  );
}
