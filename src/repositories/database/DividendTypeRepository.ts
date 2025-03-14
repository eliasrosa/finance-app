import type { DividendTypeRepositoryInterface } from '@/repositories/database/interfaces/DividendTypeRepositoryInterface'
import { type DividendType, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class DividendTypeRepository implements DividendTypeRepositoryInterface {
	async findOrCreate(name: string): Promise<DividendType> {
		console.log('DividendTypeRepository.findOrCreate', name)
		return prisma.dividendType.upsert({
			where: { name },
			create: { name },
			update: {},
		})
	}
}
