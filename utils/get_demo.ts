//Import AWS modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

//Send command and output results
async function getSingleItem(currency:string, time:number) : Promise<void> {
    //Create command
    const command = new GetCommand({
        TableName: "Crypto",
        Key: {
            CurrencyTimeStamp: time,
            Currency: currency
        }
    });

    //Execute command and output results
    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (err) {
        console.error("ERROR getting data: " + JSON.stringify(err));
    }
}

//Call function
getSingleItem("Dodgecoin", 2222);


