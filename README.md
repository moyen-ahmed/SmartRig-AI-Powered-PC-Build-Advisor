# SmartRig: AI-Powered PC Build Advisor

SmartRig is an AI-driven web application that helps users design custom desktop PC builds based on their goals and budget. Whether you're building a workstation for AI model training, a gaming powerhouse, a video editing rig, or an office desktop, SmartRig recommends the best CPU, GPU, and motherboard combinations—complete with real-time prices and compatibility.

## 🚀 Features

- 🧠 AI-based recommendation engine optimized for different user goals
- 💸 Budget-aware suggestions with real-time price tracking
- 📊 Compatibility-checked parts (CPU, GPU, and motherboard)
- 🛍️ Live retailer links (Amazon, Newegg, BestBuy, etc.)
- 🧱 Modular tech stack (React frontend, Node.js backend, MongoDB)
- 🔄 API-first architecture with future expandability (RAM, storage, PSU, etc.)

## 🎯 Use Case Categories

- 🎮 Gaming PCs
- 🎞️ Video editing and rendering builds
- 🤖 AI/ML model training machines
- 🧮 Big data workstation builds
- 🧑‍💼 Office and productivity desktops

## ⚙️ Tech Stack

- **Frontend**: React + Tailwind CSS / Material UI
- **Backend**: Node.js (Express) or Python (FastAPI) with REST API
- **Database**: MongoDB (parts/spec cache), Redis (price cache)
- **APIs**: Amazon PA API, Newegg, BestBuy, PCPartPicker (scraped/unofficial)
- **Hosting**: Vercel (frontend), AWS/GCP/Render (backend & database)

## 🧠 How It Works

1. User selects goal and budget.
2. AI engine allocates budget to parts based on task-specific heuristics.
3. Fetches and filters part combinations using performance and compatibility rules.
4. Ranks best combos with pricing and availability checks.
5. Returns top recommended builds to user.

## 🔒 License


Built with ❤️ by [ishtiak ahmed MOyen]
