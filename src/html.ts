import * as vscode from 'vscode'
import * as path from 'path'
import { getNonce } from './utils'

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
  const nonce = getNonce()
  const rendererUri = getFileUri(webview, extensionPath, 'renderer.js')
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
        <h1 id="title"></h1>
        <div id="${canvasContainerId}"></div>
        <script nonce="${nonce}" src="${rendererUri}"></script>
      </body>
    </html>
  `
}

export default webviewContent
