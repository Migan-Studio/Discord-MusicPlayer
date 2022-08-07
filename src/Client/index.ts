import { ActivityType, Client, GatewayIntentBits } from 'discord.js'
import { DisTube } from 'distube'
import { CommandHandler } from './struct'
import { YtDlpPlugin } from '@distube/yt-dlp'

declare module 'discord.js' {
  interface Client {
    distube: DisTube
    commandHandler: CommandHandler
  }
}

export default class DMPClient extends Client {
  public constructor() {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    })
  }

  public distube: DisTube = new DisTube(this, {
    leaveOnFinish: false,
    emitNewSongOnly: true,
    emitAddListWhenCreatingQueue: false,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new YtDlpPlugin()],
  })

  public commandHandler: CommandHandler = new CommandHandler(this)

  public start() {
    require('dotenv').config()
    this.login(process.env.BOTS_TOKEN)
    this.commandHandler.loadAll()
    process.on('uncaughtException', console.error)
    this.once('ready', () => {
      console.info(`${this.user!.username} is has been started.`)
      this.user!.setActivity({ name: '/도움말', type: ActivityType.Listening })
    })
  }
}
