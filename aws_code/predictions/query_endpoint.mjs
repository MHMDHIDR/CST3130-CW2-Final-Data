import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand
} from '@aws-sdk/client-sagemaker-runtime'
import fs from 'fs'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

// Create new DocumentClient for DynamoDB
const client = new DynamoDBClient({})
const documentClient = DynamoDBDocumentClient.from(client)

// Step 1: get the first timestamp from numerical_data then add one day to each timestamp
const dataPath = 'numerical_data_SEK.json'
const rawData = fs.readFileSync(dataPath)
const data = JSON.parse(rawData)
const lastTimestamp = data[data.length - 1].exTimestamp

// Step 3: Combine incremented timestamps with prediction values
const endpointData = {
  instances: [
    {
      start: '2014-11-24 00:00:00',
      target: []
    }
  ],
  configuration: {
    num_samples: 50,
    output_types: ['mean']
  }
}

// Create SageMakerRuntimeClient
const sagemakerClient = new SageMakerRuntimeClient({})

// Calls endpoint and logs results
async function invokeEndpoint() {
  try {
    // Create and send command with data to SageMaker endpoint
    const command = new InvokeEndpointCommand({
      EndpointName: 'SEKEndpoint',
      Body: JSON.stringify(endpointData),
      ContentType: 'application/json',
      Accept: 'application/json'
    })
    const response = await sagemakerClient.send(command)

    // Parse response from SageMaker
    const predictions = JSON.parse(Buffer.from(response.Body).toString('utf8'))
    console.log(predictions)
    console.log('\x1b[35m', JSON.stringify(predictions))

    // Step 2: Increment each timestamp by one day
    const oneDay = 24 * 60 * 60 * 1000 // 1 day in milliseconds
    const incrementedData = data.slice(0, 50).map((item, index) => ({
      ...item,
      exTimestamp: lastTimestamp + oneDay * (index + 1)
    }))

    // Combine incremented timestamps with prediction values
    endpointData.instances[0].target = incrementedData.map(item => item.price)

    // Step 4: Upload the data to DynamoDB
    const TableName = 'Predictions'

    const combinedData = incrementedData.map((item, index) => ({
      Currency: 'SEK',
      TimePublished: item.exTimestamp,
      price: predictions.predictions[0].mean[index]
    }))

    // Upload data to DynamoDB
    combinedData.forEach(async item => {
      // Create PutCommand
      const command = new PutCommand({ TableName, Item: item })

      // Send command to DynamoDB and handle errors
      try {
        const response = await documentClient.send(command)
        console.log('\x1b[32m', `Uploaded ${JSON.stringify(item)} to table ${TableName}`)
      } catch (err) {
        console.error(
          '\x1b[31m',
          `ERROR uploading data to table ${TableName}: ${JSON.stringify(err)}`
        )
      }
    })
  } catch (error) {
    console.error('Error invoking endpoint:', error)
  }
}

// Invoke the endpoint function
invokeEndpoint()
