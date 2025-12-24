const fastingForm = document.getElementById('fasting-form')
const dateInput = document.getElementById('date')
const timeInput = document.getElementById('time')
const startButton = fastingForm?.querySelector('.start-button')
const resultPanel = document.getElementById('fasting-result')
const resultStart = document.getElementById('fasting-start')
const resultEnd = document.getElementById('fasting-end')

const setButtonState = (state) => {
  if (!startButton) {
    return
  }
  startButton.dataset.state = state
  startButton.disabled = state === 'pending' || state === 'stopping'
}

const getEndpointForMode = (nextMode) => (nextMode === 'stop' ? '/stop' : '/start')

const setFormEndpoint = (nextMode) => {
  if (!fastingForm) {
    return
  }
  const endpoint = getEndpointForMode(nextMode)
  fastingForm.setAttribute('hx-post', endpoint)
}

const getInitialMode = () => (fastingForm?.getAttribute('hx-post') === '/stop' ? 'stop' : 'start')

const setResultVisible = (visible) => {
  if (!resultPanel) {
    return
  }
  if (visible) {
    resultPanel.removeAttribute('hidden')
  } else {
    resultPanel.setAttribute('hidden', 'hidden')
  }
}

const setResultTimes = (start, end) => {
  if (resultStart) {
    resultStart.textContent = start
  }
  if (resultEnd) {
    resultEnd.textContent = end
  }
}

if (fastingForm && dateInput && timeInput && startButton) {
  let mode = getInitialMode()
  let lastRequest = mode

  const setMode = (nextMode) => {
    mode = nextMode
    setFormEndpoint(nextMode)
  }

  fastingForm.addEventListener('submit', () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    dateInput.value = `${year}-${month}-${day}`
    timeInput.value = `${hours}:${minutes}`
  })

  fastingForm.addEventListener('htmx:configRequest', (event) => {
    event.detail.path = getEndpointForMode(mode)
  })

  fastingForm.addEventListener('htmx:beforeRequest', () => {
    lastRequest = mode
    if (mode === 'start') {
      setButtonState('pending')
    } else {
      setButtonState('stopping')
    }
  })

  fastingForm.addEventListener('htmx:afterRequest', (event) => {
    const status = event.detail?.xhr?.status ?? 0
    const requestSucceeded = status >= 200 && status < 400

    if (!requestSucceeded) {
      setButtonState(mode === 'start' ? 'idle' : 'active')
      return
    }

    if (lastRequest === 'start') {
      setMode('stop')
      setButtonState('active')
      return
    }

    const responseText = event.detail?.xhr?.responseText ?? ''
    if (responseText) {
      try {
        const payload = JSON.parse(responseText)
        if (payload?.start && payload?.end) {
          setResultTimes(payload.start, payload.end)
        }
      } catch {
        // Ignore parse errors and show placeholders.
      }
    }

    fastingForm.setAttribute('hidden', 'hidden')
    setResultVisible(true)
  })
}
