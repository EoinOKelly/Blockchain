# Prompt submission log (AI use — managerial assessment)

This file lists **verbatim** user prompts from Cursor chat transcripts for this project, grouped by chat. Each prompt includes a **short reframing**—the same intent in clearer *managerial oversight* language for markers (aligned with **Students as Managers of AI**). It does **not** replace your written report or peer-review reflection.

## How this maps to the managerial rubric (quick index)

| Criterion (summary) | What to point to in this log | Example chat IDs |
| --- | --- | --- |
| **1. Process oversight & traceability** | Branch/commit conventions, Commitizen, GitHub Actions, `uv` tooling | `02c72c07`, `16c5b5f1`, `ced3ddb1` |
| **2.1 Wallet creation** | Generate, display, download; understanding of ethers / strict mode | `16c5b5f1` |
| **2.2 Balance checks (actor roles)** | One UI: arbitrary address for attendee / doorman / venue | `16c5b5f1`, `33610894`, `d232ccf7` |
| **2.3–2.4 Purchase & return** | Buy flow, contract alignment, transfer back to vendor | `d232ccf7`, `4f8e4297` |
| **3.1 Smart contract** | ERC-20 + native ETH purchase; Hardhat, tests, deploy | `4f8e4297`, `16c5b5f1` |
| **3.2–3.3 Structure & report support** | Repo layout; evidence (explorer links) implied by workflow prompts | `16c5b5f1`, `4f8e4297` |
| **4. Testing & QA** | Vitest UI tests + CI; Hardhat tests; error-handling/debug prompts | `16c5b5f1`, `4f8e4297`, `d232ccf7` |

*Peer review (10%):* submit your 200-word reflection separately; use this log only as evidence of AI dialogue traceability.

---

## Chat: [Git init & first push](ced3ddb1-9e63-4669-9033-39341d77395f)

### Prompt 1

*Timestamp:* Wednesday, Apr 29, 2026, 12:40 PM (UTC+1)

**Verbatim**

> init this folder in my repo: https://github.com/EoinOKelly/Blockchain.git  commit message is just init repo

**Reframed for assessment (same intent)**

> Initialize git, add the GitHub remote, and create the first commit with the specified message.

### Prompt 2

*Timestamp:* Wednesday, Apr 29, 2026, 12:41 PM (UTC+1)

**Verbatim**

> dont say made with cursor

**Reframed for assessment (same intent)**

> Ensure commit metadata contains only the student-authored message.

## Chat: [Scaffold, wallet UI, tests & tooling](16c5b5f1-e618-4177-9680-e5549ade6ef5)

### Prompt 1

*Timestamp:* Wednesday, Apr 29, 2026, 1:05 PM (UTC+1)

**Verbatim**

> Description
> Create a Web3 Distributed Application (DApp) that implements simple ticketing system.  You should use the Ethereum Sepolia Testnet as you blockchain for Solidity smart contract deployments,  and HTML, CSS and Javascript for your front end.  You are free to use any development environments that you are comfortable with, however examples in this module will be demonstrated using Visual Studio Code and the Online Remix Solidity compiler and deployment tool.
> 
>  
> 
> Requirements
> Front End:
> Page allowing a user to create a wallet.
> Should provide the ability to download the created wallet.
> Should display wallet details once created.
> Page allowing a user to check their current crypto and ticket token balance.
> To be used by the following actors:
> Person attending the event so that they can confirm their purchase.
> Doorman, so they can confirm a wallet is the holder of the ticket.
> Venue, so they can check on distribution of tickets
> Page allowing a user to buy a ticket (token).
> Page allowing a user to transfer a ticket back to the vendor.
> Blockchain Backend:
> Smart contract implementing the ERC-20 standard and extended to allow tickets to be purchased using the native cryptocurrency of Sepolia (SETH)
> Project should be submitted as a zipped solution via Brightspace
> The project should be accompanied by a report detailing the following:
> Code overview.
> Design description.
> Links to transactions on Sepolia’s blockchain explorer showing:
> A successful deployment of your contract
> A successful execution of your contract to buy a token
> A successful topping up of separate wallets for:
> Contract creator
> Ticket Purchaser
> Vendor / Doorman
> Peer Review:  3 Weeks Prior to submission you will engage in a peer review session with a colleague which you will document and submit
>   this is the project I am working on, to begin can you please build out the folder and file structure of the repo for both backend and frontend, no code implemented yet

