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

//Returns all of the connection IDs
export async function getConnectionIds() {
  const scanCommand = new ScanCommand({
    TableName: 'WebSocketClients'
  });

  const response = await docClient.send(scanCommand);
  return response.Items;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Build a structure
export async function getData(currency) {
  const numericalQuery = {
    TableName: 'QRExchangeRates',
    FilterExpression: 'toCurrency = :curr',
    ExpressionAttributeValues: {
      ':curr': currency
    }
  };

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
    const numericalQueryCommand = new ScanCommand(numericalQuery);
    const predictionQueryCommand = new ScanCommand(predictionQuery);

    let numericalResults = await docClient.send(numericalQueryCommand);
    let predictionResults = await docClient.send(predictionQueryCommand);

    for (const item of numericalResults.Items) {
      data.numerical.x.push(formatDate(new Date(item.exTimestamp)));
      data.numerical.y.push(item.price);
    }

    for (const item of predictionResults.Items) {
      data.predictions.x.push(formatDate(new Date(item.TimePublished)));
      data.predictions.y.push(item.price); // Adjust this accordingly based on your 'Predictions' table structure
    }
  } catch (error) {
    console.log('error: ' + JSON.stringify(error));
  }

  return data;
}

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

//Deletes the specified connection ID
export async function deleteConnectionId(connectionId) {
  console.log('Deleting connection Id: ' + connectionId);

  const deleteCommand = new DeleteCommand({
    TableName: 'WebSocketClients',
    Key: {
      ConnectionId: connectionId
    }
  });
  return docClient.send(deleteCommand);
}
