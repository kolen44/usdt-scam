import { run } from "hardhat";

export async function verify(contractAddress: string, args: any[]) {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if ((e as Error).message.toLowerCase().includes("already verified")) {
      console.log("Контракт уже верифицирован!");
    } else {
      throw e;
    }
  }
} 