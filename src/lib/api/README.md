# API Integration Documentation

This document describes the complete API integration for the Cyberix Security Scanner admin dashboard using TanStack Query and Axios.

## Overview

The API integration provides:
- **Global Axios instance** with interceptors for authentication and error handling
- **TanStack Query** for efficient data fetching, caching, and synchronization
- **Type-safe API services** with full TypeScript support
- **Custom hooks** for each API endpoint
- **Automatic token refresh** and error handling
- **Optimistic updates** and cache invalidation

## Architecture

```
src/
├── lib/
│   └── api/
│       ├── api.ts              # Axios instance with interceptors
│       ├── services.ts         # API service functions
│       ├── constants.ts        # API constants and endpoints
│       └── utils.ts           # Utility functions
├── hooks/
│   └── api/
│       ├── useUsers.ts         # User management hooks
│       ├── useSecurityTools.ts # Security tools hooks
│       ├── usePlans.ts         # Service plans hooks
│       ├── useAds.ts           # Ads management hooks
│       ├── useNotifications.ts # Notifications hooks
│       ├── useAuth.ts          # Authentication hooks
│       ├── useDashboard.ts    # Dashboard hooks
│       ├── useAdmin.ts        # Admin hooks
│       └── index.ts           # Export all hooks
└── providers/
    └── QueryProvider.tsx      # TanStack Query provider
```

## Setup

### 1. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:9000
```

### 2. Query Provider

The `QueryProvider` is already integrated into the root layout:

```tsx
// src/app/layout.tsx
import { QueryProvider } from '@/providers/QueryProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          <ThemeProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

## Usage Examples

### 1. User Management

```tsx
import { useUsers, useUserStats, useUpdateUserStatus } from '@/hooks/api';

function UsersPage() {
  const { data: users, isLoading, error } = useUsers({
    page: 1,
    limit: 10,
    search: 'john',
    status: 'Active'
  });

  const { data: stats } = useUserStats();
  const updateStatus = useUpdateUserStatus();

  const handleStatusUpdate = async (userId: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: userId, status });
      // Status updated successfully
    } catch (error) {
      // Handle error
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users ({stats?.totalUsers})</h1>
      {users?.data.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => handleStatusUpdate(user.id, 'Inactive')}>
            Deactivate
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 2. Authentication

```tsx
import { useLogin, useLogout, useProfile } from '@/hooks/api';

