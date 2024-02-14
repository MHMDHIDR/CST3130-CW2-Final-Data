import 'dotenv/config'

export const ALPHA_ADVANTAGE_API_URL = (
  firstCurrency: string,
  secondCurrency: string
) => {
  if (!process.env.API_KEY) throw new Error('API_KEY not found')
  // return the API for query between two currencies
  return `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${firstCurrency}&to_symbol=${secondCurrency}&outputsize=full&apikey=${process.env.API_KEY}`
}

export const ALPHA_ADVANTAGE_NEWS_API_URL = (secondCurrency: string) => {
  if (!process.env.API_KEY) throw new Error('API_KEY not found')
  // return the API for query between second currency
  return `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&limit=50&tickers=FOREX:${secondCurrency}&apikey=${process.env.API_KEY}`
}
