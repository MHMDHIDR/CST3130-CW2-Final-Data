import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi';
import { getData } from 'database.mjs';

//Create client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async event => {
  try {
    let data;

    // for (let record of event.Records) {
    if (record.eventName === 'INSERT') {
      if (record.dynamodb.NewImage.exTimestamp) {
        // get a hold of that data
        const toCurrency = record.dynamodb.NewImage.toCurrency.S;

        data = await getData(toCurrency);
        data.currency = toCurrency;
      } else {
        // get a hold of that data
        const Currency = record.dynamodb.NewImage.Currency.S;

        data = await getData(Currency);
        data.currency = Currency;
      }
    }
  } catch (err) {
    return { statusCode: 500, body: 'Error: ' + JSON.stringify(err) };
  }

  //Is data defined, if so, broadcast new data
  if (data) {
    //Get promises to send messages to connected clients
    let sendMsgPromises = await getSendMessagePromises(JSON.stringify(data));
  }
  //otherwise do nothing

  //Execute promises
  await Promise.all(sendMsgPromises);
};

//Success
return { statusCode: 200, body: 'Data sent successfully.' };

// Get the IDs for the connected clients
export async function getConnectionIds() {
  const scanCommand = new ScanCommand({
    TableName: 'WebSocketClients'
  });

  const response = await docClient.send(scanCommand);
  return response.Items;
}

//Returns promises to send messages to all connected clients
export async function getSendMessagePromises(message) {
  //Get connection IDs of clients
  let clientIdArray = await getConnectionIds();

  //Create API Gateway management class.
  const callbackUrl = 'https://z2jcqjqxml.execute-api.us-east-1.amazonaws.com/production';
  const apiGwClient = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

  //Try to send message to connected clients
  let msgPromiseArray = clientIdArray.map(async item => {
    // Get connected IDs
    const connId = item.ConnectionId;

    try {
      //Create post to connection command
      const postToConnectionCommand = new PostToConnectionCommand({
        ConnectionId: connId,
        Data: JSON.stringify(message)
      });

      //Wait for API Gateway to execute and log result
      await apiGwClient.send(postToConnectionCommand);
    } catch (err) {
      console.log('Failed to send message to: ' + connId);
    }
  });

  return msgPromiseArray;
}
