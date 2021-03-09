const canvasContainerId = 'canvas-container'
const unit = 54

const renderLoadFail = () => {
  const titleEl = document.getElementById('title')
  if (titleEl) {
    titleEl.innerHTML =
      '<h1>Failed to load keyboard-layout-editor data. Please review your json file.</h1>'
  }
}

const render = (data, keyboard) => {
  const container = document.getElementById(canvasContainerId)
  if (!container) {
    return
  }

  const titleEl = document.getElementById('title')
  if (titleEl) {
    titleEl.innerHTML = 'Hurray!'
  }

  // create canvas
  const canvas = document.createElement('canvas')
  canvas.id = 'keyboard-heatmap'
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight
  // append to container
  container.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  console.log(keyboard)
  console.log(data)
  // draw keys
  for (let key of keyboard.keys) {
    // border
    ctx.fillStyle = 'rgba(100, 100, 100, 0.8)'
    ctx.fillRect(
      key.x * unit,
      key.y * unit,
      key.width * unit,
      key.height * unit
    )

    // key face
    ctx.fillStyle = `rgba(255, 255, 255, 0.8)`
    ctx.fillRect(
      key.x * unit + 2,
      key.y * unit + 2,
      key.width * unit - 4,
      key.height * unit - 4
    )

    // draw heat
    let weight = 0
    for (let l of key.labels) {
      if (l) {
        const label = l.toLowerCase()
        if (label && label in data) {
          weight += data[label].weight
        }
      }
    }

    if (weight > 0) {
      // convert to 0-1 then normalize it to have at least 0.1 opacity
      const opacity = (weight / 100) * 0.75 + 0.25
      ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`
      ctx.fillRect(
        key.x * unit + 2,
        key.y * unit + 2,
        key.width * unit - 4,
        key.height * unit - 4
      )
    }
  }
}

window.addEventListener('message', (ev) => {
  const { keypresses, keyboard } = ev.data
  if (keypresses) {
    if (keyboard) {
      render(keypresses, keyboard)
    } else {
      renderLoadFail()
    }
  }
})
