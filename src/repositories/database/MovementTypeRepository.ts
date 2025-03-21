import type { MovementTypeRepositoryInterface } from '@/repositories/database/interfaces/MovementTypeRepositoryInterface'
import { type Institution, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class MovementTypeRepository implements MovementTypeRepositoryInterface {
	async findOrCreate(name: string): Promise<Institution> {
		console.log('MovementTypeRepository.findOrCreate', name)
		return prisma.movementType.upsert({
			where: { name },
			create: { name },
			update: {},
		})
	}
}
