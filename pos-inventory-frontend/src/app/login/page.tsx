'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogin } from '@/hooks/api'
import { authUtils } from '@/lib/auth'
import { Eye, EyeOff, ShoppingCart } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginMutation.mutateAsync(data)
      
      // Store token and user data
      authUtils.setToken(response.token)
      authUtils.setUser(response.user)
      
      toast.success('Login successful!')
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/staff')
      }
    } catch (error) {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 absolute -top-4 -left-4"></div>
            <div className="w-72 h-72 bg-white rounded-full shadow-lg flex items-center justify-center relative z-10">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-800">POS System</h2>
                  <p className="text-gray-600">Inventory Management</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-600 max-w-md">
              Sign in to access your point of sale and inventory management system
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="space-y-1 pb-8">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    className="h-11"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...register('password')}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Demo Credentials:
                </p>
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <p>Admin: admin@demo.com / password</p>
                  <p>Staff: staff@demo.com / password</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}