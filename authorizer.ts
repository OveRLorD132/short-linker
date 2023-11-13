import { APIGatewayTokenAuthorizerEvent, PolicyDocument, AuthResponse, Context, ConditionBlock, Callback, APIGatewayAuthorizerResult } from "aws-lambda";

import JWT from "./module_global/JWT";

export async function handler(event : any, context : Context) : Promise<any> {
  try {
    let token : string = event.headers.authorization;
    console.log(token);
    if(!token) token = event.headers.Authorization
    token = token.replace(/Bearer /g, '');
    let profile : UserProfile = await JWT.prototype.checkToken(token);
    let response : AuthResponse = allowPolicy(profile.userId, '*');
    response.context = {
      userId: profile.userId
    }
    return response;
  } catch(err) {
    console.log(err);
    let result = denyPolicy('anonymous', '*');
    result.context = {
      "errorMessage": err
    }
    return result;
  }
}

function denyPolicy(id : string, resource : string) : AuthResponse {
  return {
    principalId: id,
    policyDocument: generatePolicy('Deny', resource),
  }
}

function allowPolicy(id : string, resource : string) : AuthResponse {
  console.log(arguments);
  return {
    principalId: id,
    policyDocument: generatePolicy('Allow', resource),
  }
}

function generatePolicy(effect : string, resource : string) : PolicyDocument {
  let doc : PolicyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }
    ]
  }
  return doc;
}