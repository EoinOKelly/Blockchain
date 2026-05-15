# AI Prompt Log — Web3 Ticketing DApp (Managerial Submission)

**Student:** Eoin O'Kelly  
**Module:** Blockchain (Year 2) — *Students as Managers of AI* (30% of module grade)  
**Project:** Sepolia testnet ticketing DApp (Hardhat + static HTML/JS frontend)

---

## How to read this document

This is a **single consolidated log** of how I directed Cursor AI while building the project. Prompts are grouped by the **Managerial Grading Rubric**, not by chat session, so markers can trace oversight against each criterion.

| Legend | Meaning |
| --- | --- |
| **Prompt** | Wording used (or lightly edited for clarity). Where I reworded for submission, the original intent is preserved. |
| **Outcome / oversight** | What I expected the AI to deliver and how I validated it. |
| *(Added)* | Prompt synthesized from a clear managerial decision during the project (not a single verbatim chat line). |

**Excluded from this log (per submission guidance):** asking whether the project was “done”; prompts whose only purpose was generating this log or `REPORT.md`; empty screenshot-only messages; duplicate full brief pastes; raw terminal dumps (e.g. `uv` PATH troubleshooting).

**Companion files:** technical report → [`REPORT.md`](REPORT.md); runnable code → repository root.

---

## Rubric index

| Rubric criterion | Weight | Section below |
| --- | ---: | --- |
| 1. Process oversight & traceability | 25% | §1 |
| 2.1 Wallet creation oversight | 5% | §2.1 |
| 2.2 Balance check logic (three actors) | 10% | §2.2 |
| 2.3 Ticket purchase flow | 10% | §2.3 |
| 2.4 Token transfer to vendor | 5% | §2.4 |
| 3.1 Smart contract architecture | 15% | §3.1 |
| 3.2 Project structure & submission | 5% | §3.2 |
| 4.1 Documentation | 5% | §4.1 |
| 4.2 Code efficiency | 2.5% | §4.2 |
| 4.3 Proactive error handling | 5% | §4.3 |
| 4.4 Comprehensive testing | 5% | §4.4 |

*Criterion 3.3 (written report) is assessed via `REPORT.md`, not this prompt log.*

---

## §1 — AI-enhanced code review process (25%)

### 1.1 Repository and commit discipline

**Prompt 1**  
Initialize this folder as a git repo linked to `https://github.com/EoinOKelly/Blockchain.git` with first commit message `init repo`. Do not add “made with Cursor” or similar to commit metadata.

**Outcome / oversight:** Clean git history owned by the student; verified commit message on GitHub.

---

**Prompt 2**  
After adding UI unit tests, review them with me, then suggest a **branch name** and **commit message** suitable for **Commitizen** semantic versioning before I open a PR.

**Outcome / oversight:** Tests reviewed before merge; conventional commit format for traceable PRs.

---

**Prompt 3**  
Set up **Commitizen** via **`uv` dev dependencies** (not a global npm install). Document in the README: `uv sync --group dev`, `uv run cz commit`, and when to use runtime vs dev dependency groups in a polyglot (Python + JS) repo.

**Outcome / oversight:** Dev tooling isolated from contract/frontend runtime; `uv.lock` committed for reproducibility.

---

**Prompt 4**  
Add a `.gitignore` for `node_modules`, build artefacts, and `.env`. Confirm whether `uv.lock` should be committed (yes — reproducible installs).

**Outcome / oversight:** Secrets and heavy folders excluded from Brightspace zip and GitHub.

---

**Prompt 5**  
Configure **GitHub Actions** so frontend **Vitest** UI tests run on every pull request. Briefly explain what each workflow file does so I can maintain CI myself.

**Outcome / oversight:** `.github/workflows/frontend-ui-tests.yml`; PR pipeline runs before merge.

---

**Prompt 6**  
Review all **unstaged/uncommitted** changes, summarize what changed since the last commit, and give me a **valid branch name** plus the exact **`uv run cz commit`** steps (including scope) for a PR that covers the Sepolia balances work and related updates.

**Outcome / oversight:** Deliberate commit scope; PR traceability from branch → review → merge.

---

**Prompt 7**  
Explain how this project is **deployed to Sepolia** (`scripts/deploy.js`, `deployments/`, `deployed.inc.js`). Before deleting folders, confirm which are required for reproducible deploy and frontend contract address wiring.

