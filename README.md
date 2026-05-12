# my-app

A modern Next.js web application with Supabase authentication and Tailwind CSS styling.

## ✨ Features

- Landing page with hero section
- User signup and login authentication powered by Supabase
- User dashboard
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- TypeScript for type safety

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI**: React, Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Authentication**: Supabase
- **Language**: TypeScript

## 🚀 Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/) installed on your machine
- A code editor — we recommend [VS Code](https://code.visualstudio.com/) with the Tailwind CSS IntelliSense extension
- [Git](https://git-scm.com/) installed

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/my-app.git
cd my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a new file named `.env.local` in the root of your project (next to `package.json`).

```bash
touch .env.local
```

Open `.env.local` in your code editor and add the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> 💡 **What is an environment variable?** It's a secret value that your app needs to work, stored safely on your computer. Never share these or commit `.env.local` to GitHub.

#### How to get your Supabase credentials:

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Click **Project Settings** (the gear icon) in the left sidebar
4. Click **API** in the settings menu
5. Copy the **Project URL** and paste it as `NEXT_PUBLIC_SUPABASE_URL`
6. Copy the **anon/public** key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> 💡 **VS Code tip**: Open the integrated terminal with `Ctrl+`` (Windows/Linux) or `Cmd+`` (Mac), then run the commands above.

## 🔑 Environment Variables

| Variable | Required | Where to find it | Description |
|----------|----------|------------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Dashboard → Project Settings → API → Project URL | Your Supabase project endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Dashboard → Project Settings → API → anon/public key | Public key for client-side authentication |

## 📁 Project Structure

- `src/app` — Next.js App Router pages and layouts
- `src/app/signup` — User signup page
- `src/app/login` — User login page
- `src/app/dashboard` — User dashboard page
- `src/components/auth` — Authentication form components (login, signup)
- `src/lib/supabase` — Supabase client utilities
- `src/middleware.ts` — Supabase authentication middleware

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Step by step:

1. Click the **Deploy with Vercel** button above
2. Import your GitHub repository
3. Add all environment variables in Vercel dashboard:
   - Go to your project → **Settings** → **Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL` with your Supabase Project URL
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your Supabase anon key
4. Click **Deploy**

Your app will be live at a Vercel-provided URL (e.g., `your-app.vercel.app`).

> 💡 **Important**: Make sure to add all environment variables before deploying. If you forget, go to **Settings → Environment Variables**, add them, and click **Redeploy**.

## 📝 License

MIT