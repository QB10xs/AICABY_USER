# AI CABY Dark Mode Color Palette Documentation

## Overview
This document outlines the comprehensive color palette used in AI CABY's dark mode interface, detailing each color's usage, implementation, and accessibility considerations.

## 1. Primary Colors

### Brand Colors
```css
--taxi-yellow: #F7C948    /* Main brand color */
```
**Usage:**
- Logo text gradient
- Action buttons
- Interactive elements
- User message bubbles
- Gold member badge
- Quick action icons

### Base Dark
```css
--night-black: #2A2A2A    /* Base dark color */
```
**Usage:**
- Background gradient (from)
- Text on yellow backgrounds
- Dark UI elements

### Status Colors
```css
--success-green: #27AE60  /* Success states */
--error-red: #EB5757     /* Error states */
```
**Usage:**
- Success/Error messages
- Status indicators
- Recording button states
- Warning indicators

## 2. Glassmorphism Effects

### Glass Panels
```css
--glass-bg: rgba(42, 42, 42, 0.7)        /* Glass panels background */
```
**Usage:**
- Chat container
- Header
- Message input area
- Quick action cards

### Glass Borders & Shadows
```css
--glass-border: rgba(247, 201, 72, 0.2)  /* Glass borders */
--glass-shadow: 0 8px 32px rgba(247, 201, 72, 0.1)  /* Subtle glow */
```
**Usage:**
- Container borders
- Card borders
- Input field borders
- Hover effects
- Interactive elements

## 3. Gradient Colors

### Brand Gradients
```css
--yellow-gradient: linear-gradient(135deg, #F7C948 0%, #FFE17D 100%)
```
**Usage:**
- Brand text
- Primary buttons
- Highlight areas
- Important UI elements

### Background Gradients
```css
--dark-gradient: linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)
```
**Usage:**
- Page background
- Dark mode elements
- Secondary containers

## 4. Text Colors
```css
text-white: #FFFFFF          /* Primary text */
text-gray-400: #9CA3AF      /* Secondary text */
```
**Usage:**
- Main text content
- Headers
- Navigation items
- Placeholder text
- Timestamps
- Secondary information
- Disabled states

## 5. UI Element Colors
```css
bg-white/5: rgba(255, 255, 255, 0.05)   /* Subtle highlights */
bg-white/10: rgba(255, 255, 255, 0.1)   /* Light overlays */
```
**Usage:**
- Input backgrounds
- Inactive buttons
- Hover states
- Button hover states
- Active states
- Dividers

## 6. Interactive States
```css
hover:bg-yellow-400: #FBBF24   /* Hover state for yellow elements */
hover:text-taxi-yellow: #F7C948  /* Text hover state */
```
**Usage:**
- Button hover states
- Interactive elements
- Links
- Interactive text
- Icons hover

## 7. Scrollbar Colors
```css
scrollbar-track: rgba(255, 255, 255, 0.05)  /* Scrollbar track */
scrollbar-thumb: rgba(247, 201, 72, 0.3)    /* Scrollbar handle */
scrollbar-thumb-hover: rgba(247, 201, 72, 0.5)  /* Scrollbar handle hover */
```

## Color Count Summary
- Primary Colors: 4
- Glassmorphism Colors: 3
- Gradient Colors: 2 (using 4 color stops)
- Text Colors: 2
- UI Element Colors: 2
- Interactive States: 2
- Scrollbar Colors: 3
**Total Unique Colors: 16**

## Implementation Details

### 1. Configuration Files
Colors are defined in:
- `tailwind.config.js` for Tailwind usage
- `index.css` for global CSS variables
- Component-specific styles for unique cases

### 2. Accessibility Considerations
- All color combinations meet WCAG 2.1 contrast requirements
- Text on yellow backgrounds uses dark text for readability
- Light text on dark backgrounds for optimal contrast

### 3. Design Consistency
- Colors are applied consistently across components
- Interactive elements share the same color patterns
- Feedback states (success/error) use consistent colors

## Usage Guidelines

1. **Primary Actions**
   - Use `--taxi-yellow` for primary buttons and important actions
   - Apply yellow gradient for enhanced visual hierarchy

2. **Content Areas**
   - Use glassmorphism effects for content containers
   - Maintain consistent opacity levels for glass effects

3. **Text Hierarchy**
   - Use white for primary text
   - Use gray-400 for secondary information
   - Apply yellow for interactive text elements

4. **Interactive Elements**
   - Use hover states consistently
   - Maintain clear visual feedback for all interactive elements

5. **Status Indicators**
   - Use success-green and error-red sparingly
   - Reserve for important status updates and feedback

## Maintenance

This color system should be maintained and updated with the following considerations:
1. Any new colors should be added to this documentation
2. Color changes should be reviewed for accessibility
3. Maintain consistent implementation across components
4. Regular audit of color usage to ensure consistency 