import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export default class DbTable {
  client : DynamoDBDocumentClient
  constructor() {
    let client = new DynamoDBClient();
    this.client = DynamoDBDocumentClient.from(client);
  }
}