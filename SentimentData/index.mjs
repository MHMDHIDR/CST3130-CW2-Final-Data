import axios from 'axios'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

// Declare const
const client = new DynamoDBClient({})
const documentClient = DynamoDBDocumentClient.from(client)
const TEXT_PROCESSING_API = `https://kmqvzxr68e.execute-api.us-east-1.amazonaws.com/prod`

export const handler = async event => {
  console.log('Hello console Log From ProcessSentimentData Lambda ', event)

  // check if there is a new record in the triggered table
  if (
    event['Records'] &&
    event['Records'].length &&
    event['Records'][0]['eventName'] === 'INSERT'
  ) {
    // get a hold of that data
    const record = event['Records'][0]['dynamodb']['NewImage']
    const timePublished = parseInt(record['TimePublished']['N'])
    const toCurrency = record['Currency']['S']
    const summary = record['summary']['S']

    let response = await axios.post(
      TEXT_PROCESSING_API,
      { summary },
      { headers: { 'Content-Type': 'text/plain' } }
    )
    const sentimentData = response.data.sentiment

    const command = new PutCommand({
      TableName: 'QRExchangeSentimentData',
      Item: { toCurrency, timePublished, sentiment: sentimentData }
    })

    // Inserting the sentimentData into ['QRExchangeSentimentData'] table
    const dynamoResponse = await documentClient.send(command)
    console.log(JSON.stringify(dynamoResponse, undefined, 2))
  }

  // TODO implement
  const response = { statusCode: 200, body: JSON.stringify('Hello from Lambda!') }
  return response
}
