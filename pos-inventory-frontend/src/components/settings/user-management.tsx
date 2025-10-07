'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useUsers, useCreateUser, useDeleteUser } from '@/hooks/api'
import { toast } from 'sonner'
import { 
  Users, 
  Plus, 
  Trash2, 
  UserCheck, 
  UserX,
  Shield,
  User as UserIcon
} from 'lucide-react'
import { User } from '@/types'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'staff'], {
    required_error: 'Please select a role',
  }),
})

type UserFormData = z.infer<typeof userSchema>

export function UserManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  const { data: users, isLoading } = useUsers()
  const createUserMutation = useCreateUser()
  const deleteUserMutation = useDeleteUser()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const selectedRole = watch('role')

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'staff', label: 'Staff Member' },
  ]

  const onSubmit = async (data: UserFormData) => {
    try {
      await createUserMutation.mutateAsync(data)
      toast.success('User created successfully!')
      reset()
      setShowAddForm(false)
    } catch (error) {
      toast.error('Failed to create user')
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        await deleteUserMutation.mutateAsync(userId)
        toast.success('User deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      )
    }
    return (
      <Badge variant="secondary">
        <UserIcon className="w-3 h-3 mr-1" />
        Staff
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            User Management ({users?.length || 0} users)
          </CardTitle>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add User Form */}
        {showAddForm && (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register('password')}
                      placeholder="Enter password"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Role *</Label>
                    <SearchableSelect
                      options={roleOptions}
                      value={selectedRole}
                      onSelect={(option) => setValue('role', option.value as 'admin' | 'staff')}
                      placeholder="Select user role"
                    />
                    {errors.role && (
                      <p className="text-sm text-red-500">{errors.role.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      reset()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        {users && users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      disabled={deleteUserMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first user
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}