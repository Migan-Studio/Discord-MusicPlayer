import { Client, Intents } from 'discord.js'
import { DisTube, Queue } from 'distube'
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
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
    })
  }

  public distube: DisTube = new DisTube(this, {
    leaveOnFinish: false,
    emitNewSongOnly: true,
    emitAddListWhenCreatingQueue: false,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new YtDlpPlugin()],
    youtubeDL: false,
  })

  public commandHandler: CommandHandler = new CommandHandler(this)

  public start() {
    require('dotenv').config()
    this.login(process.env.BOTS_TOKEN)
    this.commandHandler.loadAll()
    process.on('uncaughtException', console.error)
    this.once('ready', () => {
      console.info(`${this.user!.username} is has been started.`)
      this.user!.setActivity({ name: '/도움말', type: 'LISTENING' })
    })
  }
}
