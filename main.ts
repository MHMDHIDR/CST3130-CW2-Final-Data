// main.ts
import { ALPHA_ADVANTAGE_API_URL, convertDatesToUnix } from './utils'

const currencies = ['QAR', 'USD', 'GPB', 'CAD', 'AUD', 'EUD']

type TimeSeriesEntry = {
  '2. high': string
}

const getExchangeRate = async () => {
  try {
    console.log('Hello World from the main.ts file')

    const response = await fetch(ALPHA_ADVANTAGE_API_URL(currencies[0], currencies[1]))
    if (response.status === 200) {
      const data = (await response.json()) as {
        'Meta Data': any
        'Time Series FX (Daily)': { [date: string]: TimeSeriesEntry }
      }

      const exchangeRateHighData: { [date: string]: TimeSeriesEntry } = {}
      Object.keys(data['Time Series FX (Daily)']).forEach(date => {
        exchangeRateHighData[date] = {
          '2. high': data['Time Series FX (Daily)'][date]['2. high']
        }
      })

      const UnixDates = convertDatesToUnix(exchangeRateHighData)

      console.log(UnixDates)

      return { exchangeRateHighData }
    } else {
      console.error('Unable to get exchange rate for Currencies')
      throw new Error('Unable to get exchange rate for Currencies')
    }
  } catch (error) {
    console.error(error)
    throw new Error(`Unable to get exchange rate for Currencies`)
  }
}

getExchangeRate()
