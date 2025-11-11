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

## Architecture

This is a **monorepo** managed by PNPM workspaces:

- **apps/web** - Next.js 16 frontend with App Router
- **services/api** - FastAPI Python backend
- **packages/ui** - Shared React component library
- **packages/hooks** - Shared React hooks
- **packages/lib** - Shared utilities

### Technology Stack

**Frontend:**
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- Recharts for data visualization
- shadcn/ui component system

**Backend:**
- Python 3.11+
- FastAPI
- SQLAlchemy
- SQLite (development)
- Uvicorn ASGI server

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (reverse proxy)

```
TradeGuardAI/
├── backend/              # FastAPI service
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── seed_data.py
│   ├── routes/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/             # Next.js dashboard
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Features

### Frontend
- **Global Dashboard** - Real-time event feed, risk map, and top-risk SKUs
- **Event Details** - Drill-down view for individual trade disruptions
- **SKU Forecasts** - 30-day risk predictions with trend analysis
- **Risk Color Coding** - Green (Stable), Yellow (Caution), Red (Critical)

### Backend
- **REST API** with CORS support
- **SQLite Database** with 10 mock events and 5 SKUs
- **Mock Forecast Engine** - Generates realistic 30-day risk trends
- **Health Check Endpoint** - Service monitoring

## Quick Start

### Prerequisites
- **Node.js** 18+ and **pnpm** 8+
- **Python** 3.11+
- **Docker** and **Docker Compose** (optional, for containerized setup)

### Option 1: Local Development (Recommended)

**1. Install dependencies:**
```bash
# Install all workspace dependencies
pnpm install
```

**2. Start the backend API:**
```bash
# From project root
pnpm dev:api

# Or manually:
cd services/api
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend runs on http://localhost:8000

**3. Start the frontend (in a new terminal):**
```bash
# From project root
pnpm dev

# Or manually:
cd apps/web
pnpm dev
```

Frontend runs on http://localhost:3000

### Option 2: Docker Compose

\`\`\`bash
pnpm docker:up
\`\`\`

Then visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Option 1: Docker Compose (Recommended)

\`\`\`bash
docker-compose up
\`\`\`

Then visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Option 2: Local Development

**Backend:**
\`\`\`bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

Backend runs on http://localhost:8000

**Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Frontend runs on http://localhost:3000

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/events` - List recent events (limit: 10)
- `GET /api/events/{id}` - Get event details
- `GET /api/sku` - List all SKUs (sorted by risk)
- `GET /api/sku/{id}` - Get SKU details
- `GET /api/forecast/{sku_id}` - Get 30-day risk forecast

## Mock Data

### Events (10 total)
Real-world trade disruption scenarios:
- Port strikes and labor disputes
- Weather delays and natural disasters
- Geopolitical disruptions
- Canal congestion and vessel incidents

### SKUs (5 total)
- Consumer Electronics
- Crude Oil
- Wheat & Cereals
- Automotive Components
- Pharmaceuticals

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

### Backend
- `DATABASE_URL` - SQLite path (default: trade_guard.db)

## Deployment

### Frontend → Vercel
\`\`\`bash
npm run build
vercel deploy
\`\`\`

### Backend → Render/Railway/AWS
1. Push backend folder to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy

## Development

### Monorepo Commands

```bash
# Install all dependencies
pnpm install

# Run frontend dev server
pnpm dev
# or
pnpm dev:web

# Run backend dev server
pnpm dev:api

# Build frontend for production
pnpm build

# Lint frontend code
pnpm lint

# Docker commands
pnpm docker:up      # Start all services
pnpm docker:down    # Stop all services
pnpm docker:build   # Rebuild images
```

### Working with Packages

The monorepo uses **PNPM workspaces**. Shared code is organized into packages:

**@tradeguard/ui** - UI components
```tsx
import { Button } from '@tradeguard/ui/ui/button'
import { EventFeed } from '@tradeguard/ui/event-feed'
```

**@tradeguard/hooks** - React hooks
```tsx
import { useAuth } from '@tradeguard/hooks/use-auth'
import { useWebSocket } from '@tradeguard/hooks/use-websocket'
```

**@tradeguard/lib** - Utilities
```tsx
import { cn } from '@tradeguard/lib/utils'
```

### Adding New Dependencies

```bash
# Add to web app
cd apps/web
pnpm add <package-name>

# Add to ui package
cd packages/ui
pnpm add <package-name>

# Add to root (workspace tools)
pnpm add -w <package-name>
```

### Adding More Mock Data
Edit `backend/seed_data.py` and restart the backend.

### Customizing Colors
Edit `app/globals.css` design tokens for the risk color scheme.

### Adding Real Data Integration
Replace API endpoints in components to connect to live data sources.

## Status

✅ Backend API with mock data
✅ Frontend dashboard with real-time UI
✅ Event and SKU detail pages
✅ Risk forecasting
✅ Docker setup
⚠️ Real data ingestion (next version)
⚠️ User authentication (future)
⚠️ Advanced ML predictions (future)

## Next Steps

1. Configure environment variables in Vercel/hosting
2. Deploy frontend and backend separately
3. Test API connectivity
4. Add user authentication
5. Integrate real trade data sources
