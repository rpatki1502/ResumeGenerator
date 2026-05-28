# Modern UI/UX Standards

## Design Philosophy
- Every page must feel like a 2025-2026 premium product
- Inspired by: Linear, Vercel, Stripe, Apple, Raycast
- Dark mode first, light mode optional
- Glassmorphism, subtle gradients, depth layers
- Never looks "AI generated" or generic
- Always feels intentional and crafted

## Typography
- Use Inter or Geist font (import from Google Fonts or next/font)
- Large bold headings: text-5xl or larger on desktop
- Generous whitespace — never cramped
- Letter spacing on headings: tracking-tight
- Line height on body text: leading-relaxed
- Font weights: 400 body, 500 medium, 600 semibold, 700+ headings

## Colors
- Never use plain white (#ffffff) or pure black (#000000) backgrounds
- Dark mode base: #0a0a0a → #111111 gradient
- Light mode base: #fafafa with subtle warm tint
- Accent colors always have opacity variants (10%, 20%, 50%, 100%)
- Brand color palette: primary, secondary, accent, muted
- Use CSS custom properties for all colors

## Components
- Cards: rounded-2xl with subtle border (border-white/10) + drop shadow
- Buttons: gradient fills, hover scale transform (scale-105)
- Inputs: floating labels, focus ring with brand color glow
- Always add hover states to everything clickable
- Badges: pill shape with subtle background tint
- Dividers: use gradients not solid lines (opacity fades at edges)

## Spacing & Layout
- Sections: minimum py-24 on desktop, py-16 on mobile
- Never cramped — when in doubt add more space
- Mobile padding: px-6
- Desktop container: px-8 max-w-7xl mx-auto
- Grid gaps: gap-6 minimum, gap-8 preferred
- Stack gaps: space-y-4 minimum

## Responsive Design
- Mobile first — design mobile layout first
- Breakpoints: sm(640) md(768) lg(1024) xl(1280) 2xl(1536)
- Test at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1440px (Desktop)
- Touch targets minimum 44x44px on mobile
- No horizontal scroll on any screen size

## Images & Media
- Always lazy load images (loading="lazy" or Next.js Image component)
- Use next/image for all images in Next.js projects
- Aspect ratios locked to prevent layout shift
- Always provide alt text
- Use WebP format where possible

## Accessibility
- Color contrast ratio minimum 4.5:1 for text
- All interactive elements keyboard navigable
- Focus indicators always visible
- ARIA labels on icon-only buttons
- Semantic HTML (nav, main, section, article, aside)
