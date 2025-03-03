import { TickerRepository } from '@/repositories/database/TickerRepository'
import { RecalculeGoalsService } from '@/services/wallet/RecalculeGoalsService'
import { PrismaClient, TickerType } from '@prisma/client'
import { ImportDividendsCommand } from './b3/ImportDividendsCommand'
import { ImportMovementsCommand } from './b3/ImportMovementsCommand'

const prisma = new PrismaClient()

class DemoCommand {
	async execute(): Promise<void> {
		// clear database
		await prisma.walletTicker.deleteMany()
		await prisma.wallet.deleteMany()

		// import b3 movements and dividends
		await new ImportDividendsCommand().execute()
		await new ImportMovementsCommand().execute()

		// TODO: create wallet service and repository
		const wallet = await prisma.wallet.create({
			data: {
				name: 'My Wallet',
				goalFII: 0.25,
				goalStock: 0.25,
				goalETF: 0.25,
				goalRF: 0.25,
			},
		})

		// TODO: attach tickers to wallet
		const tickers = (await new TickerRepository().getAll()).map((ticker) => {
			return {
				goal: 0,
				isGoalFixed: false,
				tickerId: ticker.id,
				walletId: wallet.id,
			}
		})

		await prisma.walletTicker.createMany({ data: tickers })

		// set fixed goals
		await prisma.walletTicker.update({
			where: { tickerId: 'BOVA11', walletId: wallet.id },
			data: { goal: 0.03, isGoalFixed: true },
		})

		await prisma.walletTicker.update({
			where: { tickerId: 'IVVB11', walletId: wallet.id },
			data: { goal: 0.1, isGoalFixed: true },
		})

		// update wallet goals
		await new RecalculeGoalsService().execute(wallet, TickerType.FII)
		await new RecalculeGoalsService().execute(wallet, TickerType.ETF)
		await new RecalculeGoalsService().execute(wallet, TickerType.STOCK)
	}
}

new DemoCommand()
	.execute()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