**Reframed for assessment (same intent)**

> Scaffold backend (contracts, deploy, tests) and frontend (pages, assets) with placeholders only until implementation begins.

### Prompt 2

*Timestamp:* Wednesday, Apr 29, 2026, 1:10 PM (UTC+1)

**Verbatim**

> I will likely not use all of these files but I prefer to start with a file strucutre and delete if needed so I dont forget to implement specific things, to begin can you add a very basic html js css frontend page that allows a y=user to create a wallet, this page should allow the user to download the wallet and display the wallet details once created

**Reframed for assessment (same intent)**

> Implement the wallet page with client-side generation, on-screen details, and JSON download—then review implications of displaying sensitive material.

### Prompt 3

*Timestamp:* Wednesday, Apr 29, 2026, 1:17 PM (UTC+1)

**Verbatim**

> <script src="https://cdn.jsdelivr.net/npm/ethers@6.13.2/dist/ethers.umd.min.js"></script> what is happening in this line of code? also I noticed ""use strict";" at the top of wallet.js, I havent seen this before what is it for/what does it mean? does  const wallet = ethers.Wallet.createRandom(); just create a fully random wallet?

**Reframed for assessment (same intent)**

> Clarify how the CDN bundle, strict mode, and `Wallet.createRandom()` fit the architecture.

### Prompt 4

*Timestamp:* Wednesday, Apr 29, 2026, 1:18 PM (UTC+1)

**Verbatim**

> why is eithers loaded in html instead of js?

**Reframed for assessment (same intent)**

> Explain why ethers is loaded via an HTML `<script>` tag in a static, no-bundler setup.

### Prompt 5

*Timestamp:* Wednesday, Apr 29, 2026, 1:22 PM (UTC+1)

**Verbatim**

> okay can you build our the boiler plate for every html page and create 1 central navigation page to navigate between them, I would also like a side bar on the left side for quick navigation between pages, add this with a hamburger icon in a different colour somewhere in the top 20% of the right side of the side bar to open and close the sidebar

**Reframed for assessment (same intent)**

> Apply a consistent shell across pages: central navigation, left sidebar, and hamburger toggle per layout spec.

### Prompt 6

*Timestamp:* Wednesday, Apr 29, 2026, 1:26 PM (UTC+1)

**Verbatim**

> centralise the hamburger icon within the square and have it anchored to the outside of the sidebar not inside of it

**Reframed for assessment (same intent)**

> Apply a consistent shell across pages: central navigation, left sidebar, and hamburger toggle per layout spec.

### Prompt 7

*Timestamp:* Wednesday, Apr 29, 2026, 1:29 PM (UTC+1)

**Verbatim**

> add a little bit more of a margin on the right of the hamburger icon to increase the gap between it and the content and put it inline with the home button

**Reframed for assessment (same intent)**

> Fine-tune spacing and vertical alignment of the sidebar toggle relative to the Home link.

### Prompt 8

*Timestamp:* Wednesday, Apr 29, 2026, 1:35 PM (UTC+1)

**Verbatim**

> I just fixed it myself by adding left margin to the main content in the css, next could you add some UI unit tests please, I will run this using github actions on my pr, im not too used to setting up github actions so can you give me a brief guide on this please

**Reframed for assessment (same intent)**

> Add frontend unit tests and document GitHub Actions running them on pull requests.

### Prompt 9

*Timestamp:* Wednesday, Apr 29, 2026, 1:43 PM (UTC+1)

**Verbatim**

> read over the tests, they seem like a great starting point, give me a good branch name and commit message, let me use comiizen so I can implement semantic versioning

