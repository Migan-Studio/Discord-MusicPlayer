import { ChatInputCommandInteraction, CacheType } from 'discord.js'
import { Command } from '../../Client/struct'

export = class extends Command {
  name = '핑'
  description = '퐁'
  public execute(interaction: ChatInputCommandInteraction<CacheType>): void {
    interaction.reply('퐁!')
  }
}
