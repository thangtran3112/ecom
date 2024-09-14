# Shopping Website for Fashion with MERN stacks

## Installation

- Following [Vite Tailwind guide](https://tailwindcss.com/docs/guides/vite). See belows:

```bash
  npm create vite@latest
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
```

- Add `content` to `tailwind.config.js`:

```js
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
```

- Add tailwind directives to `index.css`:

```index.css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
```
