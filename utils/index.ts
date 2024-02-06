import 'dotenv/config'

export const ALPHA_ADVANTAGE_API_URL = (
  firstCurrency: string,
  secondCurrency: string
) => {
  if (!process.env.API_KEY) throw new Error('API_KEY not found')
  // return the API for query between two currencies
  return `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${firstCurrency}&to_symbol=${secondCurrency}&outputsize=full&apikey=${process.env.API_KEY}`
}