**Reframed for assessment (same intent)**

> Suggest branch and commit text compatible with Commitizen and semantic versioning.

### Prompt 10

*Timestamp:* Wednesday, Apr 29, 2026, 1:46 PM (UTC+1)

**Verbatim**

> what is the command to install comitizen and make sure to add the functionality to iterate through semantic version numbers as i make commits using cz, this should be part of the PR pipeline i believe (correct me if I am wrong)

**Reframed for assessment (same intent)**

> Clarify Commitizen versus release/version-bump tooling and what belongs in PR CI versus release.

### Prompt 11

*Timestamp:* Wednesday, Apr 29, 2026, 1:48 PM (UTC+1)

**Verbatim**

> actually I dont want to install comitizen can we instead add uv with a uv dev option for comitizen and other possible dev dependencies, im sure down the road I will need to install other dependencies that can fall under a different uv command that is not dev, include this in the README documentation, also not sure if i need multiple readme's would 1 general readme suffice for this project?

**Reframed for assessment (same intent)**

> Manage dev tools via `uv` dependency groups and document runtime vs dev installs in the README.

### Prompt 12

*Timestamp:* Wednesday, Apr 29, 2026, 1:53 PM (UTC+1)

**Verbatim**

> ut of curiosity, pyproject.toml is for python right, I plan on using python for backend at the moment so this is not an issue, but in general how doesthis work, dependencies exist throughout the repo for the likes of commitizen so thats not an issue but are there situations where it only works for python but not for js and theres an equavalent that is used in js or maybe c++ ect

**Reframed for assessment (same intent)**

> Explain Python versus JavaScript package manifests in a polyglot repository.

### Prompt 13

*Timestamp:* Wednesday, Apr 29, 2026, 1:55 PM (UTC+1)

**Verbatim**

> okay that sounds good, thanks, now just add a gitignore for node modules and I will be ready to commit

**Reframed for assessment (same intent)**

> Exclude `node_modules` and common local artefacts from version control before committing.

### Prompt 14

*Timestamp:* Wednesday, Apr 29, 2026, 1:59 PM (UTC+1)

**Verbatim**

> it has been a while since I have used uv to be honest, just double checking if it the right option for this project, what are the alternatives? if UV what is the command to install it?

**Reframed for assessment (same intent)**

> Evaluate `uv` against alternatives and provide the official install command.

### Prompt 15

*Timestamp:* Wednesday, Apr 29, 2026, 2:02 PM (UTC+1)

**Verbatim**

> uv --version

**Reframed for assessment (same intent)**

> Restated for assessment: uv --version

### Prompt 16

*Timestamp:* Wednesday, Apr 29, 2026, 2:02 PM (UTC+1)

**Verbatim**

> powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
> downloading uv 0.11.8 (x86_64-pc-windows-msvc)
> installing to C:\Users\eoino\.local\bin
>   uv.exe
>   uvx.exe
>   uvw.exe
> everything's installed!
> 
> To add C:\Users\eoino\.local\bin to your PATH, either restart your shell or run:
> 
>     set Path=C:\Users\eoino\.local\bin;%Path%   (cmd)
>     $env:Path = "C:\Users\eoino\.local\bin;$env:Path"   (powershell)
> PS C:\Users\eoino\Year2\Blockchain> uv --version
> uv : The term 'uv' is not recognized as the name of a cmdlet, function, script file, or operable 
> program. Check the spelling of the name, or if a path was included, verify that the path is correct    
> and try again.
> At line:1 char:1
> + uv --version
> + ~~
>     + CategoryInfo          : ObjectNotFound: (uv:String) [], CommandNotFoundException
>     + FullyQualifiedErrorId : CommandNotFoundException

**Reframed for assessment (same intent)**

> Diagnose PATH after installing `uv` on Windows PowerShell.

### Prompt 17

*Timestamp:* Wednesday, Apr 29, 2026, 2:03 PM (UTC+1)

**Verbatim**

> I add uv lock to git ignore dont I ?

