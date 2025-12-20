# Developer Guide: MegaMind Admin

This guide outlines the standard architecture, state management patterns, and development workflows for the MegaMind Admin Dashboard.

## 1. Architecture Overview
We follow a strict separation of concerns to ensure scalability and maintainability.

- **`src/app`**: Next.js App Router pages and layouts. (Structure/Routing)
- **`src/components`**: React components (UI).
    - `components/ui`: Reusable atomic components (Buttons, Inputs).
    - `components/features`: Complex, domain-specific components (e.g., `TestCard`, `QuestionForm`).
- **`src/services`**: API interaction layer. **All** API calls must go here.
- **`src/store`**: Global Client State (Zustand).
- **`src/lib`**: Configuration and singletons (Axios, QueryClient).

---

## 2. State Management Strategy

We use a hybrid approach to state management:

### Server State (Async Data) -> **React Query (@tanstack/react-query)**
*   **Use for**: Any data fetched from an API (Lists of tests, user profiles, analytics).
*   **Why**: Handles caching, automatic refetching, loading states, and error handling out of the box. Eliminates `useEffect` for data fetching.

### Global Client State -> **Zustand**
*   **Use for**: UI state that needs to be accessed globally (Sidebar open/close, Auth Tokens, Theme, Active Quiz Session).
*   **Why**:
    *   **Performance**: Updates only re-render components that "select" that specific slice of state.
    *   **Simplicity**: Less boilerplate than Redux/Context.
    *   **Outside Components**: Can be accessed in plain JS files (like `src/lib/axios.ts` for tokens).

### Local Component State -> **useState / useReducer**
*   **Use for**: Form inputs (controlled via `react-hook-form`), toggles specific to one component.

### Form State -> **React Hook Form + Zod**
*   **Use for**: All complex forms.
*   **Why**: Optimization (uncontrolled inputs), easy validation schema integration via Zod.

---

## 3. Security & Authentication

Security is handled via a centralized **Auth Store** and **Axios Interceptors**.

1.  **Token Storage**: `useAuthStore` persists the JWT (localStorage by default).
2.  **Request Signatures**: `src/lib/axios.ts` automatically attaches the `Authorization: Bearer <token>` header to every request if the token exists in the store.
3.  **Automatic Logout**: If the API returns `401 Unauthorized`, the interceptor in `src/lib/axios.ts` will trigger `useAuthStore.getState().logout()`, redirecting the user to login.

**Action Item for Developers**:
*   **DO NOT** manually add headers to your API calls.
*   Just call `useAuthStore.getState().login(user, token)` when the user signs in.

---

## 4. Real-Time Logic (Quizzes)

For real-time features (e.g., live quiz taking, leaderboards), we recommend the following pattern:

1.  **Connection**: Use a Zustand store (e.g., `useQuizStore`) to hold the active Socket connection.
2.  **Event Handling**:
    *   Initialize the socket connection in a top-level component (e.g., `QuizSessionLayout`) using `useEffect`.
    *   On socket events (e.g., `question_received`, `score_update`), update the Zustand store.
    *   **Optimistic Updates**: Update the UI immediately via Zustand, then reconcile with the server if needed.

**Why Zustand for Real-time?**
React Query is great for *intermittent* polling/fetching, but high-frequency updates (like a countdown timer or live score stream) can cause excessive cache thrashing. Zustand handles these ephemeral high-frequency updates more efficiently.

---

## 5. Development Workflow: Adding a New Feature

Follow this checklist when adding a new feature (e.g., "Manage Users").

### Step 1: Define the API Service
Create `src/services/users.service.ts`.
```typescript
import { api } from '@/lib/axios';

export const UsersService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  create: async (data: UserPayload) => {
    const response = await api.post('/users', data);
    return response.data;
  }
};
```

### Step 2: Create React Query Hooks (Optional but Recommended)
You can create a custom hook to encapsulate the query key.
```typescript
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: UsersService.getAll,
  });
};
```

### Step 3: Build the Component
Use the hook in your Client Component.
```tsx
'use client';
import { useUsers } from '@/hooks/useUsers';

export default function UsersList() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <Spinner />;
  
  return (
    <div>
      {data.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
```

---

## 6. Theme System

The application supports multiple themes managed by Zustand with automatic persistence.

### Using the Theme System

```typescript
import { useThemeStore } from '@/store/useThemeStore';

function MyComponent() {
  const { theme, setTheme } = useThemeStore();
  
  // Get current theme
  console.log(theme); // 'light' | 'dark' | 'midnight' | 'forest'
  
  // Change theme
  setTheme('dark');
}
```

### Available Themes
- **light**: Default clean white theme
- **dark**: Modern dark slate theme

> **Note**: Additional themes can be added in the future by extending the theme configurations in `globals.css` and updating `useThemeStore.ts`.

### Using Theme Variables in Components

Instead of hardcoded Tailwind classes, use CSS variables for theme-aware styling:

```tsx
// ❌ Bad - Hardcoded colors
<div className="bg-white text-gray-900 border-gray-200">

// ✅ Good - Theme-aware
<div className="bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)]">
```

