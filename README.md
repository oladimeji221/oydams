# Oydams Confectionery

A Vue 3 storefront with a WhatsApp checkout, Supabase product management and Cloudinary image uploads.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

The shop works immediately with starter products. Before publishing, set `VITE_WHATSAPP_NUMBER` in `.env` using the international format without `+` or spaces (for example `2348012345678`).

## Enable the admin dashboard

1. Create a Supabase project and run `supabase/schema.sql` in its SQL editor.
2. In Supabase Authentication, create the owner account under Users.
3. Add the project URL and anon key to `.env`.
4. In Cloudinary, create an unsigned upload preset and add its name and your cloud name to `.env`.
5. Restart the development server and visit `/admin`.

For production, restrict admin access further by adding an `admin_users` table or a custom role rather than allowing every authenticated account to edit products.

Never place the Cloudinary API secret in a `VITE_` variable. Vue environment variables are visible to visitors. Use an unsigned upload preset for browser uploads, or keep signed uploads in a secure server or Supabase Edge Function.

Never add the Cloudinary API secret to a `VITE_` variable or commit it to this project. Vue variables are visible to every visitor. Use an unsigned upload preset for this dashboard, or move signed uploads into a Supabase Edge Function.
