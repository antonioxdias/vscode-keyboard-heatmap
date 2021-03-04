import * as vscode from 'vscode'
import { logger } from './logger'

export function activate(context: vscode.ExtensionContext) {
  console.log('Activate keyboard-heatmap logger. Type away!')

  const storage = context.globalState

  vscode.workspace.onDidChangeTextDocument(({ contentChanges }) =>
    logger(contentChanges, storage)
  )

  const printLogs = vscode.commands.registerCommand(
    'keyboard-heatmap.printLogs',
    () => {
      // @ts-ignore
      console.log(storage._value)
    }
  )

  const resetLogs = vscode.commands.registerCommand(
    'keyboard-heatmap.resetLogs',
    async () => {
      // @ts-ignore
      const keys = Object.keys(storage._value)
      for (let key of keys) {
        await storage.update(key, undefined)
      }

      console.log('keyboard-heatmap logs reset successfull')
    }
  )

  context.subscriptions.push(printLogs, resetLogs)
}

export function deactivate() {}
