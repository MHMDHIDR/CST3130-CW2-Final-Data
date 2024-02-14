export function getUnixTimestamp(dateISO: string): number {
  // Extract components of the date
  const year = dateISO.substring(0, 4)
  const month = dateISO.substring(4, 6)
  const day = dateISO.substring(6, 8)
  const hours = dateISO.substring(9, 11)
  const minutes = dateISO.substring(11, 13)
  const seconds = dateISO.substring(13, 15)
  // Convert to a standard ISO 8601 date
  const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`)
  // Return the Unix timestamp
  return date.getTime()
}
