import { ALPHA_ADVANTAGE_NEWS_API_URL } from '.'
import { TextDataType, currenciesType } from './types'

export async function getTextData(
  toCurrency: currenciesType
): Promise<TextDataType | undefined> {
  let url = ALPHA_ADVANTAGE_NEWS_API_URL(toCurrency)

  const response = await fetch(url)
  console.log('Request to: ', url)

  if (response.ok) {
    return (await response.json()) as TextDataType
  } else {
    console.error(`No Text data for --> ${toCurrency}`)
    console.log('-----------------------------------')
  }

  return undefined
}
