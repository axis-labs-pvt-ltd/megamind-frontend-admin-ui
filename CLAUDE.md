# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured. There are no test files in this project.

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `NEXT_PUBLIC_API_URL` — Optional; legacy Axios base URL (defaults to `/api`)

## Architecture

This is a **Next.js 16 App Router** admin dashboard for an LMS platform (MegaMind Admin). The stack is TypeScript, Tailwind CSS v4, Supabase (backend), React Query, and Zustand.

### Directory Layout

```
src/
├── app/
│   ├── page.tsx              # Public landing page (coral/cream Megamind design)
│   ├── layout.tsx            # Root layout: fonts (Space Grotesk, JetBrains Mono, Inter), AuthProvider, AppProviders, AdminShell
│   ├── (auth)/               # Auth pages — full-screen, no admin chrome
│   ├── dashboard/, tests/, questions/, subjects/, analytics/, settings/  # Admin pages
│   └── tests/take-test/      # Full-screen quiz experience (also exempt from admin chrome)
│       └── components/       # QuizPreScreen, QuizActiveScreen, QuizResultScreen, TheoryDrawer
├── components/
│   ├── features/             # Domain-specific components (questions/, tests/, analytics/, etc.)
│   ├── landing/              # Landing page sections (LandingNav, HeroSection, HowSection, SubjectsSection,
│   │                         #   QuizPreviewSection, PricingSection, FAQSection, LandingFooter)
│   ├── layout/               # Header, Sidebar, AdminShell (conditional admin chrome)
│   ├── providers/            # AppProviders (wraps QueryClientProvider + ThemeProvider)
│   └── ui/                   # Atomic reusable components (Button, Input, Card, etc.)
├── contexts/                 # authcontext.tsx — Supabase auth context
├── hooks/                    # Custom React hooks
├── lib/                      # axios.ts, supabase.ts, query-client.ts, validations/
├── services/
│   ├── api/                  # Supabase-based API functions (current pattern)
│   └── *.ts                  # Legacy Axios-based services
├── store/                    # Zustand stores
└── types/                    # index.ts — all shared domain types
```

### Landing Page Design System

The landing page and test-taking UI (`/` and `/tests/take-test`) use the Megamind brand design system (distinct from the admin UI theme):

| Token | Value | Usage |
|---|---|---|
| Background | `#FFFBF2` (cream) | Page background |
| Alt background | `#FFF2DD` (warm cream) | Section alternates |
| Primary | `#E8541C` (coral) | Buttons, accents |
| Ink | `#1A1514` (near-black) | Text, borders |
| Secondary | `#F4B942` (amber) | Theory cards, highlights |
| Shadow | `6px 6px 0 #1A1514` | Chunky hard shadow on cards/buttons |
| Border | `2px solid #1A1514` | All cards and interactive elements |
| Radius | `18px` | Cards (`--radius`) |

Fonts loaded as CSS variables via `next/font/google`:
- `var(--font-display)` → Space Grotesk — headings, buttons
- `var(--font-mono)` → JetBrains Mono — labels, chips, kickers
- `var(--font-inter)` / `font-sans` → Inter — body text

### Admin Shell Routing

`src/components/layout/AdminShell.tsx` is a client component that checks `usePathname()`. Routes starting with `/auth` or `/tests/take-test`, and the exact path `/`, are rendered without the admin sidebar/header. All other routes get the full admin chrome.

### State Management

Three distinct layers:

| Layer | Tool | When to use |
|---|---|---|
| Server/async data | React Query (`@tanstack/react-query`) | API fetches, lists, profiles |
| Global client UI | Zustand (`src/store/`) | Sidebar state, auth tokens, theme |
| Form state | React Hook Form + Zod | All forms |

**Zustand stores:**
- `useAuthStore` — JWT-based auth (legacy, persisted to localStorage as `auth-storage`)
- `useThemeStore` — Active theme (`light` | `dark` | `neumorphic`), persisted
- `useUIStore` — Sidebar open/close

### Authentication (Two Patterns)

The codebase has two auth approaches in transition:

1. **Current (Supabase):** `AuthProvider` in `src/contexts/authcontext.tsx` uses `@supabase/supabase-js` to manage session. Use `useAuth()` to get `user`, `profile`, `session`, and `logout`. The `profile` record (from the `profiles` table) includes `role: 'student' | 'admin' | 'teacher'`.

2. **Legacy (Axios + JWT):** `useAuthStore` in `src/store/useAuthStore.ts` holds a JWT. `src/lib/axios.ts` auto-attaches `Authorization: Bearer <token>` and calls `useAuthStore.getState().logout()` on 401.

New features should use the Supabase pattern.

### API / Data Layer

**Current pattern** — `src/services/api/*.ts` call Supabase directly:
```typescript
import { supabase } from '@/lib/supabase';
const { data, error } = await supabase.from('tests').select('*');
```

**Legacy pattern** — `src/services/*.ts` use the Axios singleton:
```typescript
import { api } from '@/lib/axios';
const response = await api.get('/tests');
```

When adding new features, use Supabase (`src/services/api/`). Wrap Supabase calls in React Query hooks for component consumption.

### Theme System

Themes apply CSS variables to the document root via `ThemeProvider`. Always use CSS variables rather than hardcoded Tailwind colors:

```tsx
// Use this
<div className="bg-[var(--bg-primary)] text-[var(--text-primary)]">

// Not this
<div className="bg-white text-gray-900">
```

Key variable groups: `--bg-*`, `--text-*`, `--border-*`, `--accent-{blue,green,yellow,red,purple}` (each with a `-light` variant).

### Component Conventions

- **Max 100 lines per file.** Split larger components into focused sub-components.
- Add a comment on line 1 indicating `// Client Component` or `// Server Component`.
- Forms must be their own Client Components — never make an entire page a Client Component just for a form.
- Pages are Server Components by default; only add `'use client'` when the component needs hooks or browser APIs.
- Shared types across a feature folder live in a `types.ts` file in that folder.

### Core Domain Types

Defined in `src/types/index.ts`. Key types:
- `Question` — supports `mcq`, `yes-no`, `drag-drop`, `fill-in-blank`, `multi-select`, `matching`, `true-false`, `text`
- `Test` = `StaticTest | DynamicTest` — static tests reference `questionIds[]`; dynamic tests use `DynamicTestRule[]` (filter by module/category/tag/difficulty)
- `TestSession` — active session state with `answers` map and `currentQuestionIndex`
- `Subject` → `Module` hierarchy used for organizing questions

### Form Validation

Define schemas in `src/lib/validations/`:
```typescript
import * as z from 'zod';
export const mySchema = z.object({ ... });
export type MyValues = z.infer<typeof mySchema>;
```

Use `zodResolver` from `@hookform/resolvers/zod` to connect to `useForm`.
