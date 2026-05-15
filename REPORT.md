# Web3 Ticketing DApp — Project Report

**Module:** Blockchain (Year 2)  
**Network:** Ethereum Sepolia testnet (Chain ID `11155111`)  
**Repository:** Blockchain ticketing DApp (Hardhat + static HTML/JS frontend)

---

## 1. Executive summary

This project is a **Web3 distributed application** for event ticketing. Attendees buy **ERC-20 ticket tokens** (`ETIX`) by paying **native Sepolia ETH** into a Solidity smart contract. A **doorman** checks any wallet’s token balance on a read-only page; a **venue vendor** receives tokens when attendees **transfer tickets back** (no ETH refund). The contract owner (deployer) can withdraw accumulated sale ETH.

Development used **Cursor AI** under a *Students as Managers of AI* workflow: requirements were broken into prompts, outputs were reviewed and corrected (e.g. Sepolia network setup, deploy TLS issues, renaming “return” to **Transfer to Vendor**, adding a **100-ticket mint cap**). Full prompt traceability is in [`PROMPTS_SUBMISSION.md`](PROMPTS_SUBMISSION.md).

---

## 2. Code overview

### 2.1 Repository structure

| Path | Purpose |
|------|---------|
| `contracts/TicketToken.sol` | ERC-20 + `buyTickets` payable in ETH; vendor address; 100-ticket cap |
| `scripts/deploy.js` | Deploy to Sepolia; writes `deployments/` and `frontend/src/js/deployed.inc.js` |
| `scripts/verify.js` | Optional Etherscan verification |
| `test/TicketToken.test.js` | Hardhat tests (15 cases including cap and transfer) |
| `frontend/src/` | Static DApp: pages, `ethers` v6 (CDN), shared config |
| `hardhat.config.js` | Solidity 0.8.20, Sepolia network from `.env` |

### 2.2 Smart contract (`TicketToken`)

- **ERC-20** (OpenZeppelin): name `Event Ticket`, symbol `ETIX`, 18 decimals.
- **`buyTickets(uint256 ticketCount)`** (payable): caller must send exactly `ticketPriceWei × ticketCount`; contract mints `ticketCount × 10^decimals` tokens to `msg.sender`.
- **`MAX_TICKETS = 100`**: `totalSupply` after mint must not exceed 100 ticket units.
- **`vendor`**: configured at deploy; used by the frontend as the transfer destination (not automatic on-chain).
- **`withdrawEth()`** (owner only): sends contract ETH balance to owner.
- **Events:** `TicketPurchased`, `TicketPriceUpdated`, `VendorUpdated`.

ETH from sales is held **in the contract** until the owner withdraws; the vendor does **not** receive ETH from purchases.

### 2.3 Frontend pages

| Page | File | Function |
|------|------|----------|
| Home | `index.html` | Navigation hub |
| Create wallet | `create-wallet.html` + `wallet.js` | `ethers.Wallet.createRandom()`, display address/key/mnemonic, download JSON |
| Balances | `balances.html` + `blockchain.js` | Read-only Sepolia ETH + ETIX balance for **any** address |
| Buy ticket | `buy-ticket.html` + `ticketing.js` | MetaMask connect, Sepolia check, `buyTickets(1)`, tickets remaining |
| Transfer to vendor | `transfer-to-vendor.html` + `transfer-to-vendor.js` | ERC-20 `transfer(vendor, 1 ticket)` — **no ETH refund** |

Configuration merges `config.js` (chain, RPC) with `deployed.inc.js` (contract + vendor addresses after deploy).

### 2.4 Tooling and quality assurance

- **Hardhat:** compile, test, deploy.
- **Frontend:** Vitest UI tests (`frontend/tests/ui/`).
- **CI:** GitHub Actions (contract + UI tests).
- **Python `uv`:** Commitizen / dev tooling ([`README.md`](README.md)).

---

## 3. Design description

### 3.1 Architecture

```text
┌─────────────┐     JSON-RPC / MetaMask     ┌──────────────────┐
│  Browser    │ ──────────────────────────► │  Sepolia         │
│  (HTML/JS)  │                             │  TicketToken     │
└─────────────┘                             │  contract        │
       │                                    └────────┬─────────┘
       │  deployed.inc.js (address)                 │
       └────────────────────────────────────────────┘
```

