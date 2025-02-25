import moment from 'moment'

// Not sure why this doesn't work with moment. Will maybe revisit it.
export const formatTime = (seconds: string | null) => {
  if (!seconds) {
    return 'N/A'
  }

  const duration = moment.duration(parseInt(seconds, 10), 'seconds')
  const hours = Math.floor(duration.asHours()).toString().padStart(2, '0')
  const minutes = duration.minutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
