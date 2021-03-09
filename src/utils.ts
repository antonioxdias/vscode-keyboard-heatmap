import * as vscode from 'vscode'
import * as kle from '@ijprest/kle-serial'

export enum EKeysVariant {
  all,
  alphas,
  symbols,
  alphaSymbols
}

// key -> pressed key; value: no. of times pressed; weight: percentage from total
export type TKeyPresses = { [key: string]: { value: number; weight: number } }

const alphas = 'abcdefghijklmnopqrstuvwxyz'.split('')
const symbols = '|!@#$%&/\'"*{}?=+<>[]^~`(),.-_;:'.split('')
const xtra = ['space', 'enter', 'tab']

const charsForVariant = (variant: EKeysVariant) => {
  switch (variant) {
    case EKeysVariant.alphas:
      return alphas
    case EKeysVariant.symbols:
      return symbols
    case EKeysVariant.alphaSymbols:
      return [...alphas, ...symbols]
    default:
      return [...alphas, ...symbols, ...xtra]
  }
}

// returns a copy the the values in storage with usage frequencies
// for given chars dictionary
export const readFromStorage = (
  storage: vscode.Memento,
  variant: EKeysVariant
) => {
  // @ts-ignore
  const storageData = Object.entries(storage._value).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: Number(value) || 0
    }),
    {}
  ) as { [key: string]: number }

  const chars = charsForVariant(variant)
  const keys = Object.keys(storageData).filter((key) => chars.includes(key))
  const total = keys.reduce((sum, key) => sum + storageData[key], 0)

  const data: TKeyPresses = {}
  for (let key of keys) {
    const frequence = (storageData[key] * 100) / total
    data[key] = { value: storageData[key], weight: Math.round(frequence) }
  }
  return data
}

export const parseKle = (layout: any[]) => {
  try {
    return kle.Serial.deserialize(layout)
  } catch (e) {
    console.error(e)
  }
}

export const getNonce = () => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
