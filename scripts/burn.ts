import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const deploymentInfo = JSON.parse(
    fs.readFileSync('deployments/MockUSDT.json', 'utf8')
  );

  const mockUSDT = await ethers.getContractAt("MockUSDT", deploymentInfo.address);
  
  const [owner] = await ethers.getSigners();
  const address = await owner.getAddress();
  
  try {
    const tx = await mockUSDT.burn(address);
    await tx.wait();
    console.log(`🔥 Токены успешно сожжены для адреса ${address}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("⚠️ Ошибка при сжигании:", error.message);
    } else {
      console.log("⚠️ Неизвестная ошибка при сжигании");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 