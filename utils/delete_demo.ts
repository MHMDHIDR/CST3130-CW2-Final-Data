//Import AWS modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

async function deleteItem(){
    //Create command with details of item we want to delete
    const command = new DeleteCommand({
        TableName: "Crypto",
        Key: {
            "Currency": "Bitcoin",
            "CurrencyTimeStamp": 2224
        }
    });
    //Execute command and output results
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (err) {
        console.error("ERROR deleting data: " + JSON.stringify(err));
    }
}

//Call function
deleteItem();
