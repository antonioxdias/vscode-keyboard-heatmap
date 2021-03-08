import * as vscode from 'vscode'
import { readFromStorage, parseKle } from './utils'
import webViewContent from './html'

const defaultLayout = require('../media/default-keyboard-layout.json')

// reset session data
export const resetLogs = async (storage: vscode.Memento) => {
  const data = readFromStorage(storage)

  const keys = Object.keys(data)
  for (let key of keys) {
    await storage.update(key, undefined)
  }

  console.log('keyboard-heatmap logs reset successfull')
}

// print raw data to console
export const printLogs = (storage: vscode.Memento) => {
  const data = readFromStorage(storage)

  const keys = Object.keys(data)
  const total = keys.reduce((sum, key) => sum + data[key], 0)

  for (let key of keys) {
    const frequence = (data[key] * 100) / total
    console.log(key, data[key], Math.round(frequence) + '%')
  }
}

let panel: vscode.WebviewPanel | null = null

// generate and display heatmap in a webview
export const displayHeatmap = (
  storage: vscode.Memento,
  extensionPath: string
) => {
  const columnToShowIn =
    (vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined) || vscode.ViewColumn.One

  if (panel) {
    panel.reveal(columnToShowIn)
  } else {
    panel = vscode.window.createWebviewPanel(
      'keyboard-heatmap',
      'Keyboard Heatmap',
      columnToShowIn,
      { enableScripts: true }
    )
  }

  panel.onDidDispose(() => {
    panel = null
  }, null)

  panel.webview.html = webViewContent(panel.webview, extensionPath)

  const keypresses = readFromStorage(storage)
  const keyboard = parseKle(defaultLayout)
  panel.webview.postMessage({ keypresses, keyboard })
}

export default {
  resetLogs,
  printLogs,
  displayHeatmap
}
