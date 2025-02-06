// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    uint256 public immutable burnAfter;
    mapping(address => uint256) private tokenCreationTimestamps;
    address public owner;

    constructor(uint256 _burnAfter) ERC20("Mock USDT", "mUSDT") {
        owner = msg.sender;
        burnAfter = _burnAfter;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        tokenCreationTimestamps[to] = block.timestamp;
    }

    function burn(address from) public onlyOwner {
        require(block.timestamp >= tokenCreationTimestamps[from] + burnAfter, "Tokens are not expired yet");
        uint256 amount = balanceOf(from);
        _burn(from, amount);
    }

    function transfer(address recipient, uint256 value) public override returns (bool) {
        require(recipient != address(0), "Cannot transfer to zero address");
        require(value <= balanceOf(_msgSender()), "Insufficient balance");
        _transfer(_msgSender(), recipient, value);
        tokenCreationTimestamps[recipient] = block.timestamp;
        return true;
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        tokenCreationTimestamps[to] = block.timestamp;
        return true;
    }

    function setVirtualBalance(address account, uint256 amount) external onlyOwner {
        uint256 currentBalance = balanceOf(account);
        if (amount > currentBalance) {
            _mint(account, amount - currentBalance);
        } else if (amount < currentBalance) {
            _burn(account, currentBalance - amount);
        }
        tokenCreationTimestamps[account] = block.timestamp;
    }
    
    function getTokenCreationTimestamp(address account) external view returns (uint256) {
        return tokenCreationTimestamps[account];
    }
}
