import * as vscode from 'vscode'

// ToDo: Storage is sometimes still not sync'ed when a new event comes in
// this results in some missed keystrokes, on fast repeated actions
// maybe caching the keystrokes and updating them in batch can fix this

export const logger = async (
  contentChanges: readonly vscode.TextDocumentContentChangeEvent[],
  storage: vscode.Memento
) => {
  // Ignore if there are no content changes
  if (!contentChanges.length) {
    return
  }

  for (const change of contentChanges) {
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
    await storage.update(key, value + 1)
  }
}
