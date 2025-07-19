import { roll, validateNotation } from '@randsum/roller'
import type { APIEmbed, ChatInputCommandInteraction } from 'discord.js'
import { EmbedBuilder } from 'discord.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import { createCommandConfig } from 'robo.js'
import { embedFooterDetails } from '../core/constants'

export const config = createCommandConfig({
  description: 'Test your luck with a roll of the dice',
  options: [
    {
      name: 'notation',
      description: 'A roll using dice notation - e.g. 2d6+3',
      type: 'string',
      required: true
    }
  ]
})

const buildEmbed = (notationArg: string): APIEmbed => {
  const { valid, description, digested } = validateNotation(notationArg)

  if (!valid) {
    return new EmbedBuilder()
      .setTitle('Error')
      .setDescription(`"**${notationArg}**" is not valid dice notation.`)
      .addFields(description.map((d) => ({ name: '', value: d, inline: true })))
      .addFields({
        name: 'Learn More',
        value:
          'See the [Dice Notation Guide](https://github.com/RANDSUM/randsum-ts/blob/main/RANDSUM_DICE_NOTATION.md) for more information.'
      })
      .setFooter(embedFooterDetails)
      .toJSON()
  }

  const result = roll(digested)

  const total = `**${String(result.total)}**`

  const rawResults = JSON.stringify(
    result.rolls[0]?.modifierHistory.initialRolls
  )
  const results = JSON.stringify(result.rolls[0]?.modifierHistory.modifiedRolls)

  const simpleField = [{ name: 'Rolls', value: results, inline: true }]
  const complexField = [
    { name: 'Rolls (before modifiers)', value: rawResults, inline: true },
    {
      name: 'Rolls (after modifiers)',
      value: results,
      inline: true
    }
  ]
  const rollFields = rawResults === results ? simpleField : complexField

  const fields = [
    { name: 'Value', value: total },
    ...rollFields,
    { name: 'Notation', value: notationArg }
  ]
  return new EmbedBuilder()
    .setTitle(`You rolled a ${total}`)
    .setDescription(result.rolls[0]?.parameters.description.join(', '))
    .setFields(fields)
    .setFooter(embedFooterDetails)
    .toJSON()
}

export default async (
  interaction: ChatInputCommandInteraction,
  { notation }: CommandOptions<typeof config>
): Promise<CommandResult> => {
  await interaction.reply({ embeds: [buildEmbed(String(notation))] })
}
