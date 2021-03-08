import * as vscode from 'vscode'
import * as kle from '@ijprest/kle-serial'

export type TKeyPresses = { [key: string]: number }

// returns a copy the the values in storage
export const readFromStorage = (storage: vscode.Memento) => {
  // @ts-ignore
  return Object.entries(storage._value).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: Number(value) || 0
    }),
    {}
  ) as TKeyPresses
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
