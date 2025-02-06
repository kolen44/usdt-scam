import * as fs from 'fs'
import { ethers, run } from 'hardhat'

async function main() {
	try {
		const deploymentInfo = JSON.parse(
			fs.readFileSync('deployments/MockUSDT.json', 'utf-8')
		)

		console.log('Ожидаем 30 секунд перед проверкой...')
		await new Promise(resolve => setTimeout(resolve, 30000))

		const bytecode = await ethers.provider.getCode(deploymentInfo.address)
		if (bytecode === '0x') {
			console.log('⚠️ Контракт не найден по этому адресу. Проверьте деплой.')
			return
		}

		console.log('Начинаем верификацию контракта...')
		console.log('Адрес контракта:', deploymentInfo.address)
		console.log('Параметр burnAfter:', deploymentInfo.burnAfter)

		try {
			await run('verify:verify', {
				address: deploymentInfo.address,
				constructorArguments: [deploymentInfo.burnAfter],
				contract: 'contracts/MockUSDT.sol:MockUSDT',
				wait: 60,
			})
		} catch (verifyError: any) {
			if (verifyError.message.toLowerCase().includes('already verified')) {
				console.log('✅ Контракт уже верифицирован!')
			} else {
				console.error('❌ Ошибка верификации:', verifyError)
				console.log('Пробуем альтернативный метод верификации...')
				await new Promise(resolve => setTimeout(resolve, 30000))
				await run('verify:verify', {
					address: deploymentInfo.address,
					constructorArguments: [deploymentInfo.burnAfter],
					wait: 60,
				})
			}
		}

		console.log('✅ Контракт успешно верифицирован!')
		console.log(
			`🔍 Проверить контракт можно по адресу: https://sonicscan.org/address/${deploymentInfo.address}`
		)
	} catch (error: any) {
		if (error.message.toLowerCase().includes('already verified')) {
			console.log('✅ Контракт уже верифицирован!')
		} else {
			console.error('❌ Ошибка верификации:', error)
			process.exitCode = 1
		}
	}
}

main().catch(error => {
	console.error(error)
	process.exitCode = 1
})
