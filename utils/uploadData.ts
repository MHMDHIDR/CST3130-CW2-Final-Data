//Import AWS modules
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { exchangeDateType } from './types'

//Create new DocumentClient
const client = new DynamoDBClient({})
const documentClient = DynamoDBDocumentClient.from(client)

//Stores demo data in database
export async function uploadData(Item: exchangeDateType) {
  //Create command
  const command = new PutCommand({
    TableName: 'QRExchangeRates',
    Item
  })

  //Store data in DynamoDB and handle errors
  try {
    const response = await documentClient.send(command)
    console.log(response)
  } catch (err) {
    console.error('ERROR uploading data: ' + JSON.stringify(err))
  }
}
