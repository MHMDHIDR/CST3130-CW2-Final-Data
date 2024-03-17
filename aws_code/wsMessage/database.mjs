//Import library and scan command
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb'

//Create client
const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

//Returns all of the connection IDs
export async function getConnectionIds() {
  const scanCommand = new ScanCommand({
    TableName: 'WebSocketClients'
  })

  const response = await docClient.send(scanCommand)
  return response.Items
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// Build a structure
export async function getData(currency) {
  const query = {
    TableName: 'QRExchangeRates',
    Limit: 5,
    ScanIndexForward: false,
    KeyConditionExpression: 'toCurrency = :curr',
    ExpressionAttributeValues: {
      ':curr': currency
    }
  }

  let data = { x: [], y: [] }

  try {
    const queryCommand = new QueryCommand(query)
    let results = await docClient.send(queryCommand)

    console.log(`Number of items: ${results.Count}.`)

    for (const item of results.Items) {
      data.x.push(formatDate(new Date(item.exTimestamp)))
      data.y.push(item.price)
    }
  } catch (error) {
    console.log('error: ' + JSON.stringify(error))
  }

  return JSON.stringify(data)
}

//Deletes the specified connection ID
export async function deleteConnectionId(connectionId) {
  console.log('Deleting connection Id: ' + connectionId)

  const deleteCommand = new DeleteCommand({
    TableName: 'WebSocketClients',
    Key: {
      ConnectionId: connectionId
    }
  })
  return docClient.send(deleteCommand)
}
