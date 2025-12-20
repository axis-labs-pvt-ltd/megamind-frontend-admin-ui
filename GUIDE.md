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
