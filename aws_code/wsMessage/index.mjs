//Import external library with websocket functions
import { sendMessage } from './websocket.mjs'
import { getData } from './database.mjs'

export const handler = async event => {
  // get the connection id from the websocket client
  let connId = event.requestContext.connectionId

  try {
    //Get Message from event
    const currency = JSON.parse(event.body).data.currency
    const data = await getData(currency)

    //Extract domain and stage from event
    const domain = event.requestContext.domainName
    const stage = event.requestContext.stage
    const connectionId = event.requestContext.connectionId
    // const currency = data.currency;

    //Get promises to send messages to connected clients
    await sendMessage(domain, stage, connectionId, JSON.stringify(data))
  } catch (err) {
    return { statusCode: 500, body: 'Error: ' + JSON.stringify(err) }
  }

  //Success
  return { statusCode: 200, body: 'Data sent successfully.' }
}
