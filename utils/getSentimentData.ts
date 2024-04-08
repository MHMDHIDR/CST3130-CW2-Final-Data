import axios from 'axios';
import { TEXT_PROCESSING_API } from '.';

// Calls web service and logs sentiment.
export async function getSentiment(text: string): Promise<number | undefined | null> {
  //Sent GET to endpoint with Axios
  let response = await axios.post(
    TEXT_PROCESSING_API,
    { text },
    { headers: { 'Content-Type': 'text/plain' } }
  );

  //Respone looks like this: { sentiment: 0.6666666666666666 }

  //Log result.
  console.log(`Sentiment: ${response.data.sentiment}.\nText: "${text}\n---".`);

  // Return sentiment
  return response.data.sentiment;
}
