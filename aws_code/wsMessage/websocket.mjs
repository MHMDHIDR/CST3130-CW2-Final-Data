//Import functions for database
import { deleteConnectionId } from './database.mjs';

//Import API Gateway
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi';

/** A function to send a message to a connection ID
 * @param {string} domain - The domain of the API Gateway
 * @param {string} stage - The stage of the API Gateway
 * @param {string} connectionId - The connection ID to send the message to
 * @param {string} data - The data to send
 * @returns - Returns promises to send messages to all connected clients
 * @throws - Throws an error if the message fails to send
 * */
export async function sendMessage(domain, stage, connectionId, data) {
  //Create API Gateway management class.
  const callbackUrl = `https://${domain}/${stage}`;
  const apiGwClient = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });
  try {
    //Create post to connection command
    const postToConnectionCommand = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: data
    });

    console.log('Sending message to: ' + connectionId);
    console.log('Data => ', data);

    //Wait for API Gateway to execute and log result
    await apiGwClient.send(postToConnectionCommand);
  } catch (err) {
    console.log('Failed to send message to: ' + connectionId);

    //Delete connection ID from database
    if (err.statusCode == 410) {
      try {
        await deleteConnectionId(connectionId);
      } catch (err) {
        console.log('ERROR deleting connectionId: ' + JSON.stringify(err));
        throw err;
      }
    } else {
      console.log('UNKNOWN ERROR: ' + JSON.stringify(err));
      throw err;
    }
  }
}
