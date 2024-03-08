import axios from 'axios'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

export const handler = async event => {
  console.log('Hello from ProcessSentimentData')

  // Declare const
  const client = new DynamoDBClient({})
  const documentClient = DynamoDBDocumentClient.from(client)
  const TEXT_PROCESSING_API = `https://kmqvzxr68e.execute-api.us-east-1.amazonaws.com/prod`

  for (let index = 0; index < event.Records.length; index++) {
    const record = event.Records[index]

    if (record.eventName === 'INSERT') {
      // get a hold of that data
      console.log('record -->', JSON.stringify(record))

      const timePublished = Number(record.dynamodb.NewImage.TimePublished.N)
      const toCurrency = record.dynamodb.NewImage.Currency.S
      const summary = record.dynamodb.NewImage.summary.S

      let response = await axios.post(
        TEXT_PROCESSING_API,
        { summary },
        { headers: { 'Content-Type': 'text/plain' } }
      )
      const sentimentData = response.data.sentiment

      const command = new PutCommand({
        TableName: 'QRExchangeSentimentData',
        Item: {
          TimePublished: timePublished,
          Currency: toCurrency,
          sentiment: sentimentData
        }
      })

      // Inserting the sentimentData into ['QRExchangeSentimentData'] table
      const dynamoResponse = await documentClient.send(command)
    }
  }

  // TODO implement
  const response = { statusCode: 200, body: JSON.stringify('Hello from Lambda!') }
  return response
}
