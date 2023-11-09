import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand 
} from "@aws-sdk/lib-dynamodb";
import { env } from "process";

let client = new DynamoDBClient();

let dynamoDBClient = DynamoDBDocumentClient.from(client);

import express, { Express, Request, Response } from 'express';

import serverless from 'serverless-http';

let app : Express = express();

app.get('/sh-lkr/hihi', async (req : Request, res : Response) => {
  let response = await dynamoDBClient.send(new GetCommand({ TableName: env.USERS_TABLE, Key: {userId: 'string'} }))
  res.status(200).send(response);
})

let handler = serverless(app);

export { handler };