# Animations & Loading States

This document describes the animations and loading states implemented in the Global Salary Calculator.

## Overview

The calculator uses **Framer Motion** for smooth, performant animations that enhance the user experience without compromising functionality.

## Animation Features

### 1. **Mode Selector Animations**
- **Staggered entrance**: Buttons appear sequentially with a stagger effect
- **Hover effect**: Buttons scale up (1.05x) on hover
- **Tap effect**: Buttons scale down (0.95x) when clicked
- **Active state**: Selected button has a shadow and different color

### 2. **Input Section Animations**
- **Fade-in from bottom**: Input section slides up and fades in
- **Smooth transitions**: All input fields have smooth focus transitions
- **Collapsible field**: "Hours per Week" field animates in/out based on mode selection
- **Disabled state**: Inputs are disabled during calculation

### 3. **Button Loading States**
- **Calculate Button**:
  - **Idle state**: Blue background with Calculator icon
  - **Loading state**:
    - Changes to lighter blue
    - Shows spinning Loader icon (animated)
    - Text changes to "Calculating..."
    - Button is disabled and cursor changes to not-allowed
  - **Hover/Tap**: Scale animations (only when not loading)

### 4. **Skeleton Loader**
When calculation starts, a skeleton loader appears showing:
- **3 pulsing cards** for summary results
- **Pulsing table** for frequency breakdown
- **Pulsing circle** for chart placeholder
- **Breathing animation**: Opacity pulses (0.6 → 1 → 0.6)
- **Staggered delays**: Each element has a slight delay

### 5. **Results Animations**

#### Summary Cards (3 colored cards)
- **Entrance**: Each card:
  - Fades in (opacity 0 → 1)
  - Slides up (y: 20 → 0)
  - Scales up (scale: 0.9 → 1)
  - Staggered delays (0s, 0.1s, 0.2s)
  - Spring animation for bounce effect
- **Currency values**: Numbers have an additional scale animation
- **Hover effect**: Cards scale up (1.05x) and lift up (y: -5px)

#### Frequency Breakdown Table
- **Table entrance**: Fades in and slides up (delay: 0.4s)
- **Row animations**: Each row:
  - Slides in from left (x: -20 → 0)
  - Fades in (opacity 0 → 1)
  - Sequential delays (0.5s, 0.55s, 0.6s, 0.65s, 0.7s)

#### Tax Breakdown Chart
- **Entrance**: Fades in and slides up (delay: 0.6s)
- Chart itself uses Recharts animations

#### Detailed Breakdown
- **Container**: Fades in and slides up (delay: 0.7s)
- **Each row**:
  - Slides in from left with fade
  - Sequential delays (0.8s + index * 0.05s)
  - **Hover effect**: Slides right 5px with background color change
- **Color indicators**:
  - **Hover effect**: Scale up (1.3x) and rotate (180deg)
  - Spring animation for playful effect

### 6. **Transition Behavior**
- **AnimatePresence**: Smooth transitions when results appear/disappear
- **Mode switching**: Smooth appearance/disappearance
- **Exit animations**: Elements fade out when removed

## Animation Timing

```
Initial Load:
├─ Mode Buttons: 0s, 0.1s, 0.2s (staggered)
├─ Input Section: 0.2s
└─ Input Label: 0.3s

Calculation Start:
└─ Skeleton Loader: 0s (immediate)

Results Appear:
├─ Summary Cards: 0s, 0.1s, 0.2s
│   └─ Currency values: +0.2s per card
├─ Frequency Table: 0.4s
│   └─ Rows: 0.5s, 0.55s, 0.6s, 0.65s, 0.7s
├─ Chart: 0.6s
└─ Detailed Breakdown: 0.7s
    └─ Rows: 0.8s, 0.85s, 0.9s, ... (+0.05s per row)
```

## Performance Considerations

### Optimizations
1. **Hardware acceleration**: Animations use transform and opacity (GPU-accelerated)
2. **No layout thrashing**: Animations don't trigger reflows
3. **Efficient re-renders**: framer-motion optimizes component updates
4. **Conditional rendering**: Animations only run when needed
5. **Will-change**: Framer Motion automatically adds will-change hints

### Loading State
- **Optional delay**: 300ms delay for animation visibility
  - **Note**: Calculations are instant (client-side), delay is purely aesthetic
  - **To change**: Edit `ANIMATION_DELAY` in `SalaryCalculator.tsx` line 33
  - **Recommended values**:
    - `0` - Instant (no animations visible)
    - `150` - Quick feedback
    - `300` - Balanced (default)
    - `500+` - Slow, more dramatic

### Motion Reduction
Framer Motion respects `prefers-reduced-motion` system setting:
- Users with motion sensitivity see instant transitions
- No animation performance impact for these users

## Customization

### Adjusting Animation Speed
Edit durations in `SalaryCalculator.tsx`:

```typescript
// Make animations faster
transition={{ duration: 0.2 }} // was 0.3

// Make animations slower
transition={{ duration: 0.5 }} // was 0.3
```

### Changing Spring Animations
```typescript
// Bouncier
transition={{ type: 'spring', stiffness: 200 }} // was 100

// Less bouncy
transition={{ type: 'spring', stiffness: 50 }}

// No bounce (ease)
transition={{ duration: 0.3 }} // remove spring
```

### Disabling Specific Animations
Comment out or remove the `motion.` prefix and animation props:

```typescript
// Before (animated)
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>

// After (no animation)
<div>
```

### Removing Calculation Delay
In `SalaryCalculator.tsx`, line ~32:

```typescript
// Remove this line for instant calculations
await new Promise(resolve => setTimeout(resolve, 600));
```

## Dependencies

- **framer-motion**: ^11.x
  - Peer dependencies: react, react-dom
  - Bundle size impact: ~35KB gzipped

## Browser Support

Framer Motion supports:
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: iOS 12+
- Chrome Android: Latest

## Accessibility

All animations maintain accessibility:
- **Keyboard navigation**: All interactive elements remain keyboard accessible
- **Focus indicators**: Maintained during animations
- **Screen readers**: Animations don't interfere with ARIA labels
- **Motion preferences**: Respects `prefers-reduced-motion`

## Future Enhancements

Potential animation improvements:
1. **Number counter animation**: Animate numbers counting up
2. **Chart entrance**: Animate pie chart segments drawing
3. **Confetti effect**: Celebration animation on first calculation
4. **Drag to compare**: Swipe between calculation results
5. **Haptic feedback**: Vibration on mobile for button clicks
