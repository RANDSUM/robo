import type { APIEmbed, ChatInputCommandInteraction } from 'discord.js'
import { Colors, EmbedBuilder } from 'discord.js'
import type { CommandConfig, CommandOptions, CommandResult } from 'robo.js'
import type { SalvageUnionHit, SalvageUnionTableName } from '@randsum/salvageunion'
import { AllRollTables, rollTable } from '@randsum/salvageunion'
import { embedFooterDetails } from '../core/constants'

const suChoices = Object.keys(AllRollTables).map((table) => ({
	name: table,
	value: table
}))

export const config: CommandConfig = {
	description: 'The Salvage Union is here to help you with your salvaging needs',
	options: [
		{
			name: 'table',
			description: 'What table are you rolling on?',
			type: 'string',
			choices: suChoices
		}
	]
}

function getColor(type: string): number {
	switch (type) {
		case '20':
		case 'Nailed It':
			return Colors.Green
		case '19':
		case '18':
		case '17':
		case '16':
		case '15':
		case '14':
		case '13':
		case '12':
		case '11':
		case 'Success':
			return Colors.DarkGreen
		case '10':
		case '9':
		case '8':
		case '7':
		case '6':
		case 'Tough Choice':
			return Colors.Yellow
		case '5':
		case '4':
		case '3':
		case '2':
		case 'Failure':
			return Colors.Red
		case '1':
		case 'Cascade Failure':
			return Colors.DarkRed
		default:
			return Colors.Greyple
	}
}

export function buildEmbed(table: SalvageUnionTableName): APIEmbed {
	const {
		result: { hit, label, description, roll: total }
	} = rollTable(table)

	const titleBase = `${String(total)}`
	const title = label === hit ? titleBase : `${titleBase} - __**${label}**__`

	return new EmbedBuilder()
		.setTitle(title)
		.setColor(getColor(hit))
		.setDescription(description)
		.addFields({ name: 'Table', value: table, inline: true })
		.setFooter(embedFooterDetails)
		.toJSON()
}

export default async (
	interaction: ChatInputCommandInteraction,
	{ table }: CommandOptions<typeof config>
): Promise<CommandResult> => {
	const tableName: SalvageUnionTableName = (table ?? 'Core Mechanic') as SalvageUnionTableName

	await interaction.reply({ embeds: [buildEmbed(tableName)] })
}