**Reframed for assessment (same intent)**

> Confirm lockfile policy: commit `uv.lock` for reproducible installs.

### Prompt 18

*Timestamp:* Wednesday, Apr 29, 2026, 2:04 PM (UTC+1)

**Verbatim**

> okay now just give me the final branch name and commit message and i will checkout and commit

**Reframed for assessment (same intent)**

> Provide ready-to-use branch and commit strings before pushing.

### Prompt 19

*Timestamp:* Wednesday, Apr 29, 2026, 3:55 PM (UTC+1)

**Verbatim**

> how do i configure my github actions in the repo?

**Reframed for assessment (same intent)**

> Explain how workflow YAML under `.github/workflows` configures CI triggers and jobs.

### Prompt 20

*Timestamp:* Wednesday, Apr 29, 2026, 4:39 PM (UTC+1)

**Verbatim**

> have a look back at my brief now please, on 2nd look im not actually sure if I need backend in my file structure

**Reframed for assessment (same intent)**

> Clarify that smart-contract code belongs in a backend folder even without a traditional API server.

## Chat: [Buy-ticket JS & Sepolia workflow](d232ccf7-586f-4932-bb51-e320e70ab100)

### Prompt 1

*Timestamp:* Wednesday, Apr 29, 2026, 4:42 PM (UTC+1)

**Verbatim**

> Can you fully implement the js for the rest of buy-ticket, this is the description: Page allowing a user to check their current crypto and ticket token balance.
> To be used by the following actors:
> Person attending the event so that they can confirm their purchase.
> Doorman, so they can confirm a wallet is the holder of the ticket.
> Venue, so they can check on distribution of tickets

**Reframed for assessment (same intent)**

> Complete buy-ticket JavaScript: wallet connection, Sepolia checks, ETH and token balances, and flows for attendee, doorman, and venue use cases.

### Prompt 2

*Timestamp:* Wednesday, Apr 29, 2026, 4:48 PM (UTC+1)

**Verbatim**

> how is this all linking in back to sepolia, like what does the workflow look like from randomly creating a wallet to actually having a wallet on the sepolia network that allows you to buy tickets and check your balanct ect

**Reframed for assessment (same intent)**

> Request an end-to-end narrative from wallet creation to a funded Sepolia wallet and on-chain interactions.

### Prompt 3

*Timestamp:* Wednesday, Apr 29, 2026, 5:14 PM (UTC+1)

**Verbatim**

> When I create a wallet I want to be able to put that wallet on to the sepolia network I am using the "Ethereum Sepolia Testnet as you blockchain for Solidity smart contract deployments"

**Reframed for assessment (same intent)**

> Define onboarding: import into MetaMask, select Sepolia, fund via faucet, verify on an explorer.

### Prompt 4

*Timestamp:* Wednesday, Apr 29, 2026, 5:21 PM (UTC+1)

**Verbatim**

> so wallets dont actually exist on the network until they actually have eth on them right? but they can be logged into via metamask if set up like this, is their a specific api being used or how exactly does this work?

**Reframed for assessment (same intent)**

> Clarify address validity versus on-chain activity and how MetaMask and JSON-RPC fit together.

### Prompt 5

**Verbatim**

> I am getting the error "No wallet extension detected. Install MetaMask or similar." when I go to connect my sepolia wallet on this page

**Reframed for assessment (same intent)**

> Debug missing `window.ethereum` (serving over HTTP vs `file://`, browser, extensions).

## Chat: [Sepolia balances page](33610894-fc87-4999-aa04-ef6e500455c3)

### Prompt 1

*Timestamp:* Thursday, Apr 30, 2026, 5:23 PM (UTC+1)

**Verbatim**

> Set up the balances page so that I can put my address in and view my current sepolia balance

**Reframed for assessment (same intent)**

> Implement read-only Sepolia ETH (and later token) lookup by wallet address on the balances page.

## Chat: [Plan & implement TicketToken DApp](4f8e4297-343d-4eee-a0ad-5fe1e661c33a)

