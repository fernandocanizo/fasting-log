const dateInput = document.getElementById('date')
const timeInput = document.getElementById('time')

if (dateInput && timeInput) {
  startForm.addEventListener('submit', () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    const date = `${year}-${month}-${day}`
    const time = `${hours}-${minutes}`

    dateInput.value = date
    timeInput.value = time
  })
}
