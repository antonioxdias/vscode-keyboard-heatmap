import * as vscode from 'vscode'
import { readFromStorage } from './utils'

// reset session data
export const resetLogs = async (storage: vscode.Memento) => {
  const keypresses = readFromStorage(storage)

  const keys = Object.keys(keypresses)
  for (let key of keys) {
    await storage.update(key, undefined)
  }

  console.log('keyboard-heatmap logs reset successfull')
}

// print raw data to console
export const printLogs = (storage: vscode.Memento) => {
  const keypresses = readFromStorage(storage)

  const keys = Object.keys(keypresses)
  const total = keys.reduce((sum, key) => sum + keypresses[key], 0)

  for (let key of keys) {
    const frequence = (keypresses[key] * 100) / total
    console.log(key, keypresses[key], Math.round(frequence) + '%')
  }
}

let panel: vscode.WebviewPanel | null = null

// generate and display heatmap in a webview
export const displayHeatmap = (storage: vscode.Memento) => {
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
      {}
    )
  }

  panel.webview.html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cat Coding</title>
  </head>
  <body>
      <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
  </body>
  </html>`

  panel.onDidDispose(() => {
    panel = null
  }, null)
}

export default {
  resetLogs,
  printLogs,
  displayHeatmap
}
