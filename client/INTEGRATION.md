# AnimatedGenerateButton Integration

## Setup Complete

The SmartWrite project now supports:

- **shadcn project structure** – Components live in `src/components/ui/`
- **Tailwind CSS** – Configured via `tailwind.config.js` and `postcss.config.js`
- **TypeScript** – Configured via `tsconfig.json` and path alias `@/*` → `./src/*`

## Component Location

```
src/components/ui/
├── animated-generate-button.tsx
└── animated-generate-button.css
```

The `/components/ui` folder is the standard location for shadcn primitives and shared UI components. This keeps reusable UI separate from feature-specific components.

## Dependencies Installed

```bash
npm install clsx
npm install -D tailwindcss postcss autoprefixer typescript @types/react @types/react-dom
```

## How to Run

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Start the backend** (in a separate terminal):
   ```bash
   cd server
   npm run dev
   ```

3. **Start the frontend:**
   ```bash
   cd client
   npm run dev
   ```

4. Open **http://localhost:3000**

## AnimatedGenerateButton Usage

The "Check Grammar" button now uses `AnimatedGenerateButton`:

```tsx
<AnimatedGenerateButton
  labelIdle="Check Grammar"
  labelActive="Checking..."
  generating={loading}
  disabled={loading}
  onClick={checkGrammar}
  highlightHueDeg={210}
  ariaLabel={loading ? "Checking grammar" : "Check grammar"}
/>
```

Props: `labelIdle`, `labelActive`, `generating`, `highlightHueDeg`, `onClick`, `disabled`, etc.

## CSS Variables (shadcn-style)

The button uses these HSL variables in `:root`:

- `--background`
- `--foreground`
- `--border`

Defined in `src/index.css`.

## Note on styled-jsx

The original component used `styled-jsx`. Vite does not support it by default, so the styles were moved to `animated-generate-button.css` and imported in the component.
