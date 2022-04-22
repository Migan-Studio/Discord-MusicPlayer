import {
  CommandInteraction,
  CacheType,
  ApplicationCommandOptionData,
  MessageEmbed,
} from 'discord.js'
import { Command } from '../../Client/struct'
import { Queue, Song } from 'distube'

export = class extends Command {
  name = '노래'
  description = '노래재생기의 노래커맨드'
  options?: ApplicationCommandOptionData[] | undefined = [
    {
      type: 'SUB_COMMAND',
      name: '재생',
      description: '노래를 재생합니다',
      options: [
        {
          type: 'STRING',
          name: '노래',
          required: true,
          description: '노래의 제목',
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: '정지',
      description: '노래를 정지합니다',
    },
    {
      type: 'SUB_COMMAND',
      name: '일시정지',
      description: '노래를 일시정지합니다.',
    },
    {
      type: 'SUB_COMMAND',
      name: '다시재생',
      description: '노래를 다시 재생합니다.',
    },
    {
      type: 'SUB_COMMAND',
      name: '반복',
      description: '반복모드를 설정합니다.',
      options: [
        {
          type: 'STRING',
          name: '반복모드',
          description: '반복할 모드',
          required: true,
          choices: [
            {
              name: '끄기',
              value: '0',
            },
            {
              name: '한곡만',
              value: '1',
            },
            {
              name: '전체',
              value: '2',
            },
          ],
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: '음량조절',
      description: '노래의 음량을 조절합니다.',
      options: [
        {
          type: 'NUMBER',
          name: '음량',
          description: '조절할 음량',
          required: true,
          minValue: 0,
          maxValue: 100,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: '건너뛰기',
      description: '노래를 건너뜁니다.',
    },
    {
      type: 'SUB_COMMAND',
      name: '재생목록',
      description: '현재의 재생목록입니다.',
    },
  ]
  public execute(interaction: CommandInteraction<CacheType>): any {
    const member = interaction.guild?.members.cache.get(interaction.user.id)!
    const SUBCOMMAND_STRING = interaction.options.getSubcommand()

    if (!member.voice!.channel!)
      return interaction.reply({
        content: '음성채널에 들어가셔서 명령어를 사용해 주세요.',
        ephemeral: true,
      })

    interaction.client.distube
      .once('playSong', (queue, song) => {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle('노래 재생')
              .setDescription(
                `노래 [${song.name} - ${song.formattedDuration}](${song.url})을/를 시작했어요.`
              )
              .setThumbnail(song.thumbnail!),
          ],
        })
      })
      .once('addSong', (queue, song) => {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle('노래 추가')
              .setDescription(
                `노래 [${song.name} - ${song.formattedDuration}](${song.url})을/를 추가했어요.`
              )
              .setThumbnail(song.thumbnail!),
          ],
        })
      })
    if (SUBCOMMAND_STRING === '재생') {
      interaction.client.distube.play(
        member.voice!.channel!,
        interaction.options.getString('노래')!
      )
    } else if (SUBCOMMAND_STRING === '정지') {
      const queue = interaction.client.distube.getQueue(interaction)
      if (!queue)
        return interaction.reply({ content: '큐가 없어요.', ephemeral: true })
      queue.stop()
      interaction.reply({
        embeds: [
          new MessageEmbed().setTitle('노래가 성공적으로 정지 되었어요.'),
        ],
      })
    } else if (SUBCOMMAND_STRING === '일시정지') {
      const queue = interaction.client.distube.getQueue(interaction)
      if (!queue)
        return interaction.reply({ content: '큐가 없어요.', ephemeral: true })
      if (queue.paused)
        return interaction.reply({
          content: '이미 일시정지가 되어있어요.',
          ephemeral: true,
        })
      queue.pause()
      interaction.reply({
        embeds: [
          new MessageEmbed().setTitle('노래가 성공적으로 일시정지 되었어요.'),
        ],
      })
    } else if (SUBCOMMAND_STRING === '다시재생') {
      const queue = interaction.client.distube.getQueue(interaction)
      if (!queue)
        return interaction.reply({ content: '큐가 없어요.', ephemeral: true })
      if (!queue.paused)
        return interaction.reply({
          content: '일시정지가 안되어있어요.',
          ephemeral: true,
        })
      queue.resume()
      interaction.reply({
        embeds: [
          new MessageEmbed().setTitle('노래가 성공적으로 다시 재생 되었어요.'),
        ],
      })
    } else if (SUBCOMMAND_STRING === '반복') {
      const queue = interaction.client.distube.getQueue(interaction)
      const OPTION_STRING = interaction.options.getString('반복모드')!
      let mode
      if (!queue)
        return interaction.reply({ content: '큐가 없어요.', ephemeral: true })
      switch (OPTION_STRING) {
        case '끄기':
          mode = 0
          break
        case '한곡만':
          mode = 1
          break
        case '전체':
          mode = 2
          break
      }
      mode = queue.setRepeatMode(mode)
      mode = mode ? (mode === 2 ? '한곡만' : '끄기') : '전체'
      interaction.reply({
        embeds: [
          new MessageEmbed().setTitle(`반복모드를 ${mode}로 설정했어요.`),
        ],
      })
    } else if (SUBCOMMAND_STRING === '음량조절') {
      const queue = interaction.client.distube.getQueue(interaction)
      const VOLUME_NUMBER = interaction.options.getNumber('음량')!
      if (!queue)
        return interaction.reply({ content: '큐가 없어요.', ephemeral: true })

      queue.setVolume(VOLUME_NUMBER)
      interaction.reply({
        embeds: [
          new MessageEmbed().setTitle(
            `음량을 ${VOLUME_NUMBER}으로 설정했어요.`
          ),
        ],
      })
    } else if (SUBCOMMAND_STRING === '건너뛰기') {
      const queue = interaction.client.distube.getQueue(interaction)
      if (!queue)
        return interaction.reply({ content: '큐가 없어요.', ephemeral: true })
      queue.skip()
      interaction.reply({
        embeds: [new MessageEmbed().setTitle('현재 노래를 스킵했어요.')],
      })
    } else if (SUBCOMMAND_STRING === '재생목록') {
      const queue = interaction.client.distube.getQueue(interaction)
      if (!queue)
        return interaction.reply({ content: '큐가 없어요.', ephemeral: true })
      queue.songs.map((song: Song, i: number) => {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle('재생목록')
              .setDescription(
                `${i === 0 ? '재생중' : `${i}.`} ${song.name} - ${
                  song.formattedDuration
                }`
              )
              .setThumbnail(song.thumbnail!),
          ],
        })
      })
    }
  }
}
