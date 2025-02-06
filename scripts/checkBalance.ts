import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const deploymentInfo = JSON.parse(
    fs.readFileSync('deployments/MockWBTC.json', 'utf8')
  );

  const mockWBTC = await ethers.getContractAt("MockWBTC", deploymentInfo.address);
  
  // Получаем адрес для проверки
  const [owner] = await ethers.getSigners();
  const address = await owner.getAddress();
  
  const balance = await mockWBTC.balanceOf(address);
  console.log(`💰 Баланс ${address}: ${ethers.formatUnits(balance, 8)} WBTC`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 