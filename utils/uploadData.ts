//Import AWS modules
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { exchangeDateType, textDataSummaryType } from './types';

//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

//Stores demo data in database
export async function uploadData(
  TableName: string,
  Item: exchangeDateType | textDataSummaryType
): Promise<void> {
  //Create command
  const command = new PutCommand({ TableName, Item });

  //Store data in DynamoDB and handle errors
  try {
    const response = await documentClient.send(command);
    let items: {};
    if ('toCurrency' in Item) {
      items = {
        Currency: Item.toCurrency,
        exTimestamp: Item.exTimestamp,
        price: Item.price
      } as exchangeDateType;
    } else {
      items = {
        Currency: Item.Currency,
        TimePublished: Item.TimePublished,
        summary: Item.summary
      } as textDataSummaryType;
    }
    console.log('\x1b[32m', `Uploaded ${JSON.stringify(items)} to table ${TableName}`);
  } catch (err) {
    console.error(
      '\x1b[31m',
      `ERROR uploading data to table ${TableName}: ${JSON.stringify(err)}`
    );
  }
}
