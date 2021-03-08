import * as vscode from 'vscode'
import * as kle from '@ijprest/kle-serial'
import * as path from 'path'
import { getNonce } from './utils'

const defaultLayout = require('../media/default-keyboard-layout.json')

const parseKle = (layout: any[]) => {
  try {
    return kle.Serial.deserialize(layout)
  } catch (e) {
    console.error(e)
  }
}

const getFileUri = (
  webview: vscode.Webview,
  extensionPath: string,
  filename: string
) =>
  webview.asWebviewUri(
    vscode.Uri.file(path.join(extensionPath, 'media', filename))
  )

const canvasContainerId = 'canvas-container'

const webviewContent = (webview: vscode.Webview, extensionPath: string) => {
  let content = ''

  // ToDo: use user provided custom layout
  const keyboard = parseKle(defaultLayout)
  if (!keyboard) {
    // ToDo: if layout fails, render default layout and error message
    content = `
      <h1>Failed to load keyboard-layout-editor data. Please review your json file.</h1>
    `
  } else {
    const nonce = getNonce()
    const rendererUri = getFileUri(webview, extensionPath, 'renderer.js')
    content = `
      <h1 class="title-success">Hurray!</h1>
      <div id="${canvasContainerId}"></div>
      <script nonce="${nonce}" src="${rendererUri}"></script>
    `
  }

  const stylesUri = getFileUri(webview, extensionPath, 'styles.css')

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'none'; script-src ${webview.cspSource}; style-src ${webview.cspSource};"
        />
        <link href="${stylesUri}" rel="stylesheet">
        <title>Cat Coding</title>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `
}

export default webviewContent
