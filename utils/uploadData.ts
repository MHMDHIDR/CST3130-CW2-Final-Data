//Import AWS modules
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

//Create new DocumentClient
const client = new DynamoDBClient({})
const documentClient = DynamoDBDocumentClient.from(client)

//Stores demo data in database
export async function uploadData({ currencies }: { currencies: any[] }) {
  //Create Date class so we can obtain a starting timestamp
  let date: Date = new Date()
  let startTimestamp = date.getTime()

  //Add dummy data for four currencies
  for (let curr of currencies) {
    //Add ten lots of data for each currency
    for (let ts: number = 0; ts < 10; ++ts) {
      //Create command
      const command = new PutCommand({
        TableName: 'QRExchangeRates',
        Item: {
          toCurr: curr.toCurrency,
          exTimestamp: curr.timestamp,
          price: curr.high
        }
      })

      //Store data in DynamoDB and handle errors
      try {
        const response = await documentClient.send(command)
        console.log(response)
      } catch (err) {
        console.error('ERROR uploading data: ' + JSON.stringify(err))
      }
    }
  }
}
