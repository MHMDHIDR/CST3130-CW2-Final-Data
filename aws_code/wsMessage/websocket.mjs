//Import functions for database
import { getConnectionIds, deleteConnectionId, getData } from './database.mjs'

//Import API Gateway
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi'

//Returns promises to send messages to all connected clients
export async function getSendMessagePromises(domain, stage, ConnectionId, currency) {
  let clientIdArray = await getConnectionIds()

  //Create API Gateway management class.
  const callbackUrl = `https://${domain}/${stage}`
  const apiGwClient = new ApiGatewayManagementApiClient({ endpoint: callbackUrl })

  let msgPromiseArray = clientIdArray.map(async item => {
    try {
      const data = await getData(currency)

      //Create post to connection command
      const postToConnectionCommand = new PostToConnectionCommand({
        ConnectionId,
        Data: data
      })

      console.log('currency is => ', currency)
      console.log('Sending message to: ' + ConnectionId)
      console.log('Data => ', data)

      //Wait for API Gateway to execute and log result
      await apiGwClient.send(postToConnectionCommand)
    } catch (err) {
      console.log('Failed to send message to: ' + ConnectionId)

      //Delete connection ID from database
      if (err.statusCode == 410) {
        try {
          await deleteConnectionId(ConnectionId)
        } catch (err) {
          console.log('ERROR deleting connectionId: ' + JSON.stringify(err))
          throw err
        }
      } else {
        console.log('UNKNOWN ERROR: ' + JSON.stringify(err))
        throw err
      }
    }
  })

  return msgPromiseArray
}
