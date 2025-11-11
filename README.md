# TradeGuardAI - Trade Disruption Monitoring Platform

A full-stack prototype for monitoring global trade disruptions and supply chain risks in real-time.

## Architecture

\`\`\`
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
\`\`\`

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
- Docker and Docker Compose
- Or: Node.js 18+, Python 3.11+

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
