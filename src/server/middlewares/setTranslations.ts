import type { Request } from 'express'

import {
  type TSupportedLanguages,
  type TTranslations,
  defaultLang,
  supportedLangs,
} from 'i18n/i18nConfig'
import { initialState } from 'i18n/i18nSlice'
import type { RootState } from 'store/store'

interface ITranslations {
  [key: string]: string | ITranslations
}

const loadTranslations = async (lang: string): Promise<ITranslations> => {
  const json = await import(`i18n/translations/${lang}.json`, {
    assert: { type: 'json' },
  })
  return json.default
}

export const setTranslations = async (
  req: Request,
): Promise<Pick<RootState, 'i18n'>> => {
  const i18nState = { ...initialState }
  const userAcceptsLanguages = req.acceptsLanguages(
    Object.keys(supportedLangs),
  ) as keyof TSupportedLanguages | boolean
  let lang = defaultLang

  if (userAcceptsLanguages === false) {
    lang = defaultLang
  } else {
    lang = userAcceptsLanguages as keyof TSupportedLanguages
  }

  if (userAcceptsLanguages === defaultLang) return { i18n: i18nState }

  const translations = (await loadTranslations(lang)) as TTranslations
  i18nState.lang = lang as keyof TSupportedLanguages
  i18nState.translations = { ...i18nState.translations, [lang]: translations }

  return { i18n: i18nState }
}
