# Workspace & developer workflow

This repository has been prepared to work as a lightweight monorepo. A few helper files were added:

- `pnpm-workspace.yaml` - workspace layout (apps, services, packages)
- `.gitattributes` - normalizes line endings to LF to avoid CRLF/LF warnings
- `.editorconfig` - editor settings for consistent formatting

Quick shortcuts (run from repo root):

```powershell
# install dependencies (root workspace)
pnpm install

# start frontend (from root)
pnpm run dev:web

# start backend (from root)
pnpm run dev:api
```

Planned next steps (I can apply them if you want): moving the existing folders into a clearer structure:

```
apps/web        # frontend
services/api    # backend
packages/ui     # react components
packages/hooks  # shared hooks
packages/lib    # shared utilities
infra/          # docker and infra config
```

If you want I will perform the safe, phased move now (create a branch, move folders with history via `git mv`, update paths and update Docker/compose references). Say "proceed with restructure" and I'll run the changes on a new branch.
