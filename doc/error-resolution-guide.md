# Error Resolution Guide

Dit document biedt een complete gids voor het oplossen van build errors in dit React 19 + Vite project.

## Quick Fix Commands

```bash
# Run deze commando's in volgorde:
pnpm build          # Check voor build errors
pnpm lint           # Check voor linting errors
pnpm run lint:css   # Check voor SCSS/CSS errors
```

## Meest Voorkomende Errors en Oplossingen

### 1. JavaScript Syntax Errors

#### Error: "Return statement is not allowed here"
**Oorzaak:** Uncommented code binnen gecommenteerde functies

**Oplossing:**
```javascript
// VERKEERD:
// UNUSED: export function myFunction() {
    return "some value"; // Deze regel veroorzaakt een error!
// }

// CORRECT:
// UNUSED: export function myFunction() {
//     return "some value";
// }
```

#### Error: "Failed to parse source for import analysis"
**Oorzaak:** Ongeldige JavaScript syntax in ES modules

**Veelvoorkomende oorzaken:**
- Uncommented code in gecommenteerde functies
- Missing function declarations
- Incorrect import/export statements

### 2. React Testing Library Setup

#### Modern Testing Setup (2025)

**Installatie:**
```bash
# Basis testing libraries
pnpm add --save-dev @testing-library/react @testing-library/dom
pnpm add --save-dev @testing-library/user-event @testing-library/jest-dom

# Voor Vitest (modern Jest alternative)
pnpm add --save-dev vitest @vitest/browser @vitest/coverage-v8
```

**Vitest Configuration (vitest.config.js):**
```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
```

**Setup File (src/test/setup.js):**
```javascript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
```

**Modern Test Example:**
```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', async () => {
    // ARRANGE
    render(<MyComponent />)

    // ACT
    await userEvent.click(screen.getByText('Click me'))

    // ASSERT
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

#### Browser Testing Setup
```javascript
// vitest.config.js - Browser mode
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
    },
  },
})
```

### 3. SCSS/CSS Errors

#### DEPRECATION WARNING: Sass @import rules are deprecated

**Oorzaak:** Oude @import syntax in SCSS bestanden

**Oplossing:** Vervang @import met @use/@forward
```scss
// VERKEERD:
@import '../../../styles/variables';
@import '../../../styles/mixins';

// CORRECT:
@use '../../../styles/variables' as vars;
@use '../../../styles/mixins' as mix;

// Gebruik dan:
color: vars.$primary-color;
@include mix.button-style;
```

### 4. Function Comment Patterns

#### Problematische Patronen
```javascript
// Dit veroorzaakt build errors:
// UNUSED: export function myFunction() {
    const result = "active code here"; // ERROR!
    return result;
// }
```

#### Correcte Patronen
```javascript
// Volledig uitcommentaren:
// UNUSED: export function myFunction() {
//     const result = "all code commented";
//     return result;
// }

// Of volledig verwijderen:
// (Functie definitie helemaal weglaten)
```

### 5. Environment Variables

#### Supabase Configuration Errors
**Error:** Supabase URL of Anon Key ontbreekt

**Oplossing:** Maak `.env` bestand in project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Validatie in code:**
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}
```

## Testing Best Practices (2025)

### 1. Arrange-Act-Assert Pattern
```javascript
test('user can submit form', async () => {
  // ARRANGE
  render(<ContactForm onSubmit={mockSubmit} />)

  // ACT
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  // ASSERT
  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com'
  })
})
```

### 2. Modern Async Testing
```javascript
// Gebruik await voor alle user interactions
await userEvent.click(button)
await userEvent.type(input, 'text')

// Wacht op async updates
await screen.findByText('Updated content')

// Voor elementen die mogelijk verdwijnen
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'))
```

### 3. Accessibility-First Testing
```javascript
// Gebruik roles in plaats van classes/ids
screen.getByRole('button', { name: /submit/i })
screen.getByRole('heading', { level: 1 })
screen.getByRole('textbox', { name: /email address/i })

// Test voor accessibility
expect(screen.getByRole('button')).toBeEnabled()
expect(screen.getByRole('form')).toHaveFormValues({
  email: 'test@example.com'
})
```

## Debuggen van Build Errors

### Stap 1: Identificeer Error Type
```bash
pnpm build 2>&1 | grep -E "(error|Error|ERROR)"
```

### Stap 2: Check Specifieke Bestanden
Voor syntax errors, check de vermelde regelnummers:
```bash
# Voor lijn 186 in poemService.js
head -n 190 src/services/api/poemService.js | tail -n 10
```

### Stap 3: Common Fixes Toepassen
1. Check voor uncommented code in commented functions
2. Verificeer alle imports/exports
3. Valideer function declarations
4. Check voor missing closing braces

## Preventie van Errors

### 1. ESLint Configuration
```javascript
// eslint.config.js
export default [
  {
    rules: {
      'no-unused-vars': 'error',
      'no-unreachable': 'error',
      'no-console': 'warn',
    }
  }
]
```

### 2. Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm lint && pnpm build"
    }
  }
}
```

### 3. TypeScript voor Type Safety
```javascript
// Voor betere error detection
pnpm add --save-dev typescript @types/react @types/react-dom
```

## Performance Testing

### 1. Component Performance
```javascript
import { renderHook } from '@testing-library/react'

test('hook performance', () => {
  const { result, rerender } = renderHook(() => useExpensiveHook())

  expect(result.current).toBeDefined()

  // Test re-renders
  rerender()
  expect(result.current).toBeStable()
})
```

### 2. Memory Leaks Detection
```javascript
afterEach(() => {
  cleanup() // Belangrijk voor memory cleanup
})
```

## Conclusie

Deze gids behandelt de meest voorkomende build en test errors in moderne React applicaties. Voor specifieke errors die niet hier vermeld staan, check:

1. Browser developer console
2. Network tab voor API errors
3. Vite/Rollup build output
4. ESLint output

**Belangrijk:** Werk altijd in kleine stappen en test regelmatig met `pnpm build` om errors vroeg te vangen.