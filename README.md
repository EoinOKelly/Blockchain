# Blockchain

Web3 ticketing DApp project using:
- Solidity ERC-20 ticket token + payable purchase on **Sepolia**
- HTML/CSS/JavaScript frontend (`ethers` UMD + static pages)
- GitHub Actions for UI unit tests and contract tests

### Quick path (assignment workflow)

1. **Contracts**: `cd backend && npm ci && npx hardhat test`
2. **Deploy Sepolia**: configure `backend/.env`, then `npx hardhat run scripts/deploy.js --network sepolia` — this regenerates `frontend/src/js/deployed.inc.js` with the contract and vendor addresses.
3. **Frontend**: from project root, serve static files (example): `cd frontend/src && npx --yes serve . -p 5173` — open `pages/buy-ticket.html` over **http://** (not `file://`) so MetaMask injects `window.ethereum`.
4. **Report evidence**: save Sepolia Etherscan links for deployment, `buyTickets`, token `transfer` (return), and faucet top-ups for deployer / purchaser / vendor wallets.

See [backend/README.md](backend/README.md) for deploy and verify details.

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
