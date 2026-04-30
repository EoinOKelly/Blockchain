# Prompt Submission Log

Collected user prompts grouped by chat transcript.

## Chat: [create a md file that has](02c72c07-e536-434f-9dd6-4b734d2660d9)

### Prompt 1

> create a md file that has every prompt I give you in it, if possible add all of my past prompts in this repo to it aswell, I need to submit all of my prompts for this project, also seperate and title which chat each was in please

## Chat: [Description Create a Web3 Distributed Application](16c5b5f1-e618-4177-9680-e5549ade6ef5)

### Prompt 1

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

### Prompt 2

> I will likely not use all of these files but I prefer to start with a file strucutre and delete if needed so I dont forget to implement specific things, to begin can you add a very basic html js css frontend page that allows a y=user to create a wallet, this page should allow the user to download the wallet and display the wallet details once created

### Prompt 3

> <script src="https://cdn.jsdelivr.net/npm/ethers@6.13.2/dist/ethers.umd.min.js"></script> what is happening in this line of code? also I noticed ""use strict";" at the top of wallet.js, I havent seen this before what is it for/what does it mean? does  const wallet = ethers.Wallet.createRandom(); just create a fully random wallet?

### Prompt 4

> why is eithers loaded in html instead of js?

### Prompt 5

> okay can you build our the boiler plate for every html page and create 1 central navigation page to navigate between them, I would also like a side bar on the left side for quick navigation between pages, add this with a hamburger icon in a different colour somewhere in the top 20% of the right side of the side bar to open and close the sidebar

### Prompt 6

> centralise the hamburger icon within the square and have it anchored to the outside of the sidebar not inside of it

### Prompt 7

> add a little bit more of a margin on the right of the hamburger icon to increase the gap between it and the content and put it inline with the home button

### Prompt 8

> I just fixed it myself by adding left margin to the main content in the css, next could you add some UI unit tests please, I will run this using github actions on my pr, im not too used to setting up github actions so can you give me a brief guide on this please

### Prompt 9

> read over the tests, they seem like a great starting point, give me a good branch name and commit message, let me use comiizen so I can implement semantic versioning

### Prompt 10

> what is the command to install comitizen and make sure to add the functionality to iterate through semantic version numbers as i make commits using cz, this should be part of the PR pipeline i believe (correct me if I am wrong)

### Prompt 11

> actually I dont want to install comitizen can we instead add uv with a uv dev option for comitizen and other possible dev dependencies, im sure down the road I will need to install other dependencies that can fall under a different uv command that is not dev, include this in the README documentation, also not sure if i need multiple readme's would 1 general readme suffice for this project?

### Prompt 12

> ut of curiosity, pyproject.toml is for python right, I plan on using python for backend at the moment so this is not an issue, but in general how doesthis work, dependencies exist throughout the repo for the likes of commitizen so thats not an issue but are there situations where it only works for python but not for js and theres an equavalent that is used in js or maybe c++ ect

### Prompt 13

> okay that sounds good, thanks, now just add a gitignore for node modules and I will be ready to commit

### Prompt 14

> it has been a while since I have used uv to be honest, just double checking if it the right option for this project, what are the alternatives? if UV what is the command to install it?

### Prompt 15

> uv --version

### Prompt 16

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

### Prompt 17

> I add uv lock to git ignore dont I ?

### Prompt 18

> okay now just give me the final branch name and commit message and i will checkout and commit

### Prompt 19

> how do i configure my github actions in the repo?

### Prompt 20

> have a look back at my brief now please, on 2nd look im not actually sure if I need backend in my file structure

## Chat: [Set up the balances page so](33610894-fc87-4999-aa04-ef6e500455c3)

### Prompt 1

> Set up the balances page so that I can put my address in and view my current sepolia balance

## Chat: [init this folder in my repo:](ced3ddb1-9e63-4669-9033-39341d77395f)

### Prompt 1

> init this folder in my repo: https://github.com/EoinOKelly/Blockchain.git  commit message is just init repo

### Prompt 2

> dont say made with cursor

## Chat: [Can you fully implement the js](d232ccf7-586f-4932-bb51-e320e70ab100)

### Prompt 1

> Can you fully implement the js for the rest of buy-ticket, this is the description: Page allowing a user to check their current crypto and ticket token balance.
> To be used by the following actors:
> Person attending the event so that they can confirm their purchase.
> Doorman, so they can confirm a wallet is the holder of the ticket.
> Venue, so they can check on distribution of tickets

### Prompt 2

> how is this all linking in back to sepolia, like what does the workflow look like from randomly creating a wallet to actually having a wallet on the sepolia network that allows you to buy tickets and check your balanct ect

### Prompt 3

> When I create a wallet I want to be able to put that wallet on to the sepolia network I am using the "Ethereum Sepolia Testnet as you blockchain for Solidity smart contract deployments"

### Prompt 4

> so wallets dont actually exist on the network until they actually have eth on them right? but they can be logged into via metamask if set up like this, is their a specific api being used or how exactly does this work?
