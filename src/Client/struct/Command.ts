import {
  ApplicationCommandOptionData,
  ApplicationCommandType,
  CommandInteraction,
} from 'discord.js'

export class Command {
  name: string = ''
  description: string = ''
  type: ApplicationCommandType = 'CHAT_INPUT'
  options?: ApplicationCommandOptionData[]
  defaultPermission?: boolean
  public toJSON() {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      options: this.options,
      defaultPermission: this.defaultPermission,
    }
  }

  public execute(interaction: CommandInteraction): any {}
}