function AuthExample() {
  const { data: profile } = useProfile();
  const login = useLogin();
  const logout = useLogout();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login.mutateAsync({ email, password });
      // User logged in successfully
    } catch (error) {
      // Handle login error
    }
  };

  const handleLogout = async () => {
    await logout.mutateAsync();
    // User logged out
  };

  return (
    <div>
      {profile ? (
        <div>
          <p>Welcome, {profile.firstName}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => handleLogin('user@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
}
```

### 3. Dashboard Data

```tsx
import { useDashboardStats, useDashboardActivity } from '@/hooks/api';

function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activity, isLoading: activityLoading } = useDashboardActivity();

  if (statsLoading || activityLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stats">
        <div>Total Users: {stats?.totalUsers}</div>
        <div>Active Scans: {stats?.activeScans}</div>
        <div>Revenue: ${stats?.totalRevenue}</div>
      </div>
      <div className="activity">
        <h2>Recent Activity</h2>
        {activity?.map(item => (
          <div key={item.id}>{item.message}</div>
        ))}
      </div>
    </div>
  );
}
```

### 4. Mutations with Optimistic Updates

```tsx
import { useUpdateUser, useDeleteUser } from '@/hooks/api';

function UserActions({ user }) {
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleUpdate = async (userData) => {
    try {
      await updateUser.mutateAsync({ id: user.id, data: userData });
      // User updated successfully
    } catch (error) {
      // Handle error
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      try {
        await deleteUser.mutateAsync(user.id);
        // User deleted successfully
      } catch (error) {
        // Handle error
      }
    }
  };

  return (
    <div>
      <button onClick={() => handleUpdate({ name: 'New Name' })}>
        Update User
      </button>
      <button onClick={handleDelete} className="text-red-500">
        Delete User
      </button>
    </div>
  );
}
```

## API Features

### 1. Automatic Token Refresh

The Axios interceptor automatically handles token refresh:

```typescript
// When a 401 error occurs, the interceptor:
// 1. Attempts to refresh the token using the refresh token
// 2. Retries the original request with the new token
// 3. Redirects to login if refresh fails
```

### 2. Error Handling

All API errors are handled consistently:

```typescript
// Error responses include:
{
  message: string;
  status: number;
  data?: any;
}
```

### 3. Caching Strategy

- **Stale Time**: 5 minutes (data remains fresh)
- **Cache Time**: 10 minutes (data remains in cache)
- **Automatic Invalidation**: On mutations
- **Background Refetch**: On window focus

### 4. Query Keys

All queries use consistent, hierarchical keys:

```typescript
// Examples:
['users']                    // All users
['users', 'list', params]    // Users list with params
['users', 'detail', id]       // Specific user
['users', 'stats']           // User statistics
```

## Available Hooks

### User Management
- `useUsers(params)` - Get paginated users
- `useUser(id)` - Get user by ID
- `useUserStats()` - Get user statistics
- `useUpdateUser()` - Update user
- `useUpdateUserStatus()` - Update user status
- `useDeleteUser()` - Delete user

### Security Tools
- `useSecurityTools(params)` - Get security tools
- `useToolCategories()` - Get tool categories
- `useToggleTool()` - Toggle tool status
- `useDeployUpdates()` - Deploy updates

### Service Plans
- `usePlans(params)` - Get service plans
- `usePlan(id)` - Get plan by ID
- `useCreatePlan()` - Create plan
- `useUpdatePlan()` - Update plan
- `useDeletePlan()` - Delete plan

### Ads Management
- `useAds(params)` - Get ads
- `useAdStats()` - Get ad statistics
- `useCreateAd()` - Create ad
- `useUpdateAd()` - Update ad
- `useToggleAd()` - Toggle ad status
- `useDeleteAd()` - Delete ad

### Notifications
- `useNotifications(params)` - Get notifications
- `useNotificationStats()` - Get notification statistics
- `useCreateNotification()` - Create notification
- `useSendNotification()` - Send notification
- `useDeleteNotification()` - Delete notification

### Authentication
- `useProfile()` - Get user profile
- `useLogin()` - Login user
- `useRegister()` - Register user
- `useLogout()` - Logout user
- `useRefreshToken()` - Refresh token

### Dashboard
- `useDashboardStats()` - Get dashboard statistics
- `useDashboardActivity()` - Get recent activity
- `useRevenueChart()` - Get revenue chart data
- `useUsersChart()` - Get users chart data

### Admin
- `useAdminUsers(params)` - Get admin users
- `useAdminUser(id)` - Get admin user by ID
- `useUpdateAdminUserStatus()` - Update admin user status
- `useAdminDashboardStats()` - Get admin dashboard stats

## Type Safety

All API responses are fully typed:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: 'Active' | 'Inactive' | 'Trial' | 'Expired';
  lastScan: string;
  scansCompleted: number;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
}
```

## Error Handling

The API integration provides comprehensive error handling:

1. **Network Errors**: Automatic retry with exponential backoff
2. **Authentication Errors**: Automatic token refresh
3. **Validation Errors**: User-friendly error messages
4. **Server Errors**: Graceful degradation

## Development Tools

In development mode, you get:
- **React Query Devtools**: Visual query inspector
- **Console Logging**: Request/response logging
- **Error Tracking**: Detailed error information

## Best Practices

1. **Use the provided hooks** instead of calling API services directly
2. **Handle loading and error states** in your components
3. **Use optimistic updates** for better UX
4. **Invalidate queries** after mutations
5. **Use proper TypeScript types** for better development experience

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if tokens are stored correctly
2. **Network Errors**: Verify API URL and network connection
3. **Type Errors**: Ensure all types are imported correctly
4. **Cache Issues**: Use React Query Devtools to inspect cache

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

