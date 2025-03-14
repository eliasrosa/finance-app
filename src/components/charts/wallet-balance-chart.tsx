'use client'

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from '@/components/ui/chart'
import { TickerTypeColor, TickerTypeLabel } from '@/enums/ticker-enum'
import { toPercent } from '@/lib/number'
import { Label, Pie, PieChart } from 'recharts'
import { WalletBalanceChartTooltipContent } from '../tooltips/contents/wallet-balance-chart-content'

const getLabelText = (diffPercent: number) => {
	if (diffPercent <= 0.05) return 'Excelente'
	if (diffPercent <= 0.1) return 'Cuidado'
	if (diffPercent <= 0.15) return 'Atenção'
	if (diffPercent <= 0.2) return 'Perigo'
	return 'Crítico'
}

type Props = {
	data: {
		name: string
		goal: number
		total: number
	}[]
}

export const calculeWalletBalanceChartData = (data: Props['data']) => {
	const walletTotal = data.reduce((acc, { total }) => acc + total, 0)

	const chartData = data
		.map((item) => {
			const wallet = item.total / walletTotal
			const diff = Math.abs(wallet - item.goal)
			const label = TickerTypeLabel[item.name as keyof typeof TickerTypeLabel]
			const fill = TickerTypeColor[item.name as keyof typeof TickerTypeColor]
			return { ...item, wallet, diff, label, fill }
		})
		.sort((a, b) => a.diff - b.diff)

	const diffPercent = chartData.reduce((acc, { diff }) => acc + diff, 0)
	const diffTotal = walletTotal * diffPercent

	return { chartData, diffTotal, walletTotal, diffPercent }
}

export function WalletBalanceChart({ data }: Props) {
	const { chartData, diffPercent } = calculeWalletBalanceChartData(data)

	return (
		<ChartContainer config={{}} className="mx-auto aspect-square max-h-[300px]">
			<PieChart>
				<ChartTooltip cursor={false} content={<WalletBalanceChartTooltipContent />} />
				<Pie data={chartData} dataKey="diff" nameKey="name" innerRadius={60} outerRadius={80} strokeWidth={5}>
					<Label
						content={({ viewBox }) => {
							if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
								return (
									<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
										<tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
											{toPercent(diffPercent, 1)}
										</tspan>
										<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
											{getLabelText(diffPercent)}
										</tspan>
									</text>
								)
							}
						}}
					/>
				</Pie>
				{/* <ChartLegend className="mt-5" content={<ChartLegendContent />} /> */}
			</PieChart>
		</ChartContainer>
	)
}
