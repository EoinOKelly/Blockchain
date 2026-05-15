# My Cursor AI Prompts — Blockchain Project (Eoin O'Kelly, 24417491)

Prompt 1

init this folder in my repo: https://github.com/EoinOKelly/Blockchain.git commit message is just init repo

Prompt 2

dont say made with cursor

Prompt 3

this is the project I am working on, to begin can you please build out the folder and file structure of the repo for both backend and frontend, no code implemented yet

Description
Create a Web3 Distributed Application (DApp) that implements simple ticketing system.  You should use the Ethereum Sepolia Testnet as you blockchain for Solidity smart contract deployments,  and HTML, CSS and Javascript for your front end.  You are free to use any development environments that you are comfortable with, however examples in this module will be demonstrated using Visual Studio Code and the Online Remix Solidity compiler and deployment tool.

 

Requirements
Front End:
Page allowing a user to create a wallet.
Should provide the ability to download the created wallet.
Should display wallet details once created.
Page allowing a user to check their current crypto and ticket token balance.
To be used by the following actors:
Person attending the event so that they can confirm their purchase.
Doorman, so they can confirm a wallet is the holder of the ticket.
Venue, so they can check on distribution of tickets
Page allowing a user to buy a ticket (token).
Page allowing a user to transfer a ticket back to the vendor.
Blockchain Backend:
Smart contract implementing the ERC-20 standard and extended to allow tickets to be purchased using the native cryptocurrency of Sepolia (SETH)
Project should be submitted as a zipped solution via Brightspace
The project should be accompanied by a report detailing the following:
Code overview.
Design description.
Links to transactions on Sepolia’s blockchain explorer showing:
A successful deployment of your contract
A successful execution of your contract to buy a token
A successful topping up of separate wallets for:
Contract creator
Ticket Purchaser
Vendor / Doorman
Peer Review:  3 Weeks Prior to submission you will engage in a peer review session with a colleague which you will document and submit

Prompt 4

I will likely not use all of these files but I prefer to start with a file structure and delete if needed so I dont forget to implement specific things. Can you add a basic html js css page that lets a user create a wallet, download it as a file, and show the wallet details on screen once its created

Prompt 5

what is happening in this line <script src="https://cdn.jsdelivr.net/npm/ethers@6.13.2/dist/ethers.umd.min.js"></script> ? also I noticed "use strict" at the top of wallet.js, what does that do? and does ethers.Wallet.createRandom() actually create a secure random wallet?

Prompt 6

why is ethers loaded in the html file instead of importing it in the js file?

Prompt 7

for the create wallet page - is it ok to show the private key on screen for a college testnet project or should we add a warning that this is only for sepolia practice and not how youd do it in production?

Prompt 8

okay can you build out the boilerplate for every html page and create one central navigation page, with a sidebar on the left for quick nav. add a hamburger icon in a different colour near the top right of the sidebar area to open and close it

Prompt 9

centralise the hamburger icon in the button and have it sitting on the outside edge of the sidebar not inside it

Prompt 10

add a bit more margin on the right of the hamburger so theres more gap before the main content, and line it up with the home button

Prompt 11

I fixed the layout myself with left margin on main content. next can you add some UI unit tests, I want to run them in github actions on my PR - im not too used to actions so explain how to set that up

Prompt 12

read over the tests, they seem like a good starting point - give me a branch name and commit message that works with commitizen for semantic versioning

Prompt 13

I dont want commitizen installed globally, can we use uv dev dependencies for commitizen instead and document in the README how to run uv sync and cz commit. one readme for the whole repo is fine right?

Prompt 14

add a gitignore for node_modules and .env, and tell me if uv.lock should be committed or ignored

Prompt 15

how do i configure github actions in this repo?

Prompt 16

have a look at my brief again - im not sure if I actually need a separate backend folder or if contracts at the root is enough

Prompt 17

Set up the balances page so I can paste any address and see sepolia ETH balance and the ticket token balance. add a short note on the page for how an attendee, doorman, and venue would each use this same page

Prompt 18

Can you implement the js for the balances / ticket check side of things - the brief says one page for checking crypto and ticket balance for the person attending, the doorman checking a wallet has a ticket, and the venue checking distribution

Prompt 19

how does all of this actually connect to sepolia - whats the workflow from creating a wallet here to having something on testnet that can buy tickets and check balances?

Prompt 20

when I create a wallet here how do I actually use it on sepolia testnet - do I import it into metamask and get faucet eth?

Prompt 21

so a wallet address is valid even before it has eth on chain right? how does metamask and the rpc stuff fit together, like what api are we calling from the frontend?

Prompt 22

help me plan the next steps - contract design for buying tickets with sepolia eth, frontend wiring, and any cleanup. how should buy and transfer back to vendor work in code?

Prompt 23

i like this plan, follow the brief and implement it. use openzeppelin for erc20, delete any frontend/backend folders we dont need anymore

