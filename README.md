# my-app

A modern Next.js web application with Supabase authentication and Tailwind CSS styling.

## ✨ Features

- Real-time messaging with thread support
- Channel creation and management
- Direct messaging between users
- Interactive dashboard with sidebar navigation
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- TypeScript for type safety

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI**: React, Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Database/Auth**: Supabase
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

- `src/app/api/channels` — API route for channel operations
- `src/app/api/dms` — API route for direct message operations
- `src/app/api/messages` — API route for message operations
- `src/app/dashboard` — Main dashboard page
- `src/components/dashboard` — Dashboard UI components (sidebar, message thread, input, channel modal)
- `src/lib/types` — TypeScript type definitions
- `src/lib/utils` — Utility functions

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Step by step:

1. Push your code to GitHub (if not already done)
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project**
4. Import your repository
5. In **Environment Variables**, add each variable from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**

> 💡 **Important**: Make sure all environment variables are added in Vercel before deploying. Your app won't work without them.

## 📝 License

MIT