import 'dotenv/config'

export type TimeSeriesEntryType = {
  '2. high': string
}

export type MetaDataType = {
  'Meta Data': any
  'Time Series FX (Daily)': { [date: string]: TimeSeriesEntryType }
}

export const ALPHA_ADVANTAGE_API_URL = (
  firstCurrency: string,
  secondCurrency: string
) => {
  if (!process.env.API_KEY) throw new Error('API_KEY not found')
  // return the API for query between two currencies
  return `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${firstCurrency}&to_symbol=${secondCurrency}&outputsize=full&apikey=${process.env.API_KEY}`
}

export const convertDatesToUnix = (data: {
  [date: string]: { '2. high': string }
}): { [date: string]: number } => {
  const unixDates: { [date: string]: number } = {}

  Object.keys(data).forEach(date => {
    const unixTimestamp = Date.parse(date) / 1000 // convert milliseconds to seconds
    unixDates[date] = unixTimestamp
  })

  return unixDates
}
