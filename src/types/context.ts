import { type ConversationFlavor } from "@grammyjs/conversations"
import { HydrateFlavor } from "@grammyjs/hydrate"
import { I18nFlavor } from "@grammyjs/i18n"
import type { ParseModeFlavor } from "@grammyjs/parse-mode"
import { ChatTypeContext, Context as Default, SessionFlavor } from "grammy"

import { IUser } from "../database/user"

import { address, amount } from "../types/operation"

export type Color = "red" | "green" | "blue"

export interface SessionData {
  randomEmoji?: Color
  address?: address
  amount?: amount
  user?: IUser
}

type CustomContext = Default & I18nFlavor

export type Context = ParseModeFlavor<
  HydrateFlavor<
    CustomContext &
      ChatTypeContext<CustomContext, "private"> &
      SessionFlavor<SessionData> &
      ConversationFlavor
  >
>
