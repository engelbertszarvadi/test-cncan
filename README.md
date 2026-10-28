# Test CNCAN - MRIVX_M

Mobile-first PWA for practicing the CNCAN MRIVX_M exam questions. React + Vite + shadcn/ui, no backend.

## Development

```sh
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push this project to a GitHub repo, on the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `dist/`.

The app uses relative asset paths and hash URLs (`/#/all`), so it works under any repo name and works offline once loaded.
