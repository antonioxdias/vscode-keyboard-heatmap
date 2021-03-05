import * as vscode from 'vscode'
import * as kle from '@ijprest/kle-serial'
import { TKeyPresses } from './utils'

const defaultLayout = require('./assets/keyboard-layout.json')

const parseKle = (layout: any[]) => {
  try {
    return kle.Serial.deserialize(layout)
  } catch (e) {
    console.error(e)
  }
}

const render = (data: TKeyPresses) => {
  let content,
    style = ''

  // ToDo: use user provided custom layout
  const keyboard = parseKle(defaultLayout)
  if (!keyboard) {
    // ToDo: if layout fails, render default layout and error message
    content = `
      <h1>Failed to load keyboard-layout-editor data. Please review your json file.</h1>
    `
  } else {
    content = `
      <h1>Hurray!</h1>
    `
  }

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `
}

export default {
  render
}
