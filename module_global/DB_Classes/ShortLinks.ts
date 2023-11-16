import { DeleteCommand, DeleteCommandInput, GetCommand, GetCommandInput, GetCommandOutput, PutCommand, PutCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import DbTable from "./Db-table";
import { nanoid } from "nanoid";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

export default class ShortLinks extends DbTable {
  #tableName : string | undefined = process.env.SHORT_LINKS_TABLE;
  async addLink(userId : string, origLink : string, timeToLive : number) : Promise<ShortLinkData> {
    try {
      let linkId : string = nanoid(6);
      if(await this.getById(linkId)) return await this.addLink(userId, origLink, timeToLive)
      let isOneTimeLink = false;
      if(!timeToLive) isOneTimeLink = true;
      let Item : ShortLinkData = {
        linkId,
        userId,
        origLink,
        timeToLive,
        isOneTimeLink,
        visits: 0
      }
      let params : PutCommandInput = {
        TableName: this.#tableName,
        Item
      }
      await this.client.send(new PutCommand(params));
      return Item; 
    } catch(err) {
      throw err;
    }
  }
  async getById(linkId : string) : Promise<ShortLinkData | undefined> {
    try {
      let params : GetCommandInput = {
        TableName: this.#tableName,
        Key: {
          linkId
        }
      }
      let result = await this.client.send(new GetCommand(params))
      if(result.Item && result.Item.isOneTimeLink) this.deleteLink(linkId);
      if(result.Item && !result.Item.isOneTimeLink) this.incrementVisitsNum(result.Item as ShortLinkData);
      return result.Item as ShortLinkData;
    } catch(err) {
      throw err;
    }
  }
  async deleteLink(linkId : string) : Promise<void> {
    try {
      let params : DeleteCommandInput = {
        TableName: this.#tableName,
        Key: { linkId }
      }
      let data = await this.client.send(new DeleteCommand(params));
      console.log(data);
    } catch(err) {
      throw err;
    }
  }
  async getByUserId(userId : string) : Promise<Array<ShortLinkData> | undefined> {
    let params : QueryCommandInput = {
      TableName: this.#tableName,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#userId": "userId"
      },
      ExpressionAttributeValues: {
        ":userId": { S: userId }
      }
    }
    try {
      let result = await this.client.send(new QueryCommand(params));
      return result.Items as Array<ShortLinkData> | undefined;
    } catch(err) {
      throw err;
    }
  }
  async incrementVisitsNum(item : ShortLinkData) : Promise<void> {
    try {
      item.visits++;
      let params : PutCommandInput = {
        TableName: this.#tableName,
        Item: item
      } 
      await this.client.send(new PutCommand(params));
    } catch(err) {
      console.log(err);
      throw err;
    }
  }
}