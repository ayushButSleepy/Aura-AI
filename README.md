<div align="center">

<img src="https://img.shields.io/badge/SDG%203-Good%20Health%20%26%20Well--being-00e5c3?style=for-the-badge&logo=unitednations&logoColor=white" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Groq-LLaMA%203.3-a855f7?style=for-the-badge" />
<img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />

# 🫀 Aura
### *Your AI-powered personal health companion*

**Aura makes preventative healthcare accessible to everyone — one daily habit at a time.**

[🌐 Live Demo](#) · [📹 Demo Video](#) · [🐛 Report Bug](https://github.com/ayushButSleepy/Aura-AI/issues)

</div>

---

## 🌍 The Problem

Over **2.1 billion people** worldwide lack access to basic healthcare. Most deaths from diabetes, heart disease, and hypertension are **preventable** — yet the tools to track and understand your own health are too expensive, too complex, or simply unavailable in developing regions.

Aura is built to change that.

---

## ✨ What is Aura?

Aura is a **free, browser-based wellness dashboard** that tracks your daily health metrics and uses real AI to turn raw numbers into actionable advice. No doctor required. No subscription. No data sent to any server — everything stays on your device.

Built for **UN SDG 3 — Good Health and Well-being** as part of the GNEC Hackathon 2026.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📊 **Live Dashboard** | Real-time wellness score, steps, sleep, hydration & heart rate tracking |
| 🤖 **AI Health Insights** | Chat with a real AI (LLaMA 3.3 via Groq) that knows your personal health data |
| 📝 **Daily Log** | Interactive sliders to log your metrics + mood tracking |
| 📈 **7-Day Trend Charts** | Visualize weekly patterns across all health metrics |
| ✅ **Micro-Challenges** | Daily habit nudges that update your wellness score in real time |
| 🌙 **Dark / Light Mode** | Full theme system with CSS variables |
| 🔒 **100% Private** | All data stored locally — nothing ever leaves your browser |

---

## 🖥️ Screenshots

> Dashboard · AI Insights · Daily Log

---

## 🛠️ Built With

- **[React 19](https://react.dev/)** + **[Vite 8](https://vitejs.dev/)** — UI framework and build tooling
- **[Recharts](https://recharts.org/)** — 7-day wellness trend visualizations
- **[Groq API](https://groq.com/)** (LLaMA 3.3 70B) — Real-time AI health insights
- **[Lucide React](https://lucide.dev/)** — Icon system
- **CSS Variables + Glassmorphism** — Responsive dark/light theme
- **localStorage** — Private, on-device data storage

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- A free [Groq API key](https://console.groq.com/keys)

### Installation

```bash
# Clone the repo
git clone https://github.com/ayushButSleepy/Aura-AI.git
cd Aura-AI

# Install dependencies
npm install

# Create your environment file
echo "VITE_GROQ_API_KEY=your_groq_key_here" > .env

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🌐 Deployment

Deploy instantly for free on **Vercel**:

1. Fork this repo
2. Go to [vercel.com](https://vercel.com) → Import your fork
3. Add `VITE_GROQ_API_KEY` in Environment Variables
4. Click Deploy ✅

---

## 🎯 SDG 3 Alignment

Aura directly addresses **UN Sustainable Development Goal 3 — Good Health and Well-being** by:

- Making preventative health tracking **free and accessible globally**
- Working on **any device with a browser**, including low-end smartphones
- Requiring **no internet connection** for core features (offline-first)
- Using **AI to democratize health advice** previously only available to those who can afford regular doctor visits
- Keeping all data **private and local** — protecting vulnerable users

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx       # Navigation
│   └── MetricCard.jsx    # Health metric display cards
├── pages/
│   ├── Dashboard.jsx     # Main wellness overview
│   ├── Insights.jsx      # AI chat interface
│   ├── Log.jsx           # Daily health logging
│   ├── Profile.jsx       # User profile
│   └── Settings.jsx      # App preferences & goals
└── index.css             # Global design system
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ for the **GNEC Hackathon 2026** · SDG 3 Track

*Making healthcare accessible, one habit at a time.*

</div>
