# Backend — TicketToken (Hardhat)

Solidity ERC-20 (`TicketToken`) with **`buyTickets`** payable on Sepolia test ETH and **`withdrawEth`** for the owner.

## Setup

```powershell
cd backend
npm ci
npx hardhat test
```

Copy `.env.example` to `.env` and set `SEPOLIA_RPC_URL`, `PRIVATE_KEY`, optional `VENDOR_ADDRESS`, optional `TICKET_PRICE_ETH`.

## Deploy to Sepolia

```powershell
npx hardhat run scripts/deploy.js --network sepolia
```

This writes:

- `deployments/chain-<id>-TicketToken.json`
- `../frontend/src/js/deployed.inc.js` — paste-free wiring for the HTML frontend (`ticketTokenAddress`, `vendorAddress`, `ticketPriceWei`)

Optional verification on Etherscan (after deployment):

```powershell
$env:CONTRACT_ADDRESS="0xYourDeployedAddress"
npx hardhat run scripts/verify.js --network sepolia
```

Set `ETHERSCAN_API_KEY`, `TICKET_PRICE_ETH`, `VENDOR_ADDRESS`, and `PRIVATE_KEY` to match the deployment constructor args.
