# Gidy - Next-Gen Developer Profile Platform 🚀

**🌍 Live Demo:** [https://gidy-ai-plum.vercel.app/](https://gidy-ai-plum.vercel.app/)

Gidy is a modern, stylish, and highly interactive developer portfolio platform built with Next.js. It allows developers to showcase their skills, experience, projects, and certifications through an elegant, customizable, and shareable public profile. 

Built with performance and aesthetics in mind, Gidy acts as a "link-in-bio" on steroids specifically tailored for engineers, complete with dynamic themes, AI-powered bio generation, and real-time skill endorsements.

---

## 🌟 Key Features

### 🧑‍💻 Comprehensive Profile Editing
- **Beautiful Glassmorphic UI:** A sleek, dark-mode first design with smooth micro-animations.
- **Dynamic Theming:** Seamless one-click transitions between light and dark modes with a futuristic ripple animation.
- **Media Uploads:** Native integration with **Vercel Blob** for instant, reliable profile picture, cover banner, and PDF resume hosting.
- **AI Bio Generator:** Instantly generate professional, personalized bios using AI based on your profile context.

### 🔗 Shareable Public URL
- **Custom Slugs:** Claim your unique username (e.g., `gidy.io/u/vsdharshan`).
- **Read-Only View:** A stunning, read-only public version of your profile designed to impress recruiters and peers.
- **Dual View Modes:** Seamlessly switch between the private "Edit View" (where you manage your data) and the "Public View" to see exactly what others see.
- **1-Click Sharing:** Built-in sharing tools to instantly copy your link or share directly to X (Twitter) and LinkedIn.

### 📊 Developer Identity & Stats
- **Gamified Identity:** Display your "League", Rank Points, and Career Vision (e.g., "Technical Founder").
- **Skill Radar:** A dynamic radar chart mathematically visualizing your technical skill distribution.
- **Profile Power Dynamics:** Real-time calculation of your profile's strength and completeness based on your achievements.
- **Skill Endorsements:** Friends or colleagues can endorse your skills, tracked visually in the UI.
- **Timeline rendering:** Beautifully structured timelines for Experienc and Education.

### 🛠 Tech Stack
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Frontend library:** [React 19](https://react.dev/)
- **Styling:** Vanilla CSS Modules with rich CSS variables, cubic-bezier transitions, and glassmorphic elements.
- **Database ORM:** [Prisma 6](https://www.prisma.io/)
- **Database:** PostgreSQL (Hosted on Neon)
- **File Storage:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Icons:** Custom SVG library (Lucide-inspired)
- **Charts/Visuals:** Recharts

---

## 🚀 Getting Started & Usage

### Prerequisites
Make sure you have Node.js (v18+) installed.

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/gidy-profile.git
cd gidy-profile
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following keys:

```env
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"

# AI Generation (Cerebras, OpenAI, etc.)
CEREBRAS_API_KEY="your_api_key_here"

# Vercel Blob (For image/resume uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_your_token_here"
```

### 3. Database Setup (Prisma)
Initialize the database and seed the default profile:
```bash
# Push the schema to the database
npx prisma db push

# Seed initial data
npm run seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment to Vercel

Gidy is optimized for zero-config Vercel deployment:
1. Push your repository to GitHub.
2. Import the project in the Vercel Dashboard.
3. Add the `DATABASE_URL` and `CEREBRAS_API_KEY` to Vercel Environment Variables.
4. Go to the **Storage** tab in Vercel, create a **Public Blob Database**, and attach it to the project (this automatically handles the `BLOB_READ_WRITE_TOKEN`).
5. Click **Deploy**.

---

*Designed and engineered for the next generation of builders.*
