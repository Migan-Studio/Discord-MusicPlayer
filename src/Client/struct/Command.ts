import {
  ApplicationCommandOptionData,
  ApplicationCommandType,
  CommandInteraction,
  PermissionResolvable,
} from 'discord.js'

export class Command {
  name: string = ''
  description: string = ''
  type: ApplicationCommandType = ApplicationCommandType.ChatInput
  options?: ApplicationCommandOptionData[]
  defaultPermission?: PermissionResolvable
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