### Available CSS Variables

**Backgrounds:**
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--bg-card`, `--bg-sidebar`, `--bg-header`
- `--bg-hover`, `--bg-active`

**Text:**
- `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse`

**Borders:**
- `--border-primary`, `--border-secondary`, `--border-hover`

**Accents:**
- `--accent-blue`, `--accent-green`, `--accent-yellow`, `--accent-red`, `--accent-purple`
- Each has a `-light` variant (e.g., `--accent-blue-light`)

**Gradients:**
- `--gradient-primary`, `--gradient-brand`

---

## 7. Component Organization Best Practices

### Server vs Client Components

**Server Components** (Default - No `'use client'`):
- Use for pages that compute data
- No interactivity or browser APIs needed
- Better performance - rendered on server

```tsx
// Server Component - Analytics page

import { StatCard } from '@/components/features/analytics/StatCard';

export default function AnalyticsPage() {
  // Compute data on server
  const stats = calculateStats();
  
  return <StatCard {...stats} />;
}
```

**Client Components** (Requires `'use client'`):
- Interactive elements (buttons, forms, inputs)
- Uses hooks (useState, useEffect, custom hooks)
- Needs browser APIs or event handlers

```tsx
// Client Component - Question filtering controls

'use client';

import { useState } from 'react';

export function QuestionFilters() {
  const [filter, setFilter] = useState('all');
  // ...
}
```

### Component Documentation

Always add a comment at the top of files indicating component type:

```tsx
// Client Component - Displays and manages list of questions

'use client';

export function QuestionList() {
  // ...
}
```

```tsx
// Server Component - Analytics page with computed data

export default function AnalyticsPage() {
  // ...
}
```

### Creating Reusable Components

1. **Extract common patterns**: If UI appears 3+ times, make it a component
2. **Share types**: Create `types.ts` files for interfaces used by multiple components
3. **Keep components focused**: Each component should have one clear responsibility
4. **Use props for configuration**: Make components flexible through props, not duplication

Example:
```tsx
// components/features/analytics/types.ts
export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

// components/features/analytics/StatCard.tsx
// Client Component - Reusable stat display card

'use client';

import type { StatCardProps } from './types';

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <Card>
      <Icon />
      <p>{label}</p>
      <p>{value}</p>
    </Card>
  );
}
```

### File Organization

```
src/
├── components/
│   ├── features/          # Domain-specific components
│   │   ├── analytics/
│   │   │   ├── StatCard.tsx
│   │   │   └── types.ts   # Shared types
│   │   ├── questions/
│   │   └── tests/
│   ├── layout/            # Layout components (Header, Sidebar)
│   ├── shared/            # Shared business logic components
│   └── ui/                # Pure UI components (Button, Input, Card)
├── app/                   # Next.js pages
├── store/                 # Zustand stores
├── services/              # API services
└── lib/                   # Utilities and configurations
```

---

## 8. Next Steps for Contributing

When adding new features:

1. **Follow the architecture**: Use services → React Query → Components pattern
2. **Componentize properly**: Extract reusable parts, use shared types
3. **Document component type**: Add `// Client Component` or `// Server Component` comment
4. **Use theme variables**: Never hardcode colors in new components
5. **Update CHANGELOG.md**: Document your changes
6. **Test themes**: Verify your component works in all 4 themes

---

## 9. Form & Validation Standards

We use a standardized approach for all forms to ensure consistency and type safety.

### Technology Stack
- **Form State**: `react-hook-form`
- **Validation**: `zod`
- **Integration**: `@hookform/resolvers/zod`

### Implementation Pattern

1.  **Define Schema**: Create a schema in `src/lib/validations/your-feature.ts`.
    ```typescript
    import * as z from 'zod';

    export const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    export type LoginValues = z.infer<typeof loginSchema>;
    ```

2.  **Create Form**:
    ```tsx
    'use client';
    import { useForm } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { loginSchema, LoginValues } from '@/lib/validations/auth';

    export function LoginForm() {
      const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema)
      });

      const onSubmit = (data: LoginValues) => {
        // Safe access to data
      };

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register('email')} error={errors.email?.message} />
          <Button type="submit">Login</Button>
        </form>
      );
    }
    ```

---

## 10. API Service Layer Structure

All API calls must be centralized in `src/services/`.

- **`api.ts`**: Base Axios instance with interceptors.
- **`auth.ts`**: Authentication endpoints.
- **`user.ts`**: User profile and settings.
- **`tests.ts`**: Test creation and management.


---

## 11. Specific Form Component Standards

Forms using hooks like `useForm` must be their own Client Components (e.g., `feature/LoginForm.tsx`) and be imported into pages. Do not make the entire page a Client Component unless necessary.

```tsx
// src/components/features/auth/LoginForm.tsx
'use client';
export function LoginForm() { ... }

// src/app/(auth)/login/page.tsx
import { LoginForm } from '@/components/features/auth/LoginForm';
export default function LoginPage() { return <LoginForm />; }
```

