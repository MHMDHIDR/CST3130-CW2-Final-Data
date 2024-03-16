//Import external library with websocket functions
import { getSendMessagePromises } from './websocket.mjs'

export const handler = async (event) => {
    //console.log(JSON.stringify(event));
    try {
        //Get Message from event
        const msg = JSON.parse(event.body).data;
        console.log("Message: " + msg);

        //Extract domain and stage from event
        const domain = event.requestContext.domainName;
        const stage = event.requestContext.stage;
        console.log("Domain: " + domain + " stage: " + stage);

        //Get promises to send messages to connected clients
        let sendMsgPromises = await getSendMessagePromises(msg, domain, stage);

        //Execute promises
        await Promise.all(sendMsgPromises);
    }
    catch(err){
        return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
    }

    //Success
    return { statusCode: 200, body: "Data sent successfully." };
};
