import type { APIEmbed, ChatInputCommandInteraction } from 'discord.js'
import { Colors, EmbedBuilder } from 'discord.js'
import type { CommandConfig, CommandOptions, CommandResult } from 'robo.js'
import type { SalvageUnionTableName } from '@randsum/salvageunion'
import { rollTable, SALVAGE_UNION_TABLE_NAMES } from '@randsum/salvageunion'
import { embedFooterDetails } from '../core/constants'

const suChoices = Object.keys(SALVAGE_UNION_TABLE_NAMES).map((table) => ({
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
		result: { label, description, roll: total }
	} = rollTable(table)

	const title = `**${String(total)}**`

	return new EmbedBuilder()
		.setTitle(title)
		.setColor(getColor(String(total)))
		.setDescription(description === '' ? label : description)
		.addFields({ name: 'Table', value: table, inline: true })
		.setFooter(embedFooterDetails)
		.toJSON()
}

export default async (
	interaction: ChatInputCommandInteraction,
	{ table }: CommandOptions<typeof config>
): Promise<CommandResult> => {
	const tableName: SalvageUnionTableName = (table ?? 'Core Mechanic') as SalvageUnionTableName

	await interaction.deferReply()
	await interaction.editReply({ embeds: [buildEmbed(tableName)] })
}
