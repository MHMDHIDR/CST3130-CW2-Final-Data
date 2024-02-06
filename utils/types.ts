export type currenciesType = 'USD' | 'AMD' | 'PHP' | 'SEK' | 'OMR'

export type TimeSeriesEntryType = {
  '2. high': string
}

export type MetaDataType = {
  'Meta Data': any
  'Time Series FX (Daily)': { [date: string]: TimeSeriesEntryType }
}

export type exchangeDateType = {
  exTimestamp: number
  toCurrency: string
  price: string
}
