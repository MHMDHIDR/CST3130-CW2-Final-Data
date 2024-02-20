import { ALPHA_ADVANTAGE_NEWS_API_URL } from '.'
import { TextDataType, currenciesType } from './types'

export async function getTextData(toCurrency: currenciesType): Promise<TextDataType> {
  let url = ALPHA_ADVANTAGE_NEWS_API_URL(toCurrency)

  const response = await fetch(url)
  const data = await response.json()
  console.log('Request to: ', url)

  if (response.ok) {
    return data as TextDataType
  } else {
    console.error(`No Text data for --> ${toCurrency}`)
    console.log('-----------------------------------')
  }

  return data
}
