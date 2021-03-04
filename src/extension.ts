import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('Activate keyboard-heatmap logger. Type away!')

  const storage = context.globalState

  vscode.workspace.onDidChangeTextDocument(({ contentChanges }) => {
    // Ignore if there are no content changes
    if (!contentChanges.length) {
      return
    }

    for (const change of contentChanges) {
      console.log(contentChanges.length)
      const text = change.text

      // Ignore stringified json text
      if (text.startsWith('{\n')) {
        return
      }

      // Empty text can be backspace or delete
      // No way to differenciate, so ignore for now
      if (text === '') {
        return
      }

      let key: string
      if (text === ' ') {
        key = 'space' // Spaaaaaaace
      } else if (text.match(/^\n/)) {
        key = 'enter'
      } else if (text.match(/\s+|\t/g)) {
        key = 'tab' // Tab spaces or tab char
      } else {
        // grab the first char in text
        // vscode autofills surround chars for the user
        // but we only want the first char
        // ex.: typing '{' results in '{}' change
        key = text[0]
      }

      const value = Number(storage.get(key)) || 0
      storage.update(key, value + 1)
    }
  })

  const printLogs = vscode.commands.registerCommand(
    'keyboard-heatmap.printLogs',
    () => {
      // @ts-ignore
      console.log(storage._value)
    }
  )

  const resetLogs = vscode.commands.registerCommand(
    'keyboard-heatmap.resetLogs',
    () => {
      // @ts-ignore
      const keys = Object.keys(storage._value)
      for (let key of keys) {
        storage.update(key, undefined)
      }

      console.log('keyboard-heatmap logs reset successfull')
    }
  )

  context.subscriptions.push(printLogs, resetLogs)
}

export function deactivate() {}
