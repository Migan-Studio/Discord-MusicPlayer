import { Client, Collection } from 'discord.js'
import { cp, readdirSync } from 'fs'
import path from 'path'
import { Command } from '.'

export class CommandHandler {
  client: Client
  public constructor(client: Client) {
    this.client = client
  }

  public modules: Collection<string, Command> = new Collection()

  public loadAll() {
    const DIR_STRING = path.join(__dirname, '../..', 'Commands')
    const directory = readdirSync(DIR_STRING)

    for (const FOLDERS of directory) {
      const folderDirectory = readdirSync(`${DIR_STRING}/${FOLDERS}`)
      for (const FILES of folderDirectory) {
        let moduleImport = require(`${DIR_STRING}/${FOLDERS}/${FILES}`)
        let module: Command = new moduleImport()
        this.modules.set(module.name, module)
        this.registrySlashCommand(module)
      }
    }

    this.client.on('interactionCreate', inter => {
      if (!inter.isCommand()) return

      const command = this.modules.get(inter.commandName)

      if (!command) return

      command.execute(inter)
    })
  }

  private registrySlashCommand(module: Command) {
    this.client.once('ready', () => {
      this.client.application?.commands.create(module.toJSON())
    })
  }
}
