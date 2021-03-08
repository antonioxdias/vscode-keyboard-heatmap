import * as vscode from 'vscode'
import { logger } from './logger'
import { resetLogs, printLogs, displayHeatmap } from './commands'

export function activate(context: vscode.ExtensionContext) {
  console.log('Activate keyboard-heatmap logger. Type away!')

  const storage = context.globalState

  vscode.workspace.onDidChangeTextDocument(({ contentChanges }) =>
    logger(contentChanges, storage)
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'keyboard-heatmap.resetLogs',
      async () => await resetLogs(storage)
    ),

    vscode.commands.registerCommand('keyboard-heatmap.printLogs', () =>
      printLogs(storage)
    ),

    vscode.commands.registerCommand('keyboard-heatmap.displayHeatmap', () =>
      displayHeatmap(storage, context.extensionPath)
    )
  )
}

export function deactivate() {}
