// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title TicketToken — ERC-20 tickets purchased with native Sepolia ETH (testnet).
contract TicketToken is ERC20, Ownable, ReentrancyGuard {
    /// @notice Maximum ticket tokens that can ever be minted (1 token = 1 ticket).
    uint256 public constant MAX_TICKETS = 100;

    uint256 public ticketPriceWei;
    address public vendor;

    event TicketPurchased(address indexed buyer, uint256 ticketCount, uint256 ethPaid);
    event TicketPriceUpdated(uint256 newTicketPriceWei);
    event VendorUpdated(address indexed newVendor);
    event TicketsReturnedToVendor(address indexed holder, uint256 ticketCount);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 ticketPriceWei_,
        address vendor_,
        address initialOwner
    ) ERC20(name_, symbol_) Ownable(initialOwner) {
        require(vendor_ != address(0), "TicketToken: vendor is zero address");
        require(ticketPriceWei_ > 0, "TicketToken: price is zero");
        ticketPriceWei = ticketPriceWei_;
        vendor = vendor_;
    }

    /// @notice Whole-number tickets only (no fractional ticket units).
    function decimals() public pure override returns (uint8) {
        return 0;
    }

    /// @notice Buy tickets with native ETH; overpayment is refunded to the buyer.
    /// @param ticketCount Number of whole tickets to mint (must be > 0).
    function buyTickets(uint256 ticketCount) external payable nonReentrant {
        require(ticketCount > 0, "TicketToken: zero ticket count");
        uint256 cost = ticketPriceWei * ticketCount;
        require(msg.value >= cost, "TicketToken: insufficient ETH");

        uint256 cap = MAX_TICKETS;
        require(totalSupply() + ticketCount <= cap, "TicketToken: ticket cap exceeded");

        if (msg.value > cost) {
            uint256 refund = msg.value - cost;
            (bool refunded, ) = msg.sender.call{value: refund}("");
            require(refunded, "TicketToken: refund failed");
        }

        _mint(msg.sender, ticketCount);

        emit TicketPurchased(msg.sender, ticketCount, cost);
    }

    /// @notice Transfer whole tickets back to the configured vendor (on-chain enforced destination).
    /// @param ticketCount Number of tickets to return (must be > 0).
    function transferTicketsToVendor(uint256 ticketCount) external {
        require(ticketCount > 0, "TicketToken: zero ticket count");
        _transfer(msg.sender, vendor, ticketCount);
        emit TicketsReturnedToVendor(msg.sender, ticketCount);
    }

    /// @notice Update ticket price; zero is not allowed (prevents free minting).
    /// @param newTicketPriceWei New price per ticket in wei.
    function setTicketPriceWei(uint256 newTicketPriceWei) external onlyOwner {
        require(newTicketPriceWei > 0, "TicketToken: price is zero");
        ticketPriceWei = newTicketPriceWei;
        emit TicketPriceUpdated(newTicketPriceWei);
    }

    /// @notice Set the vendor address that receives returned tickets.
    /// @param newVendor New vendor wallet (must not be zero).
    function setVendor(address newVendor) external onlyOwner {
        require(newVendor != address(0), "TicketToken: vendor is zero address");
        vendor = newVendor;
        emit VendorUpdated(newVendor);
    }

    /// @notice Withdraw accumulated sale ETH to the owner (uses `call`, not `transfer`).
    function withdrawEth() external onlyOwner nonReentrant {
        uint256 amount = address(this).balance;
        require(amount > 0, "TicketToken: nothing to withdraw");
        (bool sent, ) = owner().call{value: amount}("");
        require(sent, "TicketToken: withdraw failed");
    }
}
