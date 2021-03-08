const canvasContainerId = 'canvas-container'

console.log('im in')
window.addEventListener('message', (ev) => {
  if (ev.data.keypresses) {
    console.log(ev.data.keypresses)
  }
})
