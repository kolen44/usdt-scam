import * as fs from 'fs'
import { ethers } from 'hardhat'

async function main() {
	const deploymentInfo = JSON.parse(
		fs.readFileSync('deployments/MockUSDT.json', 'utf8')
	)

	const mockUSDT = await ethers.getContractAt(
		'MockUSDT',
		deploymentInfo.address
	)

	const [owner] = await ethers.getSigners()
	console.log(
		'Взаимодействие с контрактом от адреса:',
		await owner.getAddress()
	)

	const mintAmount = ethers.parseUnits('1.0', 8)
	const tx = await mockUSDT.mint(await owner.getAddress(), mintAmount)
	await tx.wait()

	console.log(`✅ Заминчено ${ethers.formatUnits(mintAmount, 8)} USDT`)

	const balance = await mockUSDT.balanceOf(await owner.getAddress())
	console.log(`💰 Текущий баланс: ${ethers.formatUnits(balance, 8)} USDT`)
}

main().catch(error => {
	console.error(error)
	process.exitCode = 1
})
