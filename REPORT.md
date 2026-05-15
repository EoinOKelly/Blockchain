# Web3 Ticketing DApp — Project Report

Eoin O'Kelly · 24417491  
Blockchain, Year 2  
Repository: https://github.com/EoinOKelly/Blockchain  
Network: Ethereum Sepolia testnet

## 1. Introduction

For this assignment I built a small ticketing DApp on Sepolia. Attendees buy an ERC-20 token (ETIX) by sending test ETH to a smart contract. A doorman can open the balance page, enter an attendee’s wallet address, and see whether they hold at least one ticket. When the attendee enters the event, they send that token to the vendor’s address. No ETH is refunded — only the ticket token moves.

I used Cursor for scaffolding and debugging (especially MetaMask and Sepolia setup), but I deployed the contract, ran the demo wallets, and checked all transactions on Etherscan myself. A full list of my AI prompts is in `PROMPTS_SUBMISSION.md`.

## 2. Code overview

The project is a Hardhat backend with a static HTML/JavaScript frontend. There is no separate API server; the browser talks to Sepolia through MetaMask or a public RPC URL.

Main parts of the repo:

- `contracts/TicketToken.sol` — ERC-20 ticket token with a payable `buyTickets` function and a maximum of 100 tickets.
- `scripts/deploy.js` — deploys to Sepolia and updates `frontend/src/js/deployed.inc.js` with the contract and vendor addresses.
- `test/TicketToken.test.js` — Hardhat unit tests for the contract.
- `frontend/src/` — pages for creating a wallet, checking balances, buying a ticket, and transferring back to the vendor.

The contract mints one token per ticket (0 decimals). Purchasers call `buyTickets` with the correct amount of ETH. To hand in a ticket they call `transferTicketsToVendor`, which always sends tokens to the vendor address set at deploy time. ETH from sales stays in the contract until the owner runs `withdrawEth`. The frontend loads the deployed contract address from `deployed.inc.js` after each deploy.

### Testing

I used AI to help write the first tests, then expanded them myself as the contract and pages changed. Hardhat has **26 tests** on `TicketToken` — things like buying with the right amount of ETH, hitting the 100-ticket cap, `transferTicketsToVendor`, and owner-only functions. The frontend uses Vitest: **23 tests** across six files (wallet, balances, buy ticket, transfer to vendor, config, sidebar). GitHub Actions runs Hardhat tests, contract coverage, and the UI tests on every pull request. Before I submit I run `npx hardhat test` and `npm run test:ui` locally to make sure nothing is broken.

Commits follow Commitizen via `uv run cz commit`.

## 3. Design

The flow I tested end-to-end:

1. Deploy `TicketToken` and copy the address into the frontend config.
2. Fund wallets on Sepolia (faucet / simple ETH transfers).
3. Buyer connects MetaMask, buys one ticket on the buy page.
4. Doorman checks the buyer’s address on the balance page (ETIX balance ≥ 1).
5. Buyer uses the transfer page to send one ETIX to the vendor.

One balance page covers all three roles from the brief (attendee, doorman, venue). The only difference is which address you look up; I added a short explanation on that page.

Design choices:

- ERC-20 tickets because the brief requires it and `balanceOf` is straightforward for door checks.
- MetaMask for the paying buyer; separate generated wallets for deployer and vendor because I only had one funded MetaMask account.
- The UI says “Transfer to vendor” instead of “return” so it is obvious ETH is not sent back.
- A cap of 100 tickets to represent limited event capacity.
- A read-only RPC on the balance page so the doorman does not need to install or connect a wallet.

Limitations: viewing a balance does not invalidate a ticket — the attendee must transfer the token. There is no frontend for the owner to withdraw ETH. I redeployed once during development, so only the contract address in section 5 should be used for marking this report.

## 4. Development and code review

Work was merged through GitHub pull requests: https://github.com/EoinOKelly/Blockchain/pulls?q=is%3Apr+is%3Aclosed

