const canvasContainerId = 'canvas-container'
const unit = 54
const borderWidth = 2
const fontSize = 12

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

  const chars = Object.keys(data)
  console.log(chars)
  const ctx = canvas.getContext('2d')
  console.log(keyboard)
  console.log(data)

  // draw keys
  // for (let key of keyboard.keys) {
  //   // save clean context state
  //   ctx.save()

  //   // rotate context if key is rotated
  //   if (key.rotation_angle !== 0) {
  //     console.log(
  //       key.labels[key.labels.length - 1],
  //       key.rotation_angle,
  //       key.rotation_x,
  //       key.rotation_y,
  //       (key.rotation_angle * Math.PI) / 180
  //     )
  //     // ctx.translate(key.rotation_x, key.rotation_y)
  //     ctx.translate(key.rotation_x * unit - unit, key.rotation_y * unit - unit)
  //     ctx.rotate((key.rotation_angle * Math.PI) / 180)
  //     ctx.fillStyle = 'black'
  //     ctx.fillRect(0, 0, key.width * unit, key.height * unit)
  //     // ctx.fillStyle = 'rgba(100, 255, 100, 0.8)'
  //     // ctx.fillRect(0, 0, key.width * unit, key.height * unit)
  //     // ctx.fillStyle = 'rgba(100, 255, 100, 0.8)'
  //     // ctx.fillRect(0, 0, key.width * unit, key.height * unit)
  //     // ctx.fillStyle = 'rgba(100, 255, 255, 0.8)'
  //     // ctx.fillRect(
  //     //   key.rotation_x * unit,
  //     //   key.rotation_y * unit,
  //     //   key.width * unit,
  //     //   key.height * unit
  //     // )
  //     // ctx.fillStyle = 'rgba(100, 100, 255, 0.8)'
  //     // ctx.fillRect(
  //     //   key.x * unit,
  //     //   key.y * unit,
  //     //   key.width * unit,
  //     //   key.height * unit
  //     // )
  //   }

    // draw border
    ctx.fillStyle = 'rgba(100, 100, 100, 0.8)'
    ctx.fillRect(
      key.x * unit,
      key.y * unit,
      key.width * unit,
      key.height * unit
    )

    // draw key face
    ctx.fillStyle = `rgba(255, 255, 255, 0.8)`
    ctx.fillRect(
      key.x * unit + borderWidth,
      key.y * unit + borderWidth,
      key.width * unit - borderWidth * 2,
      key.height * unit - borderWidth * 2
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
        key.x * unit + borderWidth,
        key.y * unit + borderWidth,
        key.width * unit - borderWidth * 2,
        key.height * unit - borderWidth * 2
      )
    }

    // draw labels
    let offset = fontSize
    for (let label of key.labels.reverse()) {
      if (label && chars.includes(label.toLowerCase())) {
        ctx.font = `${fontSize}px Arial`
        ctx.fillStyle = 'rgb(0, 0, 0)'
        ctx.fillText(
          label,
          key.x * unit + borderWidth * 2,
          key.y * unit + borderWidth * 2 + offset
        )

        offset += fontSize
      }
    }
  }

  // revert context state to defaul
  ctx.restore()
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
