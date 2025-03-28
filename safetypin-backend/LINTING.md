# ESLint Guide for SafetyPin Backend

This guide will help you understand and fix the ESLint errors in the SafetyPin backend codebase.

## Running ESLint

```bash
# Run ESLint
npm run lint

# Run ESLint with auto-fix for simple issues
npm run lint -- --fix

# Allow warnings but fail on errors
npm run lint -- --max-warnings=9999

# Run the auto-fix script for more complex issues
node fix-lint.js
```

## Common ESLint Errors and How to Fix Them

### 1. Unused Variables (`@typescript-eslint/no-unused-vars`)

**Example Error:**
```
'server' is assigned a value but never used
```

**How to fix:**
- If you need the variable later, prefix it with underscore: `_server`
- If you don't need it, remove it entirely

```typescript
// Before
const server = app.listen(port);

// After
const _server = app.listen(port);
// or
app.listen(port);
```

### 2. Using `any` Type (`@typescript-eslint/no-explicit-any`)

**Example Error:**
```
Unexpected any. Specify a different type
```

**How to fix:**
- Replace `any` with a more specific type
- If the exact type is unknown, use generics or `unknown`

```typescript
// Before
function process(data: any): any {
  return data;
}

// After
function process<T>(data: T): T {
  return data;
}

// Or for objects with unknown structure
function process(data: Record<string, unknown>): Record<string, unknown> {
  return data;
}
```

### 3. Non-null Assertions (`@typescript-eslint/no-non-null-assertion`)

**Example Error:**
```
Forbidden non-null assertion
```

**How to fix:**
- Use a conditional check instead
- Or use nullish coalescing operator (??)

```typescript
// Before
const value = obj.getValue()!;

// After
const value = obj.getValue() ?? defaultValue;
// or
const rawValue = obj.getValue();
if (rawValue === null || rawValue === undefined) {
  throw new Error('Value cannot be null');
}
const value = rawValue;
```

### 4. Trivial Type Inference (`@typescript-eslint/no-inferrable-types`)

**Example Error:**
```
Type number trivially inferred from a number literal, remove type annotation
```

**How to fix:**
- Remove redundant type annotations

```typescript
// Before
const count: number = 5;

// After
const count = 5;
```

### 5. Console Statements (`no-console`)

**Example Error:**
```
Unexpected console statement
```

**How to fix:**
- Replace with a proper logging system
- Or add specific ESLint disable comments for cases where console.log is acceptable

```typescript
// Before
console.log('Server started');

// After
logger.info('Server started');

// Or if console.log must be kept
// eslint-disable-next-line no-console
console.log('Server started');
```

### 6. Require Statement (`@typescript-eslint/no-var-requires`)

**Example Error:**
```
Require statement not part of import statement
```

**How to fix:**
- Use ES import instead

```typescript
// Before
const fs = require('fs');

// After
import * as fs from 'fs';
```

## Ignoring Rules for Specific Lines

Sometimes you may need to keep code that violates ESLint rules. You can disable rules for specific lines:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function legacyFunction(data: any): any {
  return data;
}
```

## Gradual Improvement Strategy

1. **Fix Automatically**: Run `npm run lint -- --fix` to fix easy issues
2. **Fix Critical Errors**: Address errors first, especially unused variables
3. **Address Warnings**: Gradually fix warnings as you work on the codebase
4. **Tighten Rules**: Once most issues are fixed, update `.eslintrc.js` to make rules stricter

## Customizing ESLint Rules

To modify or disable rules, edit `.eslintrc.js`:

```javascript
rules: {
  'rule-name': 'off', // disable a rule
  'another-rule': 'warn', // set to warning
  'third-rule': 'error', // set to error
  
  // Some rules have options
  'rule-with-options': ['error', { 
    option1: true, 
    option2: 'value' 
  }],
}
```

## Best Practices

1. **Run ESLint Regularly**: Check for issues as you work
2. **Fix Issues Early**: Addressing small issues early is easier than fixing many later
3. **Use Type System**: TypeScript types can prevent many runtime errors
4. **Document Exceptions**: If you must disable a rule, add a comment explaining why
