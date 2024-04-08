//Import library and scan command
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';

//Create client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Adds a connection ID to the database
 * @returns - Returns all of the connection IDs
 */
export async function getConnectionIds() {
  const scanCommand = new ScanCommand({
    TableName: 'WebSocketClients'
  });

  const response = await docClient.send(scanCommand);
  return response.Items;
}

/**
 * Formats the date to a string format
 * @param {*} date - The date to format
 * @returns - The formatted date
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * This function is used for Building a structure for the data to
 * be sent to the client
 * @param {*} currency - The currency to get data for
 * @returns - The data to send to the client
 */
export async function getData(currency) {
  // Create the numerical query
  const numericalQuery = {
    TableName: 'QRExchangeRates',
    FilterExpression: 'toCurrency = :curr',
    ExpressionAttributeValues: {
      ':curr': currency
    }
  };

  // Create the prediction query
  const predictionQuery = {
    TableName: 'Predictions',
    FilterExpression: 'Currency = :curr',
    ExpressionAttributeValues: {
      ':curr': currency
    }
  };

  let data = {
    numerical: { x: [], y: [] },
    predictions: { x: [], y: [] }
  };

  try {
    // Create the scan command
    const numericalQueryCommand = new ScanCommand(numericalQuery);
    const predictionQueryCommand = new ScanCommand(predictionQuery);

    // Send the scan command
    let numericalResults = await docClient.send(numericalQueryCommand);
    let predictionResults = await docClient.send(predictionQueryCommand);

    // push the numerical data into the data structure
    for (const item of numericalResults.Items) {
      data.numerical.x.push(formatDate(new Date(item.exTimestamp)));
      data.numerical.y.push(item.price);
    }

    // push the prediction data into the data structure
    for (const item of predictionResults.Items) {
      data.predictions.x.push(formatDate(new Date(item.TimePublished)));
      data.predictions.y.push(item.price); // Adjust this accordingly based on your 'Predictions' table structure
    }
  } catch (error) {
    console.log('error: ' + JSON.stringify(error));
  }

  return data;
}

/**
 * This function is used for Building a structure for the sentiment data to
 * be sent to the client
 * @param {*} currency - The currency to get data for
 * @returns - The data to send to the client
 */
export async function getSentimentData(currency) {
  const sentimentQuery = {
    TableName: 'QRExchangeSentimentData',
    KeyConditionExpression: 'Currency = :curr',
    ExpressionAttributeValues: {
      ':curr': currency
    }
  };

  let data = {
    sentiment: { x: [], y: [] }
  };

  try {
    const sentimentQueryCommand = new QueryCommand(sentimentQuery);
    let sentimentResults = await docClient.send(sentimentQueryCommand);

    console.log(`Number of sentimentResults: ${sentimentResults.Count}.`);

    for (const item of sentimentResults.Items) {
      console.log('item ->', item);
      data.sentiment.x.push(formatDate(new Date(item.TimePublished)));
      data.sentiment.y.push(item.sentiment);
    }
  } catch (error) {
    console.log('error: ' + JSON.stringify(error));
  }

  return data;
}

/**
 * This function is used to Delete the specified connection ID
 * @param {*} connectionId  - The connection ID to delete
 * @returns - The response from the delete command
 */
export async function deleteConnectionId(connectionId) {
  console.log('Deleting connection Id: ' + connectionId);

  // Create the delete command
  const deleteCommand = new DeleteCommand({
    TableName: 'WebSocketClients',
    Key: {
      ConnectionId: connectionId
    }
  });
  return docClient.send(deleteCommand);
}
