# AGENTS.md

This guide helps agentic coding assistants work effectively in this Next.js codebase.

## Build and Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production bundle (verifies TypeScript and lints)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check for code issues
- `npx prisma generate` - Generate Prisma client (runs automatically postinstall)
- `npx prisma studio` - Open Prisma Studio to browse database

**Note:** This codebase does not currently have tests set up.

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components
  - `components/ui/` - Base UI components
- `lib/` - Utility functions and helpers
- `hooks/` - Custom React hooks
- `content/` - MDX content (blog posts, projects)
- `prisma/` - Database schema and migrations

## Code Style Guidelines

### Imports

Import order: React/Next.js first, then third-party libraries, then local imports using `@/` alias.

```typescript
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";

import NavLink from "@/components/ui/NavLink";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { formatDate } from "@/lib/formatdate";
```

### Naming Conventions

- Components: PascalCase (`Navigation`, `ThemeSwitcher`, `Post`)
- Functions/variables: camelCase (`formatDate`, `getTopPosts`)
- Constants: UPPER_SNAKE_CASE (`FALLBACK_IP_ADDRESS`, `API_KEY`)
- Files: Components use PascalCase (`Navigation.tsx`), utilities use camelCase (`formatdate.ts`)

### Types

TypeScript strict mode is enabled. Define component props explicitly:

```typescript
type PostProps = {
  post: Post;
  mousePosition?: {
    x: number;
    y: number;
  };
};

export default function Post({ post, mousePosition }: PostProps) {
```

Use interfaces or type aliases for async function returns:

```typescript
export async function getTopPosts(limit: number = 5): Promise<PostWithViews[]> {
  // ...
}
```

### Styling

Use Tailwind CSS with the `cn()` utility for class merging:

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-classes", condition && "conditional-class")} />
```

Prettier is configured with `prettier-plugin-tailwindcss` to automatically sort Tailwind classes.

### Component Patterns

- Add `"use client";` at the top of client components
- Use default exports for components
- Use clsx or cn() for conditional class names
- Client components use hooks and interactivity
- Server components (default) can be async and access database directly

### API Routes

Use Next.js App Router route handlers:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // logic
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error message" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
```

### Error Handling

- Wrap async operations in try-catch blocks
- Use appropriate HTTP status codes (400, 403, 404, 500)
- Log errors with console.error()
- Use NextResponse.json() for API error responses
- For page not found, use `notFound()` from `next/navigation`

### Database (Prisma)

Prisma client should be instantiated at file level. Always disconnect in finally block:

```typescript
try {
  const post = await prisma.post.findUnique({ where: { slug } });
  // ...
} finally {
  await prisma.$disconnect();
}
```

### Headers and IP Detection

Use the `headers()` function to get request headers. For IP detection, check `x-forwarded-for` first, then `x-real-ip`:

```typescript
function getIP() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }
  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}
```

### Contentlayer

Blog posts and projects use Contentlayer with MDX. Types are auto-generated in `.contentlayer/generated`. Import from there:

```typescript
import { allPosts, Post as PostType } from ".contentlayer/generated";
```

### Key Libraries

- `clsx` / `tailwind-merge` - Conditional class handling (via `cn()`)
- `next-themes` - Theme switching (light/dark/terminal)
- `framer-motion` - Animations
- `@headlessui/react` - Accessible UI components
- `swr` - Data fetching in client components
- `date-fns` - Date formatting

### Linting and Formatting

- Run `npm run lint` before committing
- Prettier will auto-format on save (when configured in IDE)
- Use single quotes
- Add trailing commas in multiline arrays/objects