Prompt 24

implement the plan

Prompt 25

for TicketToken use openzeppelin ERC20 and Ownable, payable buyTickets minting tokens when the user sends the right amount of sepolia eth. enable the solidity optimizer in hardhat to keep deploy and mint gas reasonable

Prompt 26

review the contract for obvious security stuff - zero address checks, exact eth payment, dont mint over the cap, and safe way for owner to withdraw eth from the contract

Prompt 27

before I test on sepolia add proper error messages on buy ticket for: no metamask, wrong network, contract not deployed, not enough eth, user rejects tx, and contract reverts like ticket cap exceeded. dont show raw rpc errors to the user

Prompt 28

implement the buy ticket page properly - connect metamask, check sepolia network, show price and balances, call buyTickets(1), show tickets remaining and link to etherscan after success

Prompt 29

I am getting "No wallet extension detected. Install MetaMask or similar." when I try connect on the buy ticket page - what should I check?

Prompt 30

what does prettier do, explain how the smart contract buy flow works, and why am I getting "Please switch your wallet to the Sepolia network" when im on metamask with eth showing

Prompt 31

I cant find a separate sepolia address in metamask - only one eth address but the balance looks right, is that normal?

Prompt 32

build the transfer ticket back to vendor page with erc20 transfer to the vendor address from config. make it very clear they are only sending the token back and not getting eth refunded

Prompt 33

after someone transfers to vendor I want to be able to check on balances page that purchaser ETIX went down and vendor ETIX went up by one ticket

Prompt 34

so at the event entrance how does the vendor confirm a ticket and stop reuse - should they have all 100 tokens minted to them at the start?

Prompt 35

change the return wording to transfer to vendor because return sounds like you get eth back. also add a max of 100 tickets in circulation on the contract if thats possible

Prompt 36

add hardhat tests for buying with correct eth, wrong eth amount, exceeding the 100 ticket cap, zero vendor on deploy, and erc20 transfer to vendor

Prompt 37

should the vendor address have 100 ticket tokens already if its "giving them out"? im confused where minting happens

Prompt 38

when someone buys a ticket where does the sepolia eth actually go - vendor wallet or the contract?

Prompt 39

so you can redeploy a new contract on sepolia if we change the cap? what happens to the old address in the frontend

Prompt 40

guide me step by step to finish the project on sepolia - deploy contract, update frontend config, fund wallets, buy a ticket, transfer to vendor, and what txs I need for the report

Prompt 41

I have one metamask account with sepolia eth already - I think that should be the buyer. I still need addresses for deployer and vendor, can I use the create wallet page for those and how should I split the roles?

Prompt 42

go through changes since last commit and give me a branch name plus cz commit steps for a new PR

Prompt 43

how do I cz commit this, also keep in mind that this commit also contains the view balance edition

Prompt 44

give me a valid branch name for this content aswell please

Prompt 45

give me a branch name and commit message for all the contract and frontend work

Prompt 46

make sure semantic versioning with cz commit is set up right and bumping properly on commits

Prompt 47

clean up unnecessary folders but keep contracts, scripts, tests, deployments, github workflows and the frontend. explain what deploy.js and verify.js do before removing anything

Prompt 48

how is the app deployed to sepolia right now and how does deployed.inc.js get the contract address into the frontend?

Prompt 49

add more tests anywhere we are missing coverage - contract edge cases and the main frontend flows

Prompt 50

review unstaged changes, suggest a branch name and the full cz commit message for everything not committed yet

Prompt 51

run through the managerial rubric for this module and add any missing tests or prompts-level gaps you see - especially test coverage and error handling

Prompt 52

document in the README how to install deps, run hardhat test, deploy to sepolia, and serve the frontend locally with the right env vars from .env.example

Prompt 53

my peer reviewed my TicketToken contract and found some issues - withdrawEth uses .transfer() which can fail for contract wallets, setTicketPriceWei can be set to 0 so people mint for free, exact eth only means overpay reverts with no refund, vendor isnt enforced on chain for returns, and 18 decimals lets you transfer half a ticket. can you fix these in the contract and update tests?

Prompt 54

peer also said my .env.example rpc url was broken (dns fail on sepolia deploy) and readme was windows only - fix .env.example with a working public sepolia rpc and add mac/linux steps next to powershell

Prompt 55

add natspec comments on withdrawEth setVendor and setTicketPriceWei not just buyTickets, and run npm audit fix on anything safe before submission

Prompt 56

for returning tickets use a transferTicketsToVendor function that always sends to the vendor address in the contract, then wire the frontend transfer page to call that instead of generic erc20 transfer so our tests match what the brief actually means

Prompt 57

after peer review changes redeploy isnt automatic - remind me what I need to run again and that old sepolia contract address wont have the fixes until I deploy fresh

Prompt 58

go through all unstaged changes in the repo and give me one final branch name and commit message using cz commit to complete this project