1. **Deployer** runs Hardhat deploy → contract address written to `deployed.inc.js`.
2. **Purchaser** connects MetaMask on Sepolia → `buyTickets` → ETH to contract, tokens to purchaser.
3. **Doorman / venue** use **Balances** with purchaser’s address (no wallet required for read-only check).
4. **Purchaser** optionally **transfers** 1 ETIX to **vendor** address (hand-in / return-of-token, not refund).

### 3.2 Actor roles (assignment mapping)

| Actor | How the DApp supports them |
|-------|----------------------------|
| **Attendee** | Buy Ticket + Balances on own address to confirm tokens |
| **Doorman** | Balances: paste attendee address; ETIX ≥ 1 ⇒ holder |
| **Venue / vendor** | Balances on multiple addresses; vendor address accumulates transferred ETIX |

One balance page serves all three roles by **whose address is queried**, with role explained in the UI copy and this report.

### 3.3 Design decisions (managerial)

| Decision | Rationale |
|----------|-----------|
| ERC-20 for tickets | Matches brief; familiar standard; easy `balanceOf` checks |
| Payable `buyTickets` with exact ETH | Simple Sepolia-native payment without oracle/DEX |
| Vendor as transfer destination only | Meets “transfer back to vendor”; vendor need not hold ETH |
| Mint cap 100 | Models finite event capacity; enforced in `buyTickets` |
| Renamed “Return” → **Transfer to Vendor** | Avoids confusion with ETH refund |
| Local wallet page + MetaMask for txs | Brief requires create/download wallet; MetaMask practical for Sepolia |
| Read-only public RPC for balance page | Works without connecting wallet (doorman use case) |

### 3.4 Known limitations (honest scope)

- **No on-door “scan and burn”**: checking balance does not invalidate a ticket; attendee must transfer token to vendor to move it.
- **Mint cap does not refill** when tokens are transferred to vendor (`totalSupply` unchanged).
- **No `withdrawEth` UI** — owner must call via Hardhat/console.
- **Two deployments** exist on Sepolia (see §4); the **final** contract includes the 100-ticket cap.

---

## 4. Sepolia transaction evidence

### 4.1 Wallet and contract addresses

