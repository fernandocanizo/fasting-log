import { decimal } from './decimal.ts'

type Direction = 'up' | 'down'

export const round = (time: string, direction: Direction = 'up'): string => {
  const [hourStr, minuteStr] = time.split(':')

  const minutes = decimal(minuteStr)

  if (minutes % 5 === 0) {
    // no rounding needed
    return time
  }

  const steps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  let i

  if (direction === 'up') {
    i = 0
    while (minutes > steps[i]) {
      i++
    }
  } else {
    i = steps.length - 1
    while (minutes < steps[i]) {
      i++
    }
  }

  return `${hourStr}:${String(steps[i]).padStart(2, '0')}`
}
