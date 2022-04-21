import { CommandInteraction, CacheType } from 'discord.js'
import { Command } from '../../Client/struct'

export = class extends Command {
  name = '핑'
  description = '퐁'
  public execute(interaction: CommandInteraction<CacheType>): void {
    interaction.reply('퐁!')
  }
}
