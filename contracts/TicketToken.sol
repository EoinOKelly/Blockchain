// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title TicketToken — ERC-20 tickets purchased with native Sepolia ETH (testnet).
contract TicketToken is ERC20, Ownable {
    /// @notice Maximum ticket tokens that can ever be minted (1 token unit = 1 ticket).
    uint256 public constant MAX_TICKETS = 100;

    uint256 public ticketPriceWei;
    address public vendor;

    event TicketPurchased(address indexed buyer, uint256 ticketCount, uint256 ethPaid);
    event TicketPriceUpdated(uint256 newTicketPriceWei);
    event VendorUpdated(address indexed newVendor);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 ticketPriceWei_,
        address vendor_,
        address initialOwner
    ) ERC20(name_, symbol_) Ownable(initialOwner) {
        require(vendor_ != address(0), "TicketToken: vendor is zero address");
        ticketPriceWei = ticketPriceWei_;
        vendor = vendor_;
    }

    /// @notice Buy ticket tokens by sending the exact ETH required for `ticketCount` tickets.
    function buyTickets(uint256 ticketCount) external payable {
        require(ticketCount > 0, "TicketToken: zero ticket count");
        uint256 cost = ticketPriceWei * ticketCount;
        require(msg.value == cost, "TicketToken: incorrect ETH amount");

        uint256 tokenAmount = ticketCount * (10 ** decimals());
        uint256 cap = MAX_TICKETS * (10 ** decimals());
        require(totalSupply() + tokenAmount <= cap, "TicketToken: ticket cap exceeded");

        _mint(msg.sender, tokenAmount);

        emit TicketPurchased(msg.sender, ticketCount, msg.value);
    }

    function setTicketPriceWei(uint256 newTicketPriceWei) external onlyOwner {
        ticketPriceWei = newTicketPriceWei;
        emit TicketPriceUpdated(newTicketPriceWei);
    }

    function setVendor(address newVendor) external onlyOwner {
        require(newVendor != address(0), "TicketToken: vendor is zero address");
        vendor = newVendor;
        emit VendorUpdated(newVendor);
    }

    function withdrawEth() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
