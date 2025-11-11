# TradeGuard AI - Architecture Overview

## 🏗️ Monorepo Structure

```
tradeguard-ai/
│
├── apps/                           # Applications (user-facing)
│   └── web/                        # Next.js frontend app
│       ├── app/                    # Next.js App Router pages
│       │   ├── page.tsx            # Dashboard (/)
│       │   ├── analytics/          # Analytics page
│       │   ├── events/[id]/        # Event detail page
│       │   ├── login/              # Login page
│       │   └── sku/[id]/           # SKU detail page
│       ├── public/                 # Static assets
│       ├── styles/                 # Global styles
│       ├── next.config.mjs         # Next.js configuration
│       ├── tsconfig.json           # TypeScript configuration
│       └── package.json            # Dependencies
│
├── services/                       # Backend services
│   └── api/                        # FastAPI Python service
│       ├── routes/                 # API endpoints
│       │   ├── analytics.py        # Analytics endpoints
│       │   ├── auth.py             # Authentication
│       │   ├── events.py           # Event CRUD
│       │   ├── forecast.py         # Forecast engine
│       │   ├── health.py           # Health checks
│       │   ├── news.py             # News feed
│       │   ├── ports.py            # Port data
│       │   ├── skus.py             # SKU management
│       │   └── websocket.py        # Real-time updates
│       ├── main.py                 # FastAPI app entry
│       ├── database.py             # SQLAlchemy setup
│       ├── models.py               # Database models
│       ├── auth.py                 # Auth utilities
│       ├── seed_data.py            # Mock data generator
│       ├── requirements.txt        # Python dependencies
│       └── Dockerfile              # Container image
│
├── packages/                       # Shared libraries (monorepo internal)
│   ├── ui/                         # React component library
│   │   ├── ui/                     # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── ...                 # 80+ base components
│   │   │   └── use-toast.ts
│   │   ├── navbar.tsx              # App navigation
│   │   ├── event-feed.tsx          # Event list component
│   │   ├── sku-forecast.tsx        # Forecast chart
│   │   ├── risk-map.tsx            # Risk visualization
│   │   ├── global-risk-map.tsx     # Global map
│   │   ├── advanced-analytics.tsx  # Analytics dashboard
│   │   └── ...                     # Business components
│   │
│   ├── hooks/                      # Shared React hooks
│   │   ├── use-auth.ts             # Authentication hook
│   │   ├── use-websocket.ts        # WebSocket connection
│   │   ├── use-toast.ts            # Toast notifications
│   │   └── use-mobile.ts           # Mobile detection
│   │
│   └── lib/                        # Utility functions
│       └── utils.ts                # cn() className merger, etc.
│
├── infra/                          # Infrastructure & DevOps
│   ├── docker-compose.yml          # Local dev environment
│   ├── Dockerfile.prod             # Production build
│   └── nginx.conf                  # Reverse proxy config
│
├── .github/
│   └── workflows/                  # CI/CD pipelines
│       └── ci-cd.yml               # GitHub Actions
│
├── .gitattributes                  # Git line ending config
├── .gitignore                      # Git ignore rules
├── .editorconfig                   # Editor settings
├── pnpm-workspace.yaml             # PNPM workspace config
├── pnpm-lock.yaml                  # Dependency lock file
├── package.json                    # Root workspace config
├── README.md                       # Main documentation
└── DEV_WORKFLOW.md                 # Developer guide
```

## 📦 Package Dependencies

```
apps/web
  ├─> @tradeguard/ui       (workspace)
  ├─> @tradeguard/hooks    (workspace)
  ├─> @tradeguard/lib      (workspace)
  ├─> next 16
  ├─> react 19
  └─> tailwindcss 4

@tradeguard/ui
  ├─> @radix-ui/react-*    (50+ primitives)
  ├─> recharts             (charts)
  ├─> lucide-react         (icons)
  └─> react 19

@tradeguard/hooks
  └─> react 19

@tradeguard/lib
  ├─> clsx
  └─> tailwind-merge
```

## 🔄 Data Flow

```
┌─────────────┐
│   Browser   │
│  (apps/web) │
└──────┬──────┘
       │ HTTP/WebSocket
       ▼
┌─────────────────┐
│  FastAPI Server │
│  (services/api) │
└────────┬────────┘
         │
         ▼
   ┌─────────┐
   │ SQLite  │
   │   DB    │
   └─────────┘
```

## 🧩 Component Import Patterns

### Before (old structure)
```tsx
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
```

### After (new monorepo structure)
```tsx
import { Button } from '@tradeguard/ui/ui/button'
import { EventFeed } from '@tradeguard/ui/event-feed'
import { useAuth } from '@tradeguard/hooks/use-auth'
import { cn } from '@tradeguard/lib/utils'
```

## 🚀 Development Workflow

### Install dependencies
```bash
pnpm install
```

### Run development servers
```bash
# Terminal 1: Frontend
pnpm dev

# Terminal 2: Backend
pnpm dev:api
```

### Add dependencies to packages
```bash
# To web app
cd apps/web
pnpm add <package>

# To UI package
cd packages/ui
pnpm add <package>

# To root (dev tools)
pnpm add -w <package>
```

## 🎯 Benefits of This Structure

1. **Clear Separation of Concerns**
   - `apps/` = deployable applications
   - `services/` = backend APIs
   - `packages/` = shared code libraries
   - `infra/` = deployment config

2. **Code Reusability**
   - Shared UI components in `@tradeguard/ui`
   - Shared hooks in `@tradeguard/hooks`
   - Shared utilities in `@tradeguard/lib`

3. **Scalability**
   - Easy to add new apps (mobile, admin, etc.)
   - Easy to add new services (notification-service, ml-service)
   - Easy to add new shared packages

4. **Developer Experience**
   - Type-safe imports with TypeScript path aliases
   - Fast builds with PNPM workspaces
   - Clear ownership and responsibility

5. **Git History Preserved**
   - All moves done with `git mv`
   - Complete file history intact
   - Easy to trace changes

## 📚 Next Steps for Development

1. **Update import statements** in apps/web to use new `@tradeguard/*` imports
2. **Update Docker Compose** paths in `infra/docker-compose.yml`
3. **Test build** with `pnpm build` in apps/web
4. **Add tests** for packages (jest/vitest)
5. **Add CI/CD** checks for linting, type-checking, testing

## 🤝 Contributing

When adding new features:

- **New page?** → Add to `apps/web/app/`
- **New component?** → Add to `packages/ui/`
- **New hook?** → Add to `packages/hooks/`
- **New utility?** → Add to `packages/lib/`
- **New API endpoint?** → Add to `services/api/routes/`
- **New service?** → Create `services/new-service/`
