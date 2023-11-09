import { GetCommand, GetCommandInput, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import DbTable from "./Db-table";

export default class RefreshTokens extends DbTable {
  #tableName : string | undefined = process.env.TOKENS_TABLE;
  async addToken(userId : string, token : string) : Promise<void> {
    try {
      let params : PutCommandInput = {
        TableName: this.#tableName,
        Item: {
          userId,
          token
        }
      }
      await this.client.send(new PutCommand(params))
    } catch(err) {
      throw err;
    }
  }
  async getToken(userId : string) : Promise<TokenInfo> {
    try {
      let params : GetCommandInput = {
        TableName: this.#tableName,
        Key: { userId }
      }
      let { Item } = await this.client.send(new GetCommand(params))
      return Item as TokenInfo;
    } catch(err) {
      throw err;
    }
  }
}