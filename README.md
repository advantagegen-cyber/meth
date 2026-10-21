# Meth Hub

Next.js 14 site with a public method grid and a hidden admin panel (press **Shift + F8**).
Methods and images are stored in Vercel Blob. The admin code is checked on the server.

## Deploy (GitHub + Vercel)

1. Push this folder to a GitHub repo (`.env*` files are git-ignored).
2. In Vercel: **Add New > Project**, import the repo, then deploy.
3. In the project: **Storage > Create > Blob** (public store) and connect it to the project.
   This adds `BLOB_READ_WRITE_TOKEN` automatically.
4. In **Settings > Environment Variables** add `ADMIN_CODE` with your admin code, then redeploy.
5. Open the site, press Shift + F8, enter the code, and add methods.

## Run locally

```
npm install
cp .env.example .env.local   # then fill in both values
npm run dev
```

## Files

- `public/index.html` the whole front end (design, popups, admin UI)
- `public/leaf.png` the logo
- `app/api/*` server routes: list, create, delete, admin login
- `lib/` code check and Blob storage helpers

Set `SHOW_PLACEHOLDERS` to `false` near the top of the script in `public/index.html` to hide the demo cards when no methods exist.
