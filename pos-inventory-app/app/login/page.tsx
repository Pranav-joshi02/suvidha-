'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Package } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const { login, isAuthenticated, isLoading, loginError } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  const onSubmit = (data: LoginForm) => {
    login(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <div className="w-full max-w-6xl mx-4 grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-teal-200 rounded-full opacity-30"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-200 rounded-full opacity-30"></div>
              
              {/* Main illustration placeholder */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* Laptop illustration */}
                  <div className="w-64 h-40 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg shadow-lg relative">
                    <div className="absolute inset-2 bg-white rounded"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-gray-300 rounded-t-lg"></div>
                  </div>
                  
                  {/* Coffee cup */}
                  <div className="absolute top-12 right-8 w-12 h-14 bg-red-400 rounded-b-lg">
                    <div className="w-full h-3 bg-red-300 rounded-t-lg"></div>
                  </div>
                  
                  {/* Plant */}
                  <div className="absolute top-20 left-8 w-10 h-16 bg-green-500 rounded-t-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">POS System</span>
              </div>
              <CardTitle className="text-2xl">Welcome back!</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email or phone number</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...register('email')}
                          className="pl-10"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs">@</span>
                          </div>
                        </div>
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          {...register('password')}
                          className="pl-10"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs">🔒</span>
                          </div>
                        </div>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                      )}
                    </div>

                    {loginError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">
                          {loginError instanceof Error ? loginError.message : 'Login failed'}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <a href="#" className="text-primary hover:underline">
                        Forgot your password?
                      </a>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Sign up functionality coming soon. Please contact your administrator.
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">
                  Demo Credentials: admin@pos.com / admin123 or staff@pos.com / staff123
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Links */}
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-primary">Home</a>
            <a href="#" className="hover:text-primary">Our products</a>
            <a href="#" className="hover:text-primary">About Us</a>
            <a href="#" className="hover:text-primary">Contact US</a>
          </div>
        </div>
      </div>
    </div>
  )
}