**Outcome / oversight:** Kept `deployments/` and deploy scripts; removed only out-of-scope `docs/` after confirmation.

---

## §2 — Front-end validation & architecture (30%)

### §2.1 Wallet creation oversight (5%)

**Prompt 8**  
Scaffold the full assignment structure (Hardhat contracts, deploy scripts, tests, frontend pages) from the module brief — placeholders only first, then implement features incrementally.

**Outcome / oversight:** Structure matched brief checklist before coding.

---

**Prompt 9**  
Implement the **Create Wallet** page: generate a wallet with `ethers.Wallet.createRandom()`, **display** address/private key/mnemonic, and allow **download** as JSON. Match assignment requirements exactly.

**Outcome / oversight:** All three wallet features present; manual test of download + re-import path.

---

**Prompt 10**  
Explain `ethers` CDN loading in HTML vs JS, `"use strict"`, and whether `createRandom()` is cryptographically secure. I need to understand key handling before accepting the AI’s approach.

**Outcome / oversight:** Validated architecture choice (static site, no bundler); informed trade-off of showing secrets on screen for a lab DApp.

---

**Prompt 11** *(Added)*  
Add a visible warning on the wallet page: generated keys are for **testnet practice only**; never reuse this pattern for mainnet; prefer MetaMask for funded Sepolia transactions.

**Outcome / oversight:** Security awareness documented in UI, not only in chat.

---

**Prompt 12**  
I have one MetaMask account with Sepolia ETH (buyer). I need **deployer** and **vendor/doorman** roles. Walk me through using this DApp’s wallet generator vs MetaMask import, and which address should deploy vs purchase vs receive returned tickets.

**Outcome / oversight:** Three-role test plan: deployer `0xBe34…`, purchaser `0x9a4c…`, vendor `0x906b…` (see `REPORT.md`).

---

### §2.2 Balance check logic — three actors (10%)

**Prompt 13**  
Build the **Balances** page: user enters **any** address; show **Sepolia ETH** and **ticket token (ETIX)** balance via read-only RPC (no wallet connect required).

**Outcome / oversight:** Doorman can check attendee at door without owning their keys.

---

**Prompt 14**  
On the balances page, document in UI copy how the **same page** serves: (1) **attendee** — confirm purchase on own address; (2) **doorman** — paste attendee address, ETIX ≥ 1 means valid holder; (3) **venue** — check distribution across multiple addresses including vendor.

**Outcome / oversight:** One component, three actor workflows — distinction by *which address is queried*, not separate broken pages.

---

**Prompt 15**  
Walk me through the end-to-end workflow: create wallet → fund on Sepolia → connect MetaMask → buy ticket → verify on balances page. Clarify when an address “exists” on-chain vs simply being valid offline.

**Outcome / oversight:** Correct mental model of JSON-RPC, faucets, and explorer verification.

---

### §2.3 Ticket purchase transaction flow (10%)

**Prompt 16**  
Plan and implement the full DApp per the brief: ERC-20 + **payable `buyTickets`** using native Sepolia ETH, wire all frontend pages, deployment artefact for contract address, and remove unused scaffold files.

**Outcome / oversight:** Integrated stack; `deployed.inc.js` auto-updated on deploy.

---

**Prompt 17**  
Implement **Buy Ticket** JavaScript: MetaMask connect, **enforce Sepolia (chain 11155111)**, show ticket price, ETH balance, ETIX balance, tickets remaining, and call `buyTickets(1)` with exact `msg.value`.

**Outcome / oversight:** Purchase flow tested on Sepolia; Etherscan tx `0x780adaa5…` on final contract.

---

**Prompt 18** *(Added)*  
For the buy flow, implement **user-facing errors** (not raw RPC text) for: wallet not detected, wrong network, missing contract config, insufficient ETH, transaction rejected, and **`TicketToken: ticket cap exceeded`**. Disable buttons while a tx is pending.

**Outcome / oversight:** `setStatus()` / `isError` pattern in `ticketing.js`; cap message after `MAX_TICKETS = 100` added.

---

**Prompt 19**  
Debug: “No wallet extension detected” when connecting — check serving over `http://localhost` vs `file://`, MetaMask install, and `window.ethereum` detection order.

**Outcome / oversight:** Frontend served via `npx serve`; MetaMask connection working.

---

