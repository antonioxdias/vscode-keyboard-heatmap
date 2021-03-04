import * as vscode from 'vscode'
import { readFromStorage } from './utils'

export const resetLogs = async (storage: vscode.Memento) => {
  const keypresses = readFromStorage(storage)

  const keys = Object.keys(keypresses)
  for (let key of keys) {
    await storage.update(key, undefined)
  }

  console.log('keyboard-heatmap logs reset successfull')
}

export const printLogs = (storage: vscode.Memento) => {
  const keypresses = readFromStorage(storage)

  const keys = Object.keys(keypresses)
  const total = keys.reduce((sum, key) => sum + keypresses[key], 0)

  for (let key of keys) {
    const frequence = (keypresses[key] * 100) / total
    console.log(key, keypresses[key], Math.round(frequence) + '%')
  }
}

export default {
  resetLogs,
  printLogs
}
