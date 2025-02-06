import '@nomicfoundation/hardhat-toolbox'
import '@typechain/hardhat'
import * as dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'

dotenv.config()

const config: HardhatUserConfig = {
	solidity: '0.8.28',
	networks: {
		fantomTestnet: {
			url: 'https://rpc.testnet.fantom.network',
			chainId: 4002,
			accounts: [process.env.PRIVATE_KEY || ''],
			timeout: 60000,
		},
		bscTestnet: {
			url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
			chainId: 97,
			accounts: [process.env.PRIVATE_KEY || ''],
			timeout: 60000,
		},
		bscMainnet: {
			url: 'https://bsc-dataseed.binance.org/',
			chainId: 56,
			accounts: [process.env.PRIVATE_KEY || ''],
			timeout: 60000,
		},
		ethereumTestnet: {
			url: 'https://goerli.infura.io/v3/' + process.env.INFURA_PROJECT_ID,
			chainId: 5,
			accounts: [process.env.PRIVATE_KEY || ''],
			timeout: 60000,
		},
		ethereumMainnet: {
			url: 'https://mainnet.infura.io/v3/' + process.env.INFURA_PROJECT_ID,
			chainId: 1,
			accounts: [process.env.PRIVATE_KEY || ''],
			timeout: 60000,
		},
	},
	etherscan: {
		apiKey: {
			FTMTestnet: process.env.FTMSCAN_API_KEY || '',
		},
		customChains: [
			{
				network: 'FTMTestnet',
				chainId: 57054,
				urls: {
					apiURL: 'https://api-testnet.ftmscan.com/api',
					browserURL: 'https://testnet.ftmscan.com/',
				},
			},
		],
	},
	paths: {
		sources: './contracts',
		cache: './cache',
		artifacts: './artifacts',
	},
	typechain: {
		outDir: 'typechain-types',
		target: 'ethers-v6',
	},
}

export default config
