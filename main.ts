import { uploadData } from './utils/uploadData';
import { getUnixTimestamp } from './utils/getUnixTimestamp';
//---- import get Data functions
import { getExchangeData } from './utils/getExchangeData';
import { getTextData } from './utils/getTextData';
import type {
  MetaDataType,
  TextDataType,
  currenciesType,
  exchangeDateType,
  textDataSummaryType
} from './utils/types';

const currencies: currenciesType[] = ['USD', 'GBP', 'AMD', 'PHP', 'SEK'];

async function getExchangeRates(): Promise<void> {
  try {
    for await (const toCurrency of currencies) {
      const data = (await getExchangeData(toCurrency)) as MetaDataType;
      const timeSeriesFXDaily = data['Time Series FX (Daily)'] ?? null;

      if (timeSeriesFXDaily && Object.keys(timeSeriesFXDaily).length > 0) {
        for await (const date of Object.keys(timeSeriesFXDaily)) {
          const unixTime: number = new Date(date).getTime();
          const highValue: string = timeSeriesFXDaily[date]['2. high'];

          // Store data in dynamoDB
          await uploadData('QRExchangeRates', {
            exTimestamp: unixTime,
            toCurrency,
            price: highValue
          } as exchangeDateType);
        }
      } else {
        console.error(`No exchange data to --> ${toCurrency}`);
        console.log('-----------------------------------');
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Unable to get exchange rates for currencies`);
  }
}

async function getSummaryTextData(): Promise<void> {
  try {
    for await (const toCurrency of currencies) {
      const data = (await getTextData(toCurrency)) as TextDataType;
      const news: textDataSummaryType[] = data['feed'];

      if (news && news.length > 0) {
        for await (const article of news) {
          const { summary, time_published } = article;

          // Store data in dynamoDB
          await uploadData('ExchangesTextData', {
            Currency: toCurrency,
            summary,
            TimePublished: getUnixTimestamp(String(time_published))
          } as textDataSummaryType);
        }
      } else {
        console.error(`No Text data for --> ${toCurrency}`);
        console.log('-----------------------------------');
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Unable to get text data for currencies`);
  }
}

// A function to getExchangeRates
getExchangeRates();

// A function to get text data
getSummaryTextData();
