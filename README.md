# 🎤 Interview Tester (AI-Powered)

An AI-driven web app to **practice interview questions**, get **structured feedback**, and even answer using your **voice**.  
Built with **Next.js, Prisma, Tailwind, shadcn/ui, and OpenAI APIs**.

---

## ✨ Features
- ✅ Answer **common interview questions**
- ✅ Get **AI-powered scores (0–100)** and written feedback
- ✅ Track multiple attempts per question
- ✅ Use your **microphone** to record answers (voice → text via Whisper)
- ✅ Modern UI with TailwindCSS + shadcn components
- ✅ SQLite database with Prisma ORM

---

## 🛠 Tech Stack
- **Frontend:** Next.js 15 + React
- **UI:** TailwindCSS + shadcn/ui
- **Database:** Prisma + SQLite
- **AI:** OpenAI GPT-4o-mini for scoring & feedback
- **Speech-to-Text:** OpenAI Whisper

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/interview-tester.git
cd interview-tester
```

### 2. Install dependencies
```bash
pnpm install
# or
npm install
```

### 3. Setup database
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Add environment variables
Create a file named **.env.local** in the project root:
```ini
OPENAI_API_KEY=sk-...your_openai_key_here
```
⚠️ Never commit this file!

### 5. Run the app
```bash
pnpm dev
```
Then open 👉 [http://localhost:3000](http://localhost:3000)
