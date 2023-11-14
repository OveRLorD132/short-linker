import { SQSEvent, Context } from "aws-lambda";
import { SES } from '@aws-sdk/client-ses';
import formatQueryObject from '../module_global/format-query-object';
import UsersTable from "../module_global/DB_Classes/UsersTable";

let usersTable = new UsersTable();

let client = new SES({ region: process.env.REGION });

export async function handler(event : SQSEvent, context : Context) : Promise<any> {
  for(let record of event.Records) {
    if(!record.body) continue;
    let linkInfo = JSON.parse(record.body);
    linkInfo = formatQueryObject(linkInfo.OldImage)
    let userInfo = await usersTable.getById(linkInfo.userId);
    let email = `Your link has been expired.\n`;
    email += `Original link: ${linkInfo.origLink}\n`;
    email += `Link Code: ${linkInfo.linkId}\n`;
    email += `Visit Times: ${linkInfo.visits}\n`
    try {
      let data = await client.sendEmail({
        Destination: { ToAddresses: [ userInfo.email ] },
        Message: { Body: { Text: { Data: email } }, Subject: { Data: 'Link expired', Charset: 'UTF-8' } },
        Source: 'overlord32475@gmail.com'
      })
      console.log(data);
    } catch(err) {
      console.log(err);
    }

  }
}