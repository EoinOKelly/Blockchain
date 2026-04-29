# Blockchain

Web3 ticketing DApp project using:
- Solidity smart contracts (Sepolia testnet target)
- HTML/CSS/JavaScript frontend
- GitHub Actions for UI unit tests

## Dependency Management With uv

This repo uses `uv` for Python-based tooling (for example `commitizen`).

### Install uv

Windows (PowerShell):

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Install dev tooling dependencies

```powershell
uv sync --group dev
```

This installs tools listed in `pyproject.toml` under the `dev` group (for example `commitizen`, `pre-commit`, `ruff`).

### Run Commitizen via uv

```powershell
uv run cz commit
```

### Add future dependencies

- Add a normal/runtime dependency:

```powershell
uv add <package-name>
```

- Add a dev-only dependency:

```powershell
uv add --group dev <package-name>
```

## Frontend tests

From `frontend/`:

```powershell
npm ci
npm run test:ui
```

## README structure guidance

A single root `README.md` is enough for this project right now.
If the project grows, you can later add focused docs in `frontend/README.md` and `backend/README.md` without changing the current setup.
