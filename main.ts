import path from 'path'
import { ALPHA_ADVANTAGE_API_URL } from './utils'
import { MetaDataType, currenciesType, exchangeDateType } from './utils/types'
import fs from 'fs'
import { uploadData } from './utils/uploadData'

const currencies: currenciesType[] = ['USD', 'AMD', 'PHP', 'OMR', 'SEK']
const BASE_CURRENCY = 'QAR'
const USE_API = true
const getExchangeRates = async () => {
  try {
    for await (const toCurrency of currencies) {
      const data = (await getData(toCurrency)) as MetaDataType
      const timeSeriesFXDaily = data['Time Series FX (Daily)']

      if (timeSeriesFXDaily && Object.keys(timeSeriesFXDaily).length > 0) {
        for await (const date of Object.keys(timeSeriesFXDaily)) {
          const unixTime = new Date(date).getTime()
          const highValue = timeSeriesFXDaily[date]['2. high']

          // Store data in dynamoDB
          await uploadData({
            exTimestamp: unixTime,
            toCurrency,
            price: highValue
          } as exchangeDateType)
        }
      } else {
        console.error(`No exchange data to --> ${toCurrency}`)
        console.log('-----------------------------------')
      }
    }
  } catch (error) {
    console.error(error)
    throw new Error(`Unable to get exchange rates for currencies`)
  }
}

async function getData(toCurrency: currenciesType) {
  let url = ALPHA_ADVANTAGE_API_URL(BASE_CURRENCY, toCurrency)
  if (!USE_API) {
    url = path.join(__dirname, 'data', `${toCurrency}.json`)
    try {
      const data = fs.readFileSync(url, 'utf8')
      return JSON.parse(data) as MetaDataType
    } catch (e) {
      console.error(`No exchange data to --> ${toCurrency}`)
      console.log('-----------------------------------')
    }
  } else {
    const response = await fetch(url)
    console.log('Request to: ', url)
    if (response.ok) {
      return (await response.json()) as MetaDataType
    } else {
      console.error(`No exchange data for --> ${toCurrency}`)
      console.log('-----------------------------------')
    }
  }
}

getExchangeRates()
