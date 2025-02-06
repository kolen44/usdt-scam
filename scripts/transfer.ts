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

	const [sender] = await ethers.getSigners()

	const recipientAddress = '0x7c72715B76ECBe068311EcbCa205D53C50496f89'

	const amount = ethers.parseUnits('0.1', 8)

	try {
		const balance = await mockUSDT.balanceOf(await sender.getAddress())
		console.log(
			`💰 Текущий баланс отправителя: ${ethers.formatUnits(balance, 8)} USDT`
		)

		if (balance < amount) {
			console.log('⚠️ Недостаточно средств для отправки')
			return
		}

		const tx = await mockUSDT.transfer(recipientAddress, amount)
		await tx.wait()

		console.log(
			`✅ Успешно отправлено ${ethers.formatUnits(
				amount,
				8
			)} USDT на адрес ${recipientAddress}`
		)

		const newBalance = await mockUSDT.balanceOf(await sender.getAddress())
		console.log(
			`💰 Новый баланс отправителя: ${ethers.formatUnits(newBalance, 8)} USDT`
		)
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log('⚠️ Ошибка при отправке:', error.message)
		} else {
			console.log('⚠️ Неизвестная ошибка при отправке')
		}
	}
}

main().catch(error => {
	console.error(error)
	process.exitCode = 1
})
