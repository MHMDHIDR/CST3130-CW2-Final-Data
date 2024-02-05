//Import AWS modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

async function putData() : Promise<void> {
    //Create command with parameters of item we want to store
    const command = new PutCommand({
        TableName: "Crypto",
        Item: {
            "Currency": "Dodgecoin",
            "CurrencyTimeStamp": 2224,
            "Price": 7778
        }
    });

    //Store data in DynamoDB and handle errors
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (err) {
        console.error("ERROR uploading data: " + JSON.stringify(err));
    }
}

//Call function to store data
putData();