| PR | Summary |
|----|---------|
| [#1](https://github.com/EoinOKelly/Blockchain/pull/1) | Initial UI, sidebar navigation, wallet page, UI tests, GitHub Actions, uv/Commitizen setup |
| [#2](https://github.com/EoinOKelly/Blockchain/pull/2) | Sepolia balance lookup and prompt log file |
| [#3](https://github.com/EoinOKelly/Blockchain/pull/3) | TicketToken contract, deploy script, buy-ticket page |
| [#4](https://github.com/EoinOKelly/Blockchain/pull/4) | Repository layout (Hardhat at root), expanded tests |
| [#5](https://github.com/EoinOKelly/Blockchain/pull/5) | 100-ticket cap, transfer-to-vendor page, final submission work |
| [#6](https://github.com/EoinOKelly/Blockchain/pull/6) |  harden TicketToken, full test coverage, and submission docs |

I used a branch per feature, opened a PR, waited for CI, then merged. That gave a clear history for the module’s code-review and traceability requirements.

## 5. Sepolia transaction evidence

All links below relate to the same deployment.

**Contract:** https://sepolia.etherscan.io/address/0xd67051f294e8ACEA08dcbDe513659f073cf06668

| Role | Address |
|------|---------|
| Deployer | 0x0c6C1ecBbE984F0fD853750049cb8E65423e1454 |
| Ticket purchaser | 0x9a4cEa190106435dF9059Ee063F43A1EF9fEfcCA |
| Vendor / doorman | 0x906b4a0773828D6528329ED486ae59F9e08cd5bf |

### Deployment

https://sepolia.etherscan.io/tx/0xb52d3916e4a6c0aca949f4e396b3c808ec5ca6c71a2dd9db59bd0054add0c4d0

Deployer `0x0c6C1…` created contract `0xd67051…`. Transaction succeeded. Constructor arguments set the vendor to `0x906b…` and the ticket price to 0.01 ETH.

### Contract creator wallet — ETH funding

https://sepolia.etherscan.io/tx/0x877150f24d03ff0e8d06604688f5ac8d122fb77ec279ee6e274710bc9f48903b

Plain ETH transfer of 0.064 ETH into the deployer wallet so it had enough Sepolia ETH for gas before deployment.

### Buy a token

https://sepolia.etherscan.io/tx/0x27a12c9bac702e95c53657561a544df020035127e2bd7a7eee067aef62dbca96

Purchaser `0x9a4cEa…` called `buyTickets(1)` on the contract, sent 0.01 ETH, and received 1 ETIX. The `TicketPurchased` event appears in the transaction logs.

### Transfer ticket to vendor

https://sepolia.etherscan.io/tx/0xbbdd3d45aca0fbafaa458041023119c4535cab9f14c30a176f543132c8bd73c9

Purchaser called `transferTicketsToVendor(1)`. One ETIX moved from the buyer to the vendor address `0x906b…`. No ETH was transferred.

### Ticket purchaser wallet — ETH funding

The buyer wallet already held Sepolia ETH before the purchase (faucet and earlier transfers). Example funding transactions on that address:

- https://sepolia.etherscan.io/tx/0x8097c1ecf19d619169514740de30b4bfe885b7f91aca2493e517d26f184372e0
- https://sepolia.etherscan.io/tx/0x7d32053b8e258785d3c6d3664bb7ef1bb1cb8d0cf34ea5f38544adc06a9da9db

The vendor wallet received ETIX from the transfer transaction above; it did not require a separate ETH top-up for this demo.

## 6. Running the project locally

From the repository root:

```
npm ci
npx hardhat test
cp .env.example .env
npm run deploy:sepolia
```

Serve the frontend from `frontend/src` (for example `npx serve . -p 5173`) and open `http://localhost:5173/pages/buy-ticket.html`. MetaMask must be on Sepolia. The site needs to be served over HTTP, not opened as a local file, or the wallet extension will not inject.

## 7. Use of AI

I used Cursor to generate initial file structure, some tests, and explanations when I was stuck. I reviewed and changed the output where needed (naming, ticket cap, contract functions, Sepolia config). This report and the Etherscan links reflect what I actually ran on testnet.

## References

Sepolia Etherscan, OpenZeppelin Contracts, ethers.js v6 documentation, module assignment brief.