**Prompt 20**  
MetaMask shows one ETH address on all networks — I can’t find a “Sepolia-only address”. Explain why the DApp still says “switch to Sepolia” and how to enable Sepolia test network in MetaMask.

**Outcome / oversight:** Resolved network mismatch; purchases succeed on chain ID 11155111.

---

### §2.4 Token transfer validation (5%)

**Prompt 21**  
At event entrance, how should the vendor **confirm** a ticket and **invalidate** reuse? Should the vendor hold a pre-minted supply? Propose a flow that fits our ERC-20 model.

**Outcome / oversight:** Chose transfer-to-vendor (token moves to vendor address); balance check alone does not burn ticket.

---

**Prompt 22**  
Rename **“Return ticket”** to **“Transfer to Vendor”** — “return” sounds like an ETH refund. Implement ERC-20 `transfer(vendor, 1 ticket)` and show clear copy that **no ETH is refunded**.

**Outcome / oversight:** Page and nav updated; Etherscan transfer `0x6da07adb…` documented in report.

---

**Prompt 23**  
After transfer, verify on the balances page that **purchaser ETIX decreased** and **vendor ETIX increased** by exactly one ticket unit. Confirm contract ETH balance is unchanged (no refund).

**Outcome / oversight:** Manual balance checks aligned with on-chain `Transfer` event.

---

**Prompt 24**  
Clarify: vendor address does **not** need 100 tokens pre-minted — tokens are minted to buyers on purchase and only reach vendor via transfer. Where does Sepolia ETH from `buyTickets` go?

**Outcome / oversight:** Understood ETH held in contract until `withdrawEth()`; vendor receives ETIX only.

---

## §3 — Blockchain management (30%)

### §3.1 Smart contract architectural guidance (15%)

**Prompt 25**  
Implement **`TicketToken`**: OpenZeppelin **ERC-20** + **Ownable**; **`buyTickets(uint256)`** payable in native ETH at fixed `ticketPriceWei`; mint `ticketCount × 10^decimals` to buyer; revert if `msg.value` ≠ price × count.

**Outcome / oversight:** Meets ERC-20 + Sepolia native-ETH purchase extension (brief “SETH”).

---

**Prompt 26**  
Add **`MAX_TICKETS = 100`** enforced on `totalSupply` after mint. Emit events for purchase, price update, and vendor update. Use **Solidity 0.8.20** with **optimizer enabled** in Hardhat for gas-efficient deployment.

**Outcome / oversight:** Cap tested in Hardhat; redeployed to `0xC624…` with 100-ticket limit.

---

**Prompt 27** *(Added)*  
Review the contract for common issues: zero-address checks on vendor, exact ETH payment (no over/under pay), no unbounded mint, and safe ETH withdrawal pattern for owner. Flag anything that would fail a basic security review.

**Outcome / oversight:** `require` guards on vendor and payment; OpenZeppelin base contracts; no custom unchecked external calls beyond `withdrawEth`.

---

**Prompt 28**  
Guide me step-by-step to **deploy to Sepolia**: `.env` for RPC + private key, `npm run deploy:sepolia`, update frontend `deployed.inc.js`, fund buyer via faucet, run buy + transfer demos, and capture Etherscan links for the report.

**Outcome / oversight:** Deployment tx `0x9ce599be…`; documented addresses in `REPORT.md`.

---

**Prompt 29**  
Can we **redeploy** a new contract on Sepolia after changing the cap and UI naming? Explain implications for old contract address vs new `deployed.inc.js`.

**Outcome / oversight:** Redeployed; report distinguishes first deploy (`0xA8A28…`) vs final (`0xC624…`).

---

### §3.2 Project submission trace & structure (5%)

**Prompt 30**  
Apply a consistent frontend shell: home hub, left sidebar navigation, hamburger toggle **outside** the sidebar edge, aligned with Home link — same layout on every page.

**Outcome / oversight:** Cohesive DApp UX across five pages.

---

**Prompt 31**  
Remove unnecessary folders and files, but **keep** contracts, Hardhat config, `scripts/` (deploy/verify), tests, CI workflows, and frontend assets. Explain what each script in `scripts/` does before deleting anything.

**Outcome / oversight:** Lean repo suitable for Brightspace zip; deploy pipeline intact.

---

**Prompt 32**  
Clarify repo layout: Solidity/Hardhat at root is our “blockchain backend” even without a Node API server. Confirm `contracts/`, `test/`, `scripts/`, `frontend/` are the required submission structure.

