import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  const dividendTypes = ['Rendimento', 'Reembolso']

  for (let i = 0; i < dividendTypes.length; i++) {
    const result = await prisma.dividendType.upsert({
      where: { id: i + 1},
      update: {},
      create: {
        name: dividendTypes[i],
      }
    })

    console.log(result)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })