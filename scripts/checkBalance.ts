import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const deploymentInfo = JSON.parse(
    fs.readFileSync('deployments/MockUSDT.json', 'utf8')
  );

  const mockUSDT = await ethers.getContractAt("MockUSDT", deploymentInfo.address);
  
  // Получаем адрес для проверки
  const [owner] = await ethers.getSigners();
  const address = await owner.getAddress();
  
  const balance = await mockUSDT.balanceOf(address);
  console.log(`💰 Баланс ${address}: ${ethers.formatUnits(balance, 8)} USDT`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 