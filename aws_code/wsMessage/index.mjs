//Import external library with websocket functions
import { getSendMessagePromises } from './websocket.mjs'

export const handler = async event => {
  // get the connection id from the websocket client
  let connId = event.requestContext.connectionId

  try {
    //Get Message from event
    const data = JSON.parse(event.body).data

    //Extract domain and stage from event
    const domain = event.requestContext.domainName
    const stage = event.requestContext.stage
    const connectionId = event.requestContext.connectionId
    const currency = data.currency

    //Get promises to send messages to connected clients
    let sendMsgPromises = await getSendMessagePromises(
      domain,
      stage,
      connectionId,
      currency
    )

    //Execute promises
    await Promise.all(sendMsgPromises)
  } catch (err) {
    return { statusCode: 500, body: 'Error: ' + JSON.stringify(err) }
  }

  //Success
  return { statusCode: 200, body: 'Data sent successfully.' }
}