**Outcome / oversight:** Final structure matches module expectations.

---

## §4 — Managerial oversight & QA (15%)

### §4.1 Human-authored documentation (5%)

**Prompt 33**  
Document in the **README**: how to install (`npm ci`, `uv sync`), run Hardhat tests, deploy to Sepolia, serve the frontend locally, and which env vars are required (`.env.example` only — never commit secrets).

**Outcome / oversight:** Reproducible setup for markers and future me.

---

**Prompt 34** *(Added)*  
For major JS modules (`wallet.js`, `blockchain.js`, `ticketing.js`, `transfer-to-vendor.js`), keep comments minimal but ensure **README + report** explain how config (`config.js` + `deployed.inc.js`) ties frontend to chain `11155111`.

**Outcome / oversight:** Integration story in `REPORT.md` §3.1, not scattered AI boilerplate in code.

---

### §4.2 Prompting for code efficiency (2.5%)

**Prompt 35** *(Added)*  
Enable the Hardhat **Solidity optimizer** (200 runs) for `TicketToken` deployment. Prefer `constant`/`immutable` where possible and avoid redundant storage reads in `buyTickets`.

**Outcome / oversight:** `hardhat.config.js` optimizer `enabled: true`; lean mint path in contract.

---

### §4.3 Proactive error handling (5%)

**Prompt 36**  
When implementing Sepolia features, never surface raw `error.data` or stack traces to end users. Map failures to short actionable messages (network, config, user reject, revert reason).

**Outcome / oversight:** Consistent `setStatus(message, isError)` across buy and transfer pages.

---

**Prompt 37**  
If `deployed.inc.js` is missing or contract address is zero, block purchases with a clear “deploy contract first” message instead of failing silently.

**Outcome / oversight:** Config guard in runtime config helper.

---

### §4.4 Comprehensive testing (5%)

**Prompt 38**  
Add **Vitest** UI tests for sidebar toggle and wallet page behaviour; I will run them in **GitHub Actions** on PRs. Review generated tests with me before I commit.

**Outcome / oversight:** `frontend/tests/ui/`; CI green on PR.

---

**Prompt 39**  
Add **Hardhat tests** for: constructor values, zero vendor revert, successful `buyTickets`, wrong ETH amount revert, **cap exceeded** revert, `setVendor`, `setTicketPriceWei`, and ERC-20 **transfer** to vendor.

**Outcome / oversight:** 15 tests in `test/TicketToken.test.js`; `npx hardhat test` passing.

---

**Prompt 40**  
Add tests for **any features still without coverage** (contract edge cases + frontend flows). Then review against the managerial rubric and list gaps I should fix manually.

**Outcome / oversight:** Expanded coverage; rubric gap list informed final manual testing on Sepolia.

---

## Appendix A — Managerial decisions (human, not AI)

| Decision | Rationale |
| --- | --- |
| MetaMask for funded **buyer**; generated wallets for **deployer/vendor** | One funded account; role separation for report txs |
| **Transfer to Vendor** not ETH refund | Matches brief; avoids misleading “return” language |
| **100 ticket cap** + redeploy | Finite event; new contract address in report |
| Keep **`deployments/`** + **`deployed.inc.js`** | Frontend must track live Sepolia address |
| **`REPORT.md` written separately** | Report graded under 3.3; this file is prompt evidence only |

---

## Appendix B — Excluded prompts (why)

| Excluded | Reason |
| --- | --- |
| “Is the project done?” / “get this project done” | Status checks, not managerial direction |
| “Build REPORT.md / prompt log from rubric” | Submission artefacts, not build oversight |
| Empty `<user_query>` with screenshots only | No instructive content |
| Duplicate full brief paste (×3) | Consolidated into Prompt 8 / 16 |
| `uv` install PATH error dump | Environment noise |
| This chat’s “combine all prompts” request | Meta — produces this document |

---

## Summary

| Metric | Value |
| --- | --- |
| **Submission prompts** | **40** (numbered §1–§4) |
| **Added for rubric clarity** | 6 (marked *Added*) |
| **Excluded from log** | ~20 meta/duplicate/noise messages |
| **Primary evidence elsewhere** | [`REPORT.md`](REPORT.md) (design + Etherscan txs), GitHub PR/commit history |

*This log is submitted as evidence for the **Students as Managers of AI** criterion. Peer review (10%) is a separate 200-word reflection.*
