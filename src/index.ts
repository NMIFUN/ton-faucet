import config from './types/config'

import { connect } from 'mongoose'
connect(config.MONGO_URI)

import { Bot, session } from 'grammy'
import { run, sequentialize } from '@grammyjs/runner'
import { hydrateReply, parseMode } from '@grammyjs/parse-mode'
import { hydrate } from '@grammyjs/hydrate'
import { conversations, createConversation } from '@grammyjs/conversations'

import { Context, SessionData } from './types/context'
import { setUser } from './middlewares/setUser'

const bot = new Bot<Context>(config.BOT_TOKEN)

bot.catch(err => console.error(err))

import { i18n } from './i18n'
bot.use(i18n)

bot.use(hydrateReply)
bot.use(hydrate())
bot.api.config.use(parseMode('HTML'))
bot.use(sequentialize((ctx: Context) => ctx.chat?.id.toString()))
bot.use(session({ initial: (): SessionData => ({}) }))
bot.use(conversations())

const privateBot = bot.chatType('private')
privateBot.use(setUser())

import start from './actions/start'
privateBot.command('start', start)

import language from './actions/language'
privateBot.use(language)
privateBot.command('language', ctx =>
  ctx.reply(ctx.t('language'), { reply_markup: language })
)

import cancel from './actions/cancel'
privateBot.command('cancel', cancel)
privateBot.callbackQuery('cancel', cancel)

/*import accept from './actions/accept'
privateBot.callbackQuery(/^accept_([^_]+)/, accept)*/

import operation from './actions/operation'
privateBot.use(createConversation(operation))

privateBot.command('get', ctx => ctx.conversation.enter('operation'))

privateBot.on('message', ctx => start)

run(bot, { runner: { fetch: { allowed_updates: config.BOT_ALLOWED_UPDATES } } })
