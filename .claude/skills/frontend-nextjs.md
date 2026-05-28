# Frontend — React & Next.js Standards

## Stack
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Framer Motion (animations)
- shadcn/ui (component library)
- Zustand (state management)
- React Query / TanStack Query (server state)
- Axios (HTTP client)
- React Hook Form + Zod (forms and validation)

## Project Structure
```
src/
  app/              # Next.js App Router pages
  components/
    ui/             # Base UI components (shadcn)
    common/         # Shared components across features
    features/       # Feature-specific components
  hooks/            # Custom React hooks
  lib/              # Utilities, helpers, config
  services/         # API call functions
  store/            # Zustand state stores
  types/            # TypeScript type definitions
  styles/           # Global styles
```

## Component Rules
- One component per file
- Component file name = component name (PascalCase)
- Export as default + named export
- Props interface defined above component
- No prop drilling beyond 2 levels — use context or state
- Max component size: 150 lines — split if larger

## TypeScript Rules
- Strict mode always enabled
- No any types — ever
- Interfaces for object shapes, types for unions/primitives
- All API responses typed
- All component props typed
- Enums for fixed value sets

## Styling Rules
- Tailwind CSS only — no inline styles
- No CSS modules unless absolutely necessary
- Custom CSS in globals.css only for base styles
- Use cn() utility for conditional classes
- Responsive classes mobile-first (sm: md: lg: xl:)

## State Management
- Local state: useState for component-level
- Server state: React Query for all API data
- Global UI state: Zustand stores
- Form state: React Hook Form
- Never put server data in Zustand

## API Integration
- All API calls in /services folder
- Use React Query useQuery / useMutation
- Loading, error, success states always handled
- Optimistic updates for better UX
- Error boundaries around major sections

## Performance
- Dynamic imports for heavy components
- next/image for all images
- next/font for all fonts
- Code split by route automatically (App Router)
- Memoize expensive computations (useMemo, useCallback)
- Virtualize long lists (react-virtual)

## Forms
- React Hook Form for all forms
- Zod schema validation
- Show inline field errors
- Disable submit button while submitting
- Success/error feedback after submission
- Never submit on Enter unless it is a search field
