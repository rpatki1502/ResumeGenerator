# Motion, Animations & 3D Graphics

## Philosophy
- Every meaningful interaction must have motion feedback
- Animations should feel natural, not distracting
- Performance first — always 60fps minimum
- Respect prefers-reduced-motion accessibility setting

## Libraries to Use
- framer-motion — primary animation library for all React animations
- @react-three/fiber + @react-three/drei — 3D scenes in React
- three.js — raw 3D when needed outside React
- lottie-react — micro-animations and animated icons
- react-spring — physics-based animations (bouncy, natural feel)
- react-parallax-tilt — card tilt hover effects
- gsap — complex timeline animations and scroll-triggered effects

## Page & Component Animations — Always Include

### Page Load
```
Initial state: opacity 0, y: 20
Animate to: opacity 1, y: 0
Duration: 0.4s ease-out
Stagger children: 0.1s delay each
```

### Scroll Animations
- Elements animate in as user scrolls into view
- Use framer-motion viewport: { once: true }
- Fade + slide up is default scroll animation
- Stagger list items with 0.05-0.1s delays

### Hover States — Mandatory
- Cards: subtle lift (y: -4) + shadow increase
- Buttons: scale(1.02-1.05) + brightness increase
- Links: underline slide-in from left
- Icons: rotate or scale on hover
- Images: subtle zoom (scale 1.05) inside container

### Page Transitions
- Smooth route changes using framer-motion AnimatePresence
- Exit: fade out + slide up (0.2s)
- Enter: fade in + slide up (0.3s)

## Loading States — Never Show Blank
- Skeleton loaders for all content that loads async
- Skeleton must match shape of actual content
- Pulse animation on skeletons
- Spinner only for button loading states (not page loads)

## 3D & Visual Effects

### Hero Sections
- Animated gradient background (shifting colors slowly)
- Floating 3D object or particle system
- Subtle mesh gradient or noise texture overlay
- Canvas-based particle field for tech/SaaS feel

### 3D Scenes (@react-three/fiber)
- Lazy load ALL Three.js components (dynamic import)
- Use Suspense with skeleton fallback
- OrbitControls for interactive 3D objects
- Environment lighting from @react-three/drei

### Gradient Animations
- CSS @keyframes for moving gradient backgrounds
- Subtle hue rotation on brand gradients
- Aurora/mesh gradient for hero sections

### Specific Patterns
- Hero: animated gradient + floating 3D object or particles
- Cards: react-parallax-tilt on hover
- Stats/Numbers: count-up animation when scrolled into view
- Buttons: shimmer sweep effect on hover (pseudo-element animation)
- Background: subtle moving gradient mesh or particle field
- Progress bars: animate width on mount

## Performance Rules — Non-Negotiable
- All animations respect prefers-reduced-motion
- 3D scenes must stay above 60fps
- Lazy load ALL Three.js and Lottie components
- Use CSS transforms only — never animate layout properties (width, height, top, left)
- Use will-change: transform sparingly and only on animating elements
- Debounce scroll event listeners
- Use requestAnimationFrame for custom animations

## Installation Commands
```bash
npm install framer-motion
npm install @react-three/fiber @react-three/drei three
npm install lottie-react
npm install react-spring
npm install react-parallax-tilt
npm install gsap
```