| Role | Address |
|------|---------|
| **Contract creator / deployer** | [`0xBe3421B1E93A1885D1Aa4bf355c8cEeCC4544695`](https://sepolia.etherscan.io/address/0xBe3421B1E93A1885D1Aa4bf355c8cEeCC4544695) |
| **Ticket purchaser** (MetaMask) | [`0x9a4cEa190106435dF9059Ee063F43A1EF9fEfcCA`](https://sepolia.etherscan.io/address/0x9a4cEa190106435dF9059Ee063F43A1EF9fEfcCA) |
| **Vendor / doorman** | [`0x906b4a0773828D6528329ED486ae59F9e08cd5bf`](https://sepolia.etherscan.io/address/0x906b4a0773828D6528329ED486ae59F9e08cd5bf) |
| **Final TicketToken contract** (100-cap version) | [`0xC624895c31FE16b552ac7966C73039276B95a888`](https://sepolia.etherscan.io/address/0xC624895c31FE16b552ac7966C73039276B95a888) |
| Earlier TicketToken (no cap) | [`0xA8A28d5A1b7A279d67f728bD7a09704c3831f8da`](https://sepolia.etherscan.io/address/0xA8A28d5A1b7A279d67f728bD7a09704c3831f8da) |

---

### 4.2 Which of your links is which?

You asked about these URLs — here is what each one is:

| Your link | What it actually is | Use for brief? |
|-----------|---------------------|----------------|
| [`0x184c129f…`](https://sepolia.etherscan.io/tx/0x184c129f1a37fdfaf513e255d407a65820e003caf890935cb95972407a3a7a76) | **Contract deployment** (creates `0xA8A28…`) | Valid as *a* deployment proof; **superseded** by final deploy below |
| [`0x6da07adb…`](https://sepolia.etherscan.io/tx/0x6da07adb33cc26900a5cdb52e80f1bef7c29558291b0ee43129a3efd6e2a0808) | **ERC-20 `transfer`** — 1 ETIX from purchaser → vendor on **old** contract `0xA8A28…` | Valid for **“transfer ticket to vendor”**; **not** a buy and **not** a deployment |
| Same `0x6da07adb…` pasted twice | Duplicate | Only list once |

**You still need a clear `buyTickets` link on the contract you cite in the report.** Recommended (final contract):

| Requirement | Recommended transaction | Verification |
|-------------|-------------------------|--------------|
| **Deployment (final)** | [`0x9ce599be…`](https://sepolia.etherscan.io/tx/0x9ce599be45c6bd1c57bc84d08fd61f040c787fe58baffc4401beffdf8b779940) | Creates [`0xC624…`](https://sepolia.etherscan.io/address/0xC624895c31FE16b552ac7966C73039276B95a888) |
| **Buy token (final)** | [`0x780adaa5…`](https://sepolia.etherscan.io/tx/0x780adaa549da65ddc93d71c12c89b2c0d6d71e1116e0f6fe01ae4866ced82647) | Method `buyTickets(1)`, **0.01 ETH**, mints 1 ETIX to purchaser |

---

### 4.3 Required evidence — primary table (use these in submission)

#### A. Contract deployment (successful)

| Item | Link | Commentary |
|------|------|------------|
| **Final deployment** | [0x9ce599be45c6bd1c57bc84d08fd61f040c787fe58baffc4401beffdf8b779940](https://sepolia.etherscan.io/tx/0x9ce599be45c6bd1c57bc84d08fd61f040c787fe58baffc4401beffdf8b779940) | From deployer `0xBe3421…`; contract created at `0xC624…`. Status **Success**. Constructor sets vendor `0x906b…`, price 0.01 ETH, `MAX_TICKETS = 100`. |
| Earlier deployment (optional) | [0x184c129f1a37fdfaf513e255d407a65820e003caf890935cb95972407a3a7a76](https://sepolia.etherscan.io/tx/0x184c129f1a37fdfaf513e255d407a65820e003caf890935cb95972407a3a7a76) | First deploy to `0xA8A28…` before cap/rename iteration. |

#### B. Buy a token (successful `buyTickets`)

| Item | Link | Commentary |
|------|------|------------|
| **Buy on final contract** | [0x780adaa549da65ddc93d71c12c89b2c0d6d71e1116e0f6fe01ae4866ced82647](https://sepolia.etherscan.io/tx/0x780adaa549da65ddc93d71c12c89b2c0d6d71e1116e0f6fe01ae4866ced82647) | Purchaser `0x9a4cEa…` calls `buyTickets(1)` on `0xC624…`; **0.01 ETH** to contract; **1 ETIX** minted. Event `TicketPurchased` in logs. |

#### C. Transfer ticket to vendor (successful)

| Item | Link | Commentary |
|------|------|------------|
| Transfer (earlier contract) | [0x6da07adb33cc26900a5cdb52e80f1bef7c29558291b0ee43129a3efd6e2a0808](https://sepolia.etherscan.io/tx/0x6da07adb33cc26900a5cdb52e80f1bef7c29558291b0ee43129a3efd6e2a0808) | `transfer(vendor, 1e18)` on `0xA8A28…`; purchaser → vendor; **0 ETH**; proves return-of-token flow. |
| Transfer on final contract | *Optional* — run **Transfer to Vendor** once against `0xC624…` and add link here | Strengthens alignment with final deployed code. |

#### D. Wallet top-ups (Sepolia ETH funding)

| Role | Link | Commentary |
|------|------|------------|
| **Contract creator** | [0xcab1b0ea96c940e65b13f8fe85686591f4cdf3c7312944547ecb8197cb03dda4](https://sepolia.etherscan.io/tx/0xcab1b0ea96c940e65b13f8fe85686591f4cdf3c7312944547ecb8197cb03dda4) | Incoming **0.05 ETH** to deployer `0xBe3421…` (faucet/funding). Used for deploy gas. |
| **Ticket purchaser** | [0x8097c1ecf19d619169514740de30b4bfe885b7f91aca2493e517d26f184372e0](https://sepolia.etherscan.io/tx/0x8097c1ecf19d619169514740de30b4bfe885b7f91aca2493e517d26f184372e0) | Incoming ETH to purchaser `0x9a4cEa…` (Etherscan “Funded By”). |
| **Ticket purchaser** (additional) | [0x7d32053b8e258785d3c6d3664bb7ef1bb1cb8d0cf34ea5f38544adc06a9da9db](https://sepolia.etherscan.io/tx/0x7d32053b8e258785d3c6d3664bb7ef1bb1cb8d0cf34ea5f38544adc06a9da9db) | Further incoming transfer (**0.1015799 ETH**) for purchases and gas. |
| **Vendor / doorman** | See note below | Vendor address has **no outgoing txs** and **no ETH “Funded By”** on Etherscan; it **received 1 ETIX** via [transfer 0x6da07adb…](https://sepolia.etherscan.io/tx/0x6da07adb33cc26900a5cdb52e80f1bef7c29558291b0ee43129a3efd6e2a0808). For strict “ETH top-up” wording, send a small Sepolia ETH amount from deployer or purchaser to `0x906b…` and add that tx link. |

---

## 5. Rubric alignment (Managerial grading — 40% module)

This section maps the project to the **Students as Managers of AI** rubric. Peer review (10%) is submitted separately.

| Criterion | Weight | Evidence in this project | Target band |
|-----------|--------|--------------------------|-------------|
| **1. Process oversight & traceability** | 25% | [`PROMPTS_SUBMISSION.md`](PROMPTS_SUBMISSION.md); semantic commits (`uv run cz commit`); GitHub Actions; iterative deploy/debug (Sepolia, TLS) | B2–A1 |
| **2.1 Wallet creation** | 5% | Create-wallet page: generate, display, download JSON; prompts on `ethers` and key safety | B2–A1 |
| **2.2 Balance check / three actors** | 10% | Single balances page, role described in UI; read-only RPC; purchaser/doorman/venue scenarios documented §3.2 | B2 |
| **2.3 Ticket purchase flow** | 10% | MetaMask + Sepolia guard; `buyTickets`; explorer links; cap error message; tickets-remaining display | B2–A1 |
| **2.4 Token transfer to vendor** | 5% | Transfer page + Etherscan `transfer` proof; balances verify vendor receipt | B2 |
| **3.1 Smart contract** | 15% | OpenZeppelin ERC-20 + Ownable; payable mint; cap; tests; human-driven rename/cap | B2 |
| **3.2 Submission structure** | 5% | Root Hardhat + `frontend/`; deploy artefact; this report | B2–A1 |
| **3.3 Report communication** | 10% | This document: design rationale + verified txs | B2 |
| **4.1 Documentation** | 5% | README, report, prompt log | B2 |
| **4.2 Code efficiency** | 2.5% | Optimizer enabled; mint cap check; focused JS | B2 |
| **4.3 Error handling** | 5% | Sepolia mismatch, missing contract, cap exceeded, wallet not detected | B2 |
| **4.4 Testing** | 5% | 15 Hardhat tests; Vitest UI tests; CI | B2–A1 |

**Managerial reflection:** AI accelerated scaffolding and debugging; **human decisions** included wallet role split (MetaMask buyer vs generated deployer/vendor), rejecting “return” as ETH refund language, redeploying after `MAX_TICKETS`, and validating txs on Etherscan against the **final** contract address.

---

## 6. How to run (reproducibility)

```powershell
# Contracts
cd Blockchain
npm ci
npx hardhat test
npm run deploy:sepolia   # requires .env — see .env.example

# Frontend
cd frontend/src
npx --yes serve . -p 5173
# Open http://localhost:5173/pages/buy-ticket.html (MetaMask on Sepolia)
```

---

## 7. Submission checklist

- [x] DApp features implemented  
- [x] Final contract deployed (`0xC624…`)  
- [x] Deployment + buy Etherscan links (final contract)  
- [x] Transfer-to-vendor link (at least on `0xA8A28…`; optional repeat on `0xC624…`)  
- [x] Creator + purchaser funding links  
- [ ] Vendor ETH top-up link (optional small transfer for strict brief wording)  
- [ ] Peer review reflection (~200 words)  
- [ ] Zip for Brightspace (exclude `.env`, `node_modules`)  

---

## 8. References

- Sepolia Etherscan: [https://sepolia.etherscan.io](https://sepolia.etherscan.io)
- OpenZeppelin Contracts (ERC-20, Ownable)
- `ethers.js` v6 documentation
- Module brief: Web3 ticketing DApp on Sepolia
- AI prompt log: [`PROMPTS_SUBMISSION.md`](PROMPTS_SUBMISSION.md)

---

*Report generated for academic submission. Replace placeholder name/student ID if required by your school.*