### Prompt 1

**Verbatim**

> help me plan out the next steps forward for this project such as QoL changes, necesary reformating and how the contract for the buy/refun ticket can work and be maintained programatically

**Reframed for assessment (same intent)**

> Plan QoL, formatting, and a maintainable contract-driven buy/refund architecture.

### Prompt 2

**Verbatim**

> Objectives
> Learn the mechanics of a blockchain distributed application.
> Gain a foundation in Solidity,  a smart contract programming language.
> Through practice, gain a appreciation of the applications of blockchain beyond cryptocurrency.
> Description
> Create a Web3 Distributed Application (DApp) that implements simple ticketing system.  You should use the Ethereum Sepolia Testnet as you blockchain for Solidity smart contract deployments,  and HTML, CSS and Javascript for your front end.  You are free to use any development environments that you are comfortable with, however examples in this module will be demonstrated using Visual Studio Code and the Online Remix Solidity compiler and deployment tool.
> 
>  
> 
> Requirements
> Front End:
> Page allowing a user to create a wallet.
> Should provide the ability to download the created wallet.
> Should display wallet details once created.
> Page allowing a user to check their current crypto and ticket token balance.
> To be used by the following actors:
> Person attending the event so that they can confirm their purchase.
> Doorman, so they can confirm a wallet is the holder of the ticket.
> Venue, so they can check on distribution of tickets
> Page allowing a user to buy a ticket (token).
> Page allowing a user to transfer a ticket back to the vendor.
> Blockchain Backend:
> Smart contract implementing the ERC-20 standard and extended to allow tickets to be purchased using the native cryptocurrency of Sepolia (SETH)
> Project should be submitted as a zipped solution via Brightspace
> The project should be accompanied by a report detailing the following:
> Code overview.
> Design description.
> Links to transactions on Sepolia’s blockchain explorer showing:
> A successful deployment of your contract
> A successful execution of your contract to buy a token
> A successful topping up of separate wallets for:
> Contract creator
> Ticket Purchaser
> Vendor / Doorman
> Peer Review:  3 Weeks Prior to submission you will engage in a peer review session with a colleague which you will document and submit
>   i like this plan but follow up this brief, feel free to delete and backend or frontend files or foldefrs that are not needed

**Reframed for assessment (same intent)**

> Align implementation with the full brief and remove unused scaffolding once replacements exist.

### Prompt 3

**Verbatim**

> implement the plan

**Reframed for assessment (same intent)**

> Execute the agreed plan: ERC-20 with payable purchase, frontend wiring, deployment artefacts, and CI updates.

### Prompt 4

**Verbatim**

> what does prettier do, give me more info on how exactly the smart contract works and explain why I am getting "Please switch your wallet to the Sepolia network.". I am using the eth account on meta mask

**Reframed for assessment (same intent)**

> Explain Prettier versus linters, summarise contract purchase behaviour, and interpret the Sepolia network check error.

### Prompt 5

**Verbatim**

> I cant find a sepolia address on meta mask, only the eth address but the eth address shows the correct balance

**Reframed for assessment (same intent)**

> Clarify that wallet addresses are shared across networks while balances are network-specific.

### Prompt 6

**Verbatim**

> go through all changes made since last commit and give me a new branch name and then cz commit steps to make a new pr

**Reframed for assessment (same intent)**

> Summarise changes since the last commit; propose a branch name and Commitizen steps for a PR.

## Chat: [Prompt log, commits & rubric](02c72c07-e536-434f-9dd6-4b734d2660d9)

### Prompt 1

*Timestamp:* Thursday, Apr 30, 2026, 9:55 PM (UTC+1)

**Verbatim**

> create a md file that has every prompt I give you in it, if possible add all of my past prompts in this repo to it aswell, I need to submit all of my prompts for this project, also seperate and title which chat each was in please

**Reframed for assessment (same intent)**

> Maintain a single Markdown audit trail of all prompts, grouped by chat, for submission evidence and traceability.

### Prompt 2

**Verbatim**

