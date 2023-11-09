import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { GetCommand, GetCommandInput, PutCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs/dist/bcrypt";
import { v4 as uuidv4 } from 'uuid';
import DbTable from "../../../module_global/DB_Classes/Db-table";

export default class UsersTable extends DbTable {
  #tableName : string | undefined = process.env.USERS_TABLE;
  async scanTable() : Promise<any> {
    return await super.scanTable(this.#tableName);
  }
  async checkUniqueId(userId : string) : Promise<boolean> {
    let params : GetCommandInput = {
      TableName: this.#tableName,
      Key: { userId } 
    }
    try {
      let { Item } = await this.client.send(new GetCommand(params));
      if(!Item) return true;
      return false;
    } catch(err) {
      throw err;
    }
  }
  async checkUniqueEmail(email: string) : Promise<boolean> {
    let params : QueryCommandInput = {
      TableName : this.#tableName,
      IndexName: 'EmailIndex',
      KeyConditionExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": 'email'
      },
      ExpressionAttributeValues: {
        ":email": { S: email }
      }
    }
    try {
      let result = await this.client.send(new QueryCommand(params));
      console.log(result.Items);
      return result.Count === 0;
    } catch(err) {
      throw err;
    }
  }
  async addUser(email : string, password : string) : Promise<UserProfile> {
    let userId = uuidv4();
    try {
      if(!(await this.checkUniqueId(userId))) return await this.addUser(email, password);
      if(!(await this.checkUniqueEmail(email))) throw new Error('Email must be unique');
      password = await bcrypt.hash(password, 12);
      let params : UserInsertParams = {
        TableName: this.#tableName,
        Item: {
          userId,
          email,
          password
        }
      } 
      await this.client.send(new PutCommand(params)); 
      return { userId, email, password };
    } catch(err) {
      throw err;
    }
  }
}