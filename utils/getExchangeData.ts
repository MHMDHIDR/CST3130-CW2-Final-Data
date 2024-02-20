import { ALPHA_ADVANTAGE_API_URL, BASE_CURRENCY } from '.'
import { MetaDataType, currenciesType } from './types'

export async function getExchangeData(toCurrency: currenciesType) {
  let url = ALPHA_ADVANTAGE_API_URL(BASE_CURRENCY, toCurrency)
  const response = await fetch(url)

  try {
    const data = (await response.json()) as MetaDataType
    return data
  } catch (e) {
    console.error(`No exchange data to --> ${toCurrency}`)
    console.log('-----------------------------------')
  }
}
