// Import necessary libraries and commands
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'
import fs from 'fs'

// Create DynamoDB client
const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

// Function to query DynamoDB table for numerical data with specified currency
async function queryDynamoDB(currency) {
  const query = {
    TableName: 'QRExchangeRates',
    FilterExpression: 'toCurrency = :curr',
    ExpressionAttributeValues: {
      ':curr': currency
    }
  }

  try {
    const queryCommand = new ScanCommand(query)
    const response = await docClient.send(queryCommand)
    // Only retrieve the last 100 items
    response.Items = response.Items.slice(-100)
    return response.Items
  } catch (error) {
    console.error('Error querying DynamoDB:', error)
    throw error
  }
}

// Function to format data into JSON Lines format
function formatData(data) {
  const formattedData = {
    start: '2014-11-24 00:00:00',
    target: data.map(item => parseFloat(item.price))
  }
  return JSON.stringify(formattedData)
}

// Function to write data to JSON file
function writeToJsonFile(data, fileName) {
  try {
    fs.writeFileSync(fileName, data)
    console.log(`Data successfully written to ${fileName}`)
  } catch (error) {
    console.error('Error writing to JSON file:', error)
    throw error
  }
}

// Main function to query DynamoDB, format data, and write to JSON file
async function main() {
  const currency = 'SEK'
  const data = await queryDynamoDB(currency)
  const formattedData = formatData(data)
  const fileName = 'numerical_data_SEK.json'
  writeToJsonFile(JSON.stringify(data), fileName)
}

// Run the main function
main().catch(console.error)
