//Import AWS modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

//Send command and output results
async function scan() : Promise<void> {
    //Create command to scan entire table
    const command = new ScanCommand({
        TableName: "Crypto"
    });

    try {
        const response = await documentClient.send(command);
        console.log(response.Items);
    } catch (err) {
        console.error("ERROR scanning table: " + JSON.stringify(err));
    }
}

//Execute scan function
scan();


