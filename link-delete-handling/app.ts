import { DynamoDBStreamEvent } from "aws-lambda";

import { SQS, SendMessageCommandInput } from "@aws-sdk/client-sqs";

let client = new SQS({
  region: process.env.REGION,
  apiVersion: 'latest'
})

export async function handler(event : DynamoDBStreamEvent) : Promise<void> {
  for (let record of event.Records) {
    console.log(record);
    if(record.eventName === 'REMOVE') {
      console.log(process.env.QUEUE_LINK);
      let data = record.dynamodb;
      console.log(data);
      console.log(record);
      if(data) {
        let params : SendMessageCommandInput = {
          QueueUrl: process.env.QUEUE_LINK,
          MessageBody: JSON.stringify(data)
        }
        try {
          let res = await client.sendMessage(params);
          console.log(res);
        } catch(err) {
          console.log(err);
        }

      }
    } 
  }
}