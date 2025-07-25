/* Calls web service provided for sentiment analysis on CST 3130 
    URL: https://kmqvzxr68e.execute-api.us-east-1.amazonaws.com/prod
    Use HTTP POST
    Set Content-Type to text/plain
    Put text in body of message. */

//Axios handles HTTP requests to web service
import axios from 'axios'

//Text examples
const happyText = 'I am feeling very happy indeed'
const sadText = 'My cat is sad today'
const neutralText = 'There is an apple on the table'

// Calls web service and logs sentiment.
export async function getSentiment(summary) {
  //URL of web service
  const TEXT_PROCESSING_API =
    'https://kmqvzxr68e.execute-api.us-east-1.amazonaws.com/prod'

  //Sent GET to endpoint with Axios
  let response = await axios.post(
    TEXT_PROCESSING_API,
    { summary },
    { headers: { 'Content-Type': 'text/plain' } }
  )
  const sentimentData = response.data.sentiment

  console.log('sentimentData is: ', sentimentData)

  //Respone looks like this: { sentiment: 0.6666666666666666 }

  //Log result.
  // console.log(`Sentiment: ${response.data.sentiment}.\nText: "${text}\n---".`)
}

getSentiment(happyText)
getSentiment(sadText)
getSentiment(neutralText)
