//Import AWS
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand
} from '@aws-sdk/client-sagemaker-runtime'

//Create SageMakerRuntimeClient
const client = new SageMakerRuntimeClient({})

const endpointData = {
  instances: [
    {"start":"2014-11-24 00:00:00","target":[0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27423,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419,0.27421,0.27419,0.27419,0.27421,0.27419,0.27419,0.27419,0.27419,0.27419,0.27419]}
  ],
  configuration: {
    num_samples: 50,
    output_types: ['mean']
  }
}

//Calls endpoint and logs results
async function invokeEndpoint() {
  //Create and send command with data
  const command = new InvokeEndpointCommand({
    EndpointName: 'USDEndpoint',
    Body: JSON.stringify(endpointData),
    ContentType: 'application/json',
    Accept: 'application/json'
  })
  const response = await client.send(command)

  //Must install @types/node for this to work
  let predictions = JSON.parse(Buffer.from(response.Body).toString('utf8'))
  console.log(predictions)
  console.log(JSON.stringify(predictions))

}

invokeEndpoint()