> i want to make another commit, give me a branch name and a commit message please

**Reframed for assessment (same intent)**

> Request a conventional branch name and commit message appropriate for the staged changes.

### Prompt 3

**Verbatim**

> how do I cz commit this, also keep in mind that this commit also contains the view balance edition

**Reframed for assessment (same intent)**

> Use Commitizen for this commit; scope the message to include both the Sepolia balance work and any documentation updates.

### Prompt 4

**Verbatim**

> give me a valid branch name for this content aswell please

**Reframed for assessment (same intent)**

> Provide a git-valid branch name that reflects the combined documentation and frontend balance updates.

### Prompt 5

**Verbatim**

> update it with all prompts now, follow the rubric, this result is based off of my use of ai, so if you can improve how my prompts are worded that would be great, dont over do it but try maximise my grade Blockchain Project Grading Rubric
> Peer Review (10%)
> 
> Review one another’s code.  Provide a 200 word reflective piece on:
> a) Findings in peers code (4%)
> b) Findings peers found in your code (4%)
> c) The code review experience in general (2%)
> 
>  
> 
> Managerial Grading Rubric ("Students as Managers of AI") (30%)
> Criterion (Weight)	A1 (≥75%) (Exceptional/Strong)	B2 (60–64%) (Competent/Developing)	C3 (40–44%) (Marginal Pass)	F (<30%) (Failure)
> 1. AI-ENHANCED CODE REVIEW PROCESS (25%)				
> Process Oversight & Traceability (25%)	Logs demonstrate proactive guidance of the AI to meet review standards (e.g., prompting for specific commit messages or PR structure). Full traceability is maintained across all four steps (PR, comments, resolution, commit hash link).	Review process is functional but primarily reactive. Links and traceability are present but may be missing key stages (e.g., the commit hash for resubmission). Student relies on AI for review summaries.	Traceability is severely broken, indicating a failure to manage the submission workflow. The process is incomplete, or human fixes were required without proper documentation.	The review process is non-existent, or the core submission/review steps were entirely skipped.
> 2. FRONT END VALIDATION & ARCHITECTURE (30%)				
> 2.1 Wallet Creation Oversight (5%)	Prompts ensure all three requirements are met and include security validation of the AI's approach to key management and download/display.	Prompts guide the AI to implement all three wallet features functionally. Validation confirms basic operation but lacks deep security review.	Prompts focus primarily on key generation. Download or display features are minimal or required substantial human fixes.	Wallet creation is incomplete or the generated code fails key features (e.g., keys cannot be securely downloaded).
> 2.2 Balance Check Logic & Validation (10%)	Prompts establish resilient and distinct logic for all three actor roles (attendee, doorman, venue). Validation is comprehensive, guaranteeing real-time accuracy and data integrity across edge cases.	Prompts clearly guide the AI to implement distinct logic paths for the three roles. Validation confirms basic functionality and display accuracy.	Prompts establish basic logic for roles, but distinctions are blurred, or the display is sometimes inaccurate/delayed, requiring minor human cleanup.	Actor roles lack functional distinction, or the balance display is frequently inaccurate due to flawed data retrieval logic.
> 2.3 Ticket Purchase Transaction Flow (10%)	Prompts explicitly anticipate and manage all possible states, errors (e.g., revert reasons), and UX requirements for the purchase flow. High-quality, human-refined UX.	Prompts successfully guide the AI to implement the entire successful transaction process and basic error paths. Interface is user-friendly.	Transaction flow is implemented but lacks robust state management or comprehensive error handling. Interface is functional but aesthetically poor.	Transaction flow is incomplete or frequently breaks down. The interface is difficult to use, showing a failure to prompt for UX quality.
> 2.4 Token Transfer Validation (5%)	Prompts specifically detail the logic for transferring tokens back to the vendor and include verification steps to guarantee the correct update of token and contract balances.	Prompts successfully implement the transfer logic and the student verifies the correct update of token balances post-transfer.	Transfer logic is functional but required human input to correctly handle the "transfer back" requirement, or balance updates were only superficially checked.	Transfer functionality is flawed, or the token balances fail to update correctly in the contract state.
> 3. BLOCKCHAIN MANAGEMENT & REPORTING (30%)				
> 3.1 Smart Contract Architectural Guidance (15%)	Prompts demonstrate expert-level knowledge of both ERC-20 and the SETH extension logic, demanding specific security patterns (e.g., Reentrancy Guards) and gas-efficient implementation.	Prompts successfully guide the AI to produce a contract meeting all ERC-20 requirements and implements the specified SETH purchase extension.	Prompts are generic, and the resulting contract meets minimum standards but required human refinement to fix security issues or adhere to basic standards.	Contract fails to meet core requirements (ERC-20/SETH) or contains major security flaws, indicating poor managerial oversight.
> 3.2 Project Submission Trace & Structure (5%)	Final project structure shows intentional human organization, with the zipped solution and files logically placed, proving proactive managerial oversight of the AI-generated components.	Zipped solution contains all required files and the structure is correct, demonstrating basic adherence to submission rules.	File structure is mostly correct, but some required files are missing, or the organization is confusing, indicating last-minute fixes.	The submission lacks required files or the structure is incorrect, preventing successful review.
> 3.3 Report: Managerial Communication (10%)	The report is a masterclass in managerial communication, clearly articulating why specific AI-generated solutions were chosen and providing insightful commentary on transaction links and success verification.	The report clearly explains the final code functionality and details the design choices made throughout the process. Transaction links are verified and commented on.	The report provides a functional overview but relies too much on AI-generated summaries. Design decisions are stated without strong justification.	The report is superficial, fails to explain the code, or contains unverified or irrelevant transaction information.
> 4. MANAGERIAL OVERSIGHT & QA (15%)				
> 4.1 Human-Authored Documentation (5%)	Documentation provides high-level, human-written architectural justification for complex AI-generated sections, explaining why a solution was chosen and how different parts integrate into the unified project.	High-quality, human-written documentation is present on all major functions and components, clearly explaining the purpose of the AI-generated code.	Documentation is sufficient for general function usage but lacks insight into architectural or managerial justification.	Documentation is sparse, uses generic AI-generated comments, or is only present in trivial sections.
> 4.2 Prompting for Code Efficiency (2.5%)	Dialogue demonstrates dedicated optimization runs, explicitly prompting the AI for gas efficiency (for contract) and performance (for FE). Final code is highly optimized.	Dialogue shows successful prompts resulting in a clear attempt to optimize core functions. Final code is efficient.	Optimization is reactive. Efficiency is only addressed after a performance issue is discovered, or generic optimization prompts are used.	Code shows significant inefficiencies and student failed to prompt the AI for optimization.
> 4.3 Proactive Error Handling Management (5%)	Dialogue shows the student proactively guided the AI to implement robust, user-facing error messages and handling mechanisms for all potential failure states before the code was written.	Dialogue shows successful prompts resulting in the implementation of proper error messages and handling for expected failure states.	Error handling is reactive or generic (e.g., simple try/catch). Student only addressed errors after encountering them during testing.	Error handling is non-existent, or raw system/blockchain errors are exposed to the user.
> 4.4 Comprehensive Testing Specification (5%)	Evidence of the student using Gen AI to generate test cases, and critically reviewing and expanding those tests to ensure comprehensive coverage across all functionalities, including edge cases.	Evidence shows the student generated functional test cases and verified their results, ensuring coverage of core functionalities.	Student relies on basic test cases generated by the AI without significant review or expansion, resulting in shallow coverage.	Testing is neglected. No structured tests are present, or tests are non-functional.
> Total: 100% (40% of Module grade)

**Reframed for assessment (same intent)**

> Expand the prompt log to align with the module rubric, tightening wording so oversight (wallet security, roles, contract, tests, CI) is explicit for markers.

---

*Total prompts: **39**. Transcript source: `.cursor/projects/.../agent-transcripts`.*