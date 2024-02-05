//Import AWS modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

/* Retrieve all items with specified currency */
// const query = {
//     TableName: "Crypto",
//     KeyConditionExpression: "Currency = :curr",
//     ExpressionAttributeValues: {
//         ":curr" : "tron"
//     }
// };

/* 
    Have to create and use an index to retrieve all items with specified Time.
    ExpressionAttributeNames is used when we are using a reserved keyword for our name, such as Time. Added here for illustrative purposes. 
*/
// const query = {
//     TableName: "Crypto",
//     IndexName: "CurrencyTimeStamp-Currency-index",
//     KeyConditionExpression: "#tm = :ts",
//     ExpressionAttributeValues: {
//         ":ts" : 1705405364862
//     },
//     ExpressionAttributeNames: {"#tm" :"CurrencyTimeStamp"}
// };

/* Use expression to retrieve currencies with timestamp
    greater than specified value */
// const query = {
//     TableName: "Crypto",
//     KeyConditionExpression: "Currency = :curr AND CurrencyTimeStamp > :ts",
//     ExpressionAttributeValues: {
//         ":curr" : "bitcoin",
//         ":ts" : 1705405364861
//     }
// };

/* Retrieves bitcoin items with price greater than 3800
    Price is not an indexed field. */
// const query = {
//     TableName: "Crypto",
//     KeyConditionExpression: "Currency = :curr",
//     FilterExpression: "Price > :p",
//     ExpressionAttributeValues: {
//         ":curr" : "bitcoin",
//         ":p" : 3800
//     }
// };

/* Retrieves just the prices of the bitcoin items */
// const query = {
//     TableName: "Crypto",
//     KeyConditionExpression: "Currency = :curr",
//     ProjectionExpression: "Price",
//     ExpressionAttributeValues: {
//         ":curr" : "bitcoin",
//     }
// };

// /* Retrieve the most recent five tron prices*/
const query = {
    TableName: "Crypto",
    Limit: 5,
    ScanIndexForward: false,
    KeyConditionExpression: "Currency = :curr",
    ExpressionAttributeValues: {
        ":curr": "tron"
    }
};

//Runs the query and logs results
async function runQuery(): Promise<void> {
    try {
        const queryCommand = new QueryCommand(query);
        let result = await documentClient.send(queryCommand);
        console.log(`Number of items: ${result.Count}.`);
        console.log(result.Items);
    }
    catch (er) {
        console.log("error: " + JSON.stringify(er));
    }
}

runQuery();


