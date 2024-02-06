import { ALPHA_ADVANTAGE_API_URL, MetaDataType, convertDatesToUnix } from './utils'
// import fs from 'fs'

const currencies = ['USD', 'GPB', 'CAD', 'AUD', 'EUD']
const BASE_CURRENCY = 'QAR'

type TimeSeriesEntry = {
  '2. high': string
}

const getExchangeRate = async () => {
  try {
    // Fetch the exchange rate data from the Alpha Advantage API

    const response = await fetch(ALPHA_ADVANTAGE_API_URL(BASE_CURRENCY, currencies[0]))

    console.log('Request to: ', ALPHA_ADVANTAGE_API_URL(BASE_CURRENCY, currencies[0]))

    // Check if the response is OK
    if (response.status === 200) {
      const data = (await response.json()) as MetaDataType

      const exchangeRateHighData: { [date: string]: TimeSeriesEntry } = {}
      Object.keys(data['Time Series FX (Daily)']).forEach(date => {
        exchangeRateHighData[date] = {
          '2. high': data['Time Series FX (Daily)'][date]['2. high']
        }
      })

      const UnixDates = convertDatesToUnix(exchangeRateHighData)

      const exchangeRateHighDataWithUnixDates = Object.keys(exchangeRateHighData).map(
        (value, _index) => {
          return {
            timestamp: UnixDates[value],
            high: exchangeRateHighData[value]['2. high'],
            fromCurrency: BASE_CURRENCY,
            toCurrency: currencies[0]
          }
        }
      )

      console.log('Data Size: ', exchangeRateHighDataWithUnixDates.length)

      return { exchangeRateHighDataWithUnixDates }
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
