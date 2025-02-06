import * as fs from "fs"
import { ethers } from "hardhat"

async function main() {
  const deploymentInfo = JSON.parse(
    fs.readFileSync('deployments/MockUSDT.json', 'utf8')
  );

  console.log("Проверяем контракт по адресу:", deploymentInfo.address);

  // Проверяем байткод
  const bytecode = await ethers.provider.getCode(deploymentInfo.address);
  console.log("Байткод существует:", bytecode !== "0x");

  if (bytecode === "0x") {
    console.log("❌ Контракт не найден по этому адресу");
    return;
  }

  // Пробуем подключиться к контракту
  const mockUSDT = await ethers.getContractAt("MockUSDT", deploymentInfo.address);
  
  try {
    const name = await mockUSDT.name();
    const symbol = await mockUSDT.symbol();
    const burnAfter = await mockUSDT.burnAfter();
    
    console.log("\n✅ Контракт успешно развернут и отвечает:");
    console.log("Имя:", name);
    console.log("Символ:", symbol);
    console.log("BurnAfter:", burnAfter.toString(), "секунд");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("❌ Ошибка при взаимодействии с контрактом:", error.message);
    } else {
      console.log("❌ Неизвестная ошибка при взаимодействии с контрактом");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 