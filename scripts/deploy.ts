import * as fs from 'fs'
import { ethers, network } from 'hardhat'

async function main() {
	const burnAfter = 3600
	console.log(`Параметр burnAfter установлен на: ${burnAfter} секунд`)

	const MockUSDT = await ethers.getContractFactory('MockUSDT')
	console.log('Контракт создан, начинаем деплой...')

	const mockUSDT = await MockUSDT.deploy(burnAfter, {
		gasLimit: 3000000,
		gasPrice: ethers.parseUnits('100', 'gwei'),
	})
	console.log('Ожидаем подтверждения транзакции...')

	const receipt = await mockUSDT.waitForDeployment()
	// Увеличиваем количество подтверждений до 10
	console.log('Ждем 10 подтверждений...')
	await receipt.deploymentTransaction()?.wait(10)

	const address = await mockUSDT.getAddress()

	console.log('✅ MockUSDT успешно развернут!')
	console.log('📍 Адрес контракта:', address)

	const deploymentInfo = {
		address,
		burnAfter,
		timestamp: new Date().toISOString(),
		network: network.name,
	}

	fs.writeFileSync(
		'deployments/MockUSDT.json',
		JSON.stringify(deploymentInfo, null, 2)
	)
	console.log('💾 Информация о деплое сохранена в deployments/MockUSDT.json')
	console.log(
		'ℹ️ Для верификации контракта используйте: npx hardhat run scripts/verifyContract.ts --network sonic'
	)
}

main().catch(error => {
	console.error(error)
	process.exitCode = 1
})
