# AI CABY Dark/Light Mode Color Matching Strategy

## Current Color Inconsistencies Analysis

### Component-Specific Colors

#### Dashboard
- Background: `zinc-900`
- Surface: `zinc-800`
- Text: `text-white`

#### Auth Pages
- Text: `gray-700`
- Borders: `gray-300`
- Background: `white`

#### Input Components
- Border: `gray-300`
- Text: `gray-700`
- No dark mode support currently

## Potential Issues and Challenges

1. **Direct Color Inversions**
   - Simple inversions (e.g., `gray-300` → `gray-700`) don't maintain proper contrast
   - Can lead to accessibility issues
   - May create unexpected visual hierarchies

2. **Absolute Color Usage**
   - Components using `white` and `black` directly
   - No semantic meaning in color choices
   - Difficult to maintain consistency

3. **Interactive Elements**
   - Buttons and inputs require special attention
   - Need to maintain proper contrast in both modes
   - Focus and hover states must be visible

## Solution: Semantic Color System

### Base Color Definition
```typescript
// src/theme/colors.ts
export const semanticColors = {
  light: {
    background: 'bg-white',
    surface: 'bg-zinc-50',
    surfaceHover: 'hover:bg-zinc-100',
    text: {
      primary: 'text-zinc-900',
      secondary: 'text-zinc-600',
    },
    border: 'border-zinc-200',
    input: {
      background: 'bg-white',
      border: 'border-zinc-300',
      focus: 'focus:ring-yellow-500/20',
    }
  },
  dark: {
    background: 'bg-zinc-900',
    surface: 'bg-zinc-800',
    surfaceHover: 'hover:bg-zinc-700',
    text: {
      primary: 'text-white',
      secondary: 'text-zinc-400',
    },
    border: 'border-zinc-700',
    input: {
      background: 'bg-zinc-800',
      border: 'border-zinc-700',
      focus: 'focus:ring-yellow-500/20',
    }
  }
};
```

### Component Implementation Example

#### Input Component
```typescript
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-900 dark:text-white">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
            bg-white dark:bg-zinc-800
            border-zinc-300 dark:border-zinc-700
            text-zinc-900 dark:text-white
            ${error 
              ? 'border-red-500 focus:ring-red-200' 
              : 'focus:ring-yellow-500/20 focus:border-yellow-500'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
```

### Common UI Patterns
```typescript
const commonPatterns = {
  card: 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm',
  button: {
    primary: 'bg-yellow-500 text-white hover:bg-yellow-600',
    secondary: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'
  },
  input: 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white',
  text: {
    heading: 'text-zinc-900 dark:text-white font-bold',
    body: 'text-zinc-600 dark:text-zinc-400',
    link: 'text-yellow-500 hover:text-yellow-600'
  }
};
```

### Smooth Transitions
```typescript
// Add to root layout for smooth mode switching
<div className="transition-colors duration-200">
  {/* content */}
</div>
```

## Key Principles

1. **Semantic Color Naming**
   - Use descriptive names that reflect purpose
   - Avoid direct color references
   - Make color intentions clear

2. **Contrast Ratio Maintenance**
   - Ensure WCAG compliance
   - Test text readability
   - Verify component boundaries

3. **Consistent Accent Colors**
   - Keep `yellow-500` as primary accent
   - Maintain brand identity across modes
   - Use for interactive elements

4. **Complementary Shade Mapping**
   - Light mode: `zinc-100` → Dark mode: `zinc-800`
   - Light mode: `white` → Dark mode: `zinc-900`
   - Light mode: `zinc-200` → Dark mode: `zinc-700`

5. **Interactive State Testing**
   - Hover states
   - Focus indicators
   - Active/pressed states
   - Error states
   - Disabled states

## Implementation Checklist

- [ ] Replace absolute colors with semantic colors
- [ ] Update component styles with dark mode variants
- [ ] Test all interactive states
- [ ] Verify contrast ratios
- [ ] Add smooth transitions
- [ ] Test in both modes
- [ ] Validate accessibility

## Color Mapping Reference

| Purpose          | Light Mode  | Dark Mode   |
|-----------------|-------------|-------------|
| Background      | white       | zinc-900    |
| Surface         | zinc-50     | zinc-800    |
| Border          | zinc-200    | zinc-700    |
| Text Primary    | zinc-900    | white       |
| Text Secondary  | zinc-600    | zinc-400    |
| Hover Surface   | zinc-100    | zinc-700    |
| Input Border    | zinc-300    | zinc-700    |
| Accent          | yellow-500  | yellow-500  |
