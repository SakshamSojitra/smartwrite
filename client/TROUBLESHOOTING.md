# AnimatedGenerateButton – Troubleshooting

## Common Errors & Fixes

### 1. `styled-jsx` / "Unknown tag: style" error

**Cause:** The original component uses `<style jsx>`, which Vite does not support.

**Fix:** This project uses a **separate CSS file** instead of styled-jsx:
- `animated-generate-button.tsx` imports `./animated-generate-button.css`
- Do **not** use `<style jsx>` in the component

---

### 2. `Cannot find module 'clsx'`

**Fix:** Install dependencies:
```bash
cd client
npm install
```
Or install only clsx:
```bash
npm install clsx
```

---

### 3. `Cannot find module '@/components/ui/...'`

**Cause:** Path alias `@` is not resolving.

**Fix:** Ensure `vite.config.ts` has:
```ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
```
And `tsconfig.json` has:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

---

### 4. `--background`, `--foreground`, `--border` undefined

**Cause:** shadcn-style CSS variables are missing.

**Fix:** Ensure `src/index.css` has:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
}
```

---

### 5. Button appears unstyled / no animations

**Cause:** CSS file not loading or `--highlight-hue` not set.

**Fix:**
- Confirm `animated-generate-button.css` exists and is imported in the component
- `highlightHueDeg` must be 0–360 (e.g. 210 for blue)

---

### 6. TypeScript / build errors

**Fix:** Install all dev dependencies:
```bash
npm install
```

---

## Verify setup

```bash
cd "d:\College\Free Time\smartwrite\client"
npm install
npm run dev
```

Open http://localhost:3000 – the "Check Grammar" button should show the animated style.
