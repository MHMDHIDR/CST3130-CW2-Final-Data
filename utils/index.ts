import 'dotenv/config'

export const BASE_CURRENCY = 'QAR'

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
  return `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&limit=5&tickers=FOREX:${secondCurrency}&apikey=${process.env.API_KEY}`
}

/** Calls web service provided for sentiment analysis on CST 3130 
  URL: https://kmqvzxr68e.execute-api.us-east-1.amazonaws.com/prod
  Use HTTP POST
  Set Content-Type to text/plain
  Put text in body of message.
*/
export const TEXT_PROCESSING_API = `https://kmqvzxr68e.execute-api.us-east-1.amazonaws.com/prod`
