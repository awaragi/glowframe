export type ClockFormat = 'HH:mm' | 'HH:mm:ss' | 'hh:mm a' | 'hh:mm:ss a'

export function formatTime(date: Date, format: ClockFormat): string {
  const hours24 = date.getHours()
  const hours12 = hours24 % 12 || 12
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const ampm = hours24 < 12 ? 'AM' : 'PM'

  const HH = String(hours24).padStart(2, '0')
  const hh = String(hours12).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')

  switch (format) {
    case 'HH:mm':
      return `${HH}:${mm}`
    case 'HH:mm:ss':
      return `${HH}:${mm}:${ss}`
    case 'hh:mm a':
      return `${hh}:${mm} ${ampm}`
    case 'hh:mm:ss a':
      return `${hh}:${mm}:${ss} ${ampm}`
  }
}
