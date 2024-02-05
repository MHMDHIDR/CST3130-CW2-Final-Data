//Import AWS modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

async function updateItem(){
    //Create command with update parameters
    const command = new UpdateCommand({
        TableName: "Crypto",
        Key: {
            CurrencyTimeStamp: 2224,
            Currency: "Bitcoin",
        },
        UpdateExpression: "SET Price = :pr",
        ExpressionAttributeValues : {
            ':pr' : 1000
        }
    });

    //Update item and log results
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (err) {
        console.error("ERROR updating table: " + JSON.stringify(err));
    }
}
updateItem();

