export type currenciesType = 'USD' | 'GBP' | 'AMD' | 'PHP' | 'SEK'

export type TimeSeriesEntryType = {
  '2. high': string
}

export type MetaDataType = {
  'Meta Data': string
  'Time Series FX (Daily)': { [date: string]: TimeSeriesEntryType }
}

export type TextDataType = {
  feed: textDataSummaryType[]
}

export type textDataSummaryType = {
  Currency?: string
  TimePublished: number
  time_published?: number
  summary: string
}

export type exchangeDateType = {
  exTimestamp: number
  toCurrency: string
  price: string
}
