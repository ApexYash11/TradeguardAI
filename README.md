# TradeGuardAI - Trade Disruption Monitoring Platform

A full-stack monorepo for monitoring global trade disruptions and supply chain risks in real-time.

## 📁 Project Structure

```
tradeguard-ai/
├── apps/
│   └── web/                 # Next.js frontend application
│       ├── app/             # Next.js 13+ app directory (routes)
│       ├── public/          # Static assets
│       ├── styles/          # Global styles
│       └── package.json     # Web app dependencies
│
├── services/
│   └── api/                 # FastAPI backend service
│       ├── routes/          # API route handlers
│       ├── main.py          # FastAPI app entry point
│       ├── database.py      # Database configuration
│       ├── models.py        # SQLAlchemy models
│       ├── seed_data.py     # Mock data generator
│       └── requirements.txt # Python dependencies
│
├── packages/                # Shared packages (monorepo)
│   ├── ui/                  # React UI components library
│   │   ├── ui/              # Base shadcn/ui components
│   │   └── *.tsx            # Custom business components
│   ├── hooks/               # Shared React hooks
│   │   ├── use-auth.ts
│   │   ├── use-websocket.ts
│   │   └── use-toast.ts
│   └── lib/                 # Shared utilities
│       └── utils.ts         # Helper functions (cn, etc.)
│
├── infra/                   # Infrastructure & DevOps
│   ├── docker-compose.yml   # Local development setup
│   ├── Dockerfile.prod      # Production Docker image
│   └── nginx.conf           # Nginx reverse proxy config
│
├── .github/
│   └── workflows/           # CI/CD pipelines
│
├── pnpm-workspace.yaml      # PNPM workspace configuration
├── .gitattributes           # Git line ending normalization
├── .editorconfig            # Editor consistency settings
└── README.md                # This file
```

## 🏗️ Architecture

**Monorepo Structure** (managed by PNPM workspaces):

```
TradeGuardAI/
├── apps/
│   └── web/              # Next.js 16 frontend (React 19, Tailwind CSS 4)
├── services/
│   └── api/              # FastAPI backend (Python 3.11+, SQLite)
├── packages/
│   ├── ui/               # Shared React components (shadcn/ui)
│   ├── hooks/            # Shared React hooks
│   └── lib/              # Shared utilities
└── infra/                # Docker & deployment configs
```

**Tech Stack:**
- Frontend: Next.js 16, TypeScript, Tailwind CSS 4, Radix UI, Recharts
- Backend: FastAPI, SQLAlchemy, Uvicorn
- Infrastructure: Docker, GitHub Actions

## 📋 Features

**Dashboard:**
- 🌍 Real-time event feed with risk map
- 📊 30-day risk forecasts for SKUs
- 🔔 Event notifications
- 📈 Multi-SKU analytics

**Analytics:**
- 📉 Risk trend analysis
- 🎯 Sentiment analysis
- 📑 Custom report builder
- 🔍 Advanced filtering

**Data:**
- 10 mock trade disruption events
- 5 SKUs with risk profiles
- Real-time WebSocket updates

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+ & **pnpm** 8+
- **Python** 3.11+
- **Docker** (optional)

### 🚀 Local Development (5 minutes)

```bash
# 1. Install frontend dependencies
pnpm install

# 2. Initialize database (Terminal 1)
cd services/api
python seed_data.py

# 3. Start backend (keep Terminal 1 running)
python -m uvicorn main:app --reload
# → http://127.0.0.1:8000

# 4. Start frontend (Terminal 2)
cd ../..
pnpm dev
# → http://localhost:3000
```

### 🐳 Docker (Alternative)

```bash
cd infra
docker-compose up
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

**That's it!** Visit http://localhost:3000 to see the dashboard.

---

## 📡 API Endpoints

Base URL: `http://localhost:8000`

```
GET  /api/health                    # Health check
GET  /api/events                    # List events (limit: 10)
GET  /api/events/{id}               # Event details
GET  /api/sku                       # List SKUs (sorted by risk)
GET  /api/sku/{id}                  # SKU details
GET  /api/forecast/{sku_id}         # 30-day risk forecast
GET  /api/analytics/gtri            # Global Trade Risk Index
GET  /docs                          # Interactive API docs
```

---

## � License

MIT License - See [LICENSE](LICENSE) for details.
