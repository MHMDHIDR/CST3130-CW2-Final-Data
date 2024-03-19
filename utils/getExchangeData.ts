import fs from 'fs'
import path from 'path'
import { ALPHA_ADVANTAGE_API_URL, BASE_CURRENCY } from '.'
import { MetaDataType, currenciesType } from './types'

export async function getExchangeData(toCurrency: currenciesType) {
  let url = ALPHA_ADVANTAGE_API_URL(BASE_CURRENCY, toCurrency)
  url = path.join(__dirname, '../data', `${toCurrency}.json`)
  try {
    const data = fs.readFileSync(url, 'utf8')
    return JSON.parse(data) as MetaDataType
  } catch (e) {
    console.error(`No exchange data to --> ${toCurrency}`)
    console.log('-----------------------------------')
  }
}
