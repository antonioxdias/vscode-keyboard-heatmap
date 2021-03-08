const canvasContainerId = 'canvas-container'

const renderLoadFail = () => {
  const titleEl = document.getElementById('title')
  if (titleEl) {
    titleEl.innerHTML =
      '<h1>Failed to load keyboard-layout-editor data. Please review your json file.</h1>'
  }
}

const render = (data, keyboard) => {
  const titleEl = document.getElementById('title')
  if (titleEl) {
    titleEl.innerHTML = 'Hurray!'
  }
}

window.addEventListener('message', (ev) => {
  const { keypresses, keyboard } = ev.data
  console.log(keypresses, keyboard)
  if (keypresses) {
    if (keyboard) {
      render(keypresses, keyboard)
    } else {
      renderLoadFail()
    }
  }
})
