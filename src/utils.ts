import * as vscode from 'vscode'

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
