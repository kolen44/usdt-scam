import * as fs from "fs"
import { ethers, network } from "hardhat"

async function main() {
    const realUSDTAddress = "0x321162Cd933E2Be498Cd2267a90534A804051b11";
    
    const USDTProxy = await ethers.getContractFactory("USDTProxy");
    console.log("Разворачиваем USDTProxy...");
    
    const proxy = await USDTProxy.deploy(realUSDTAddress, {
        gasLimit: 3000000,
        gasPrice: ethers.parseUnits("100", "gwei")
    });
    
    await proxy.waitForDeployment();
    const proxyAddress = await proxy.getAddress();
    
    const deploymentInfo = {
        address: proxyAddress,
        realUSDTAddress,
        timestamp: new Date().toISOString(),
        network: network.name
    };
    
    fs.writeFileSync(
        'deployments/USDTProxy.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("✅ USDTProxy развернут по адресу:", proxyAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 