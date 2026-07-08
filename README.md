# ⚽ CodolioFun

**Your Codolio stats, rated out of 99.**

Transform your [Codolio](https://codolio.com) coding profile into a stunning FIFA Ultimate Team-style player card. Inspired by [leetfut.fun](https://leetfut.fun).

![CodolioFun](https://img.shields.io/badge/CodolioFun-FUT%20Card%2026-gold?style=for-the-badge)

## ✨ Features

- 🏟️ **Auto-fetch** — Enter your Codolio username, we fetch stats from the API across LeetCode, GFG, CodeChef & more
- 🃏 **FIFA-style card** — Beautiful FUT card with dynamic gradients per finish tier (Bronze → Icon)
- 📊 **Scouting metrics** — Detailed breakdown with color-coded progress bars
- 🏆 **Playstyle badges** — Earned badges like "Hard Mode", "Polyglot", "Contest Grinder"
- 🎊 **Confetti** — Celebration burst for high-tier card reveals
- 📸 **Download & share** — Export as PNG, share to X/LinkedIn

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🏗️ Tech Stack

- **Vite** + **React** + **TypeScript**
- **html-to-image** for card export
- **Lucide React** for icons
- **Codolio API** for profile data

## 📁 Project Structure

```
src/
├── lib/
│   ├── types.ts          # Type definitions
│   ├── scoring.ts        # Scoring engine (signals → FUT stats)
│   ├── codolioClient.ts  # Codolio API client
│   ├── cardTheme.ts      # Card finish/theme resolution
│   ├── confetti.ts       # Confetti animation
│   ├── capture.ts        # Card PNG export
│   └── sampleCards.ts    # Demo card data
├── components/
│   ├── PlayerCard.tsx     # The FUT card
│   ├── ScoutForm.tsx      # Username search input
│   ├── ResultView.tsx     # Full result page
│   ├── Background.tsx     # Animated background
│   └── CardShowcase.tsx   # Homepage card fan
├── App.tsx               # Main app shell
├── App.css               # All component styles
└── index.css             # Design system
```

## ⚡ How Scoring Works

| FUT Stat | Signal | What It Measures |
|----------|--------|-----------------|
| **PAC** | Streak | Consistency & momentum |
| **SHO** | Problems | Volume & difficulty mastery |
| **PAS** | Contests | Competitive performance |
| **DRI** | Languages | Versatility & range |
| **DEF** | Community | Contributions & reputation |
| **PHY** | Balance | Endurance across difficulties |

## 🎨 Card Tiers

| Rating | Finish |
|--------|--------|
| 1-49 | Bronze |
| 50-69 | Silver |
| 70-84 | Gold |
| 85-89 | TOTW |
| 90-95 | TOTY |
| 96-99 | Icon |

## 📝 License

MIT

---

Built with ❤️ for the [Codolio](https://codolio.com) community. Inspired by [leetfut.fun](https://leetfut.fun).
