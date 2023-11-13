import express, { Express, Request, Response } from 'express';

let app : Express = express();

import serverless from 'serverless-http';

import UsersTable from './module/DB/UsersTable';

let usersTable = new UsersTable();

import JWT from '../module_global/JWT';
import authenticate from './module/authenticate';

app.use(express.json());

app.post('/auth/sign-up', async (req : Request, res : Response) => {
  let status : number;
  let info : AuthenticationResponse;
  let { email, password } : AuthRequest = req.body;
  try {
    let profile : UserProfile = await usersTable.addUser(email, password);
    let authResponse = await JWT.prototype.generateToken(profile);
    status = 200;
    info = { success: true, data: authResponse };
  } catch(err) {
    if(err.message === 'Email must be unique') {
      status = 400; 
      info = {
        success: true,
        error: err.message
      }
    } else {
      console.log(err);
      status = 500;
      info = { success: false, error: err};
    }
  }
  res.status(status).send(info);
})

app.post('/auth/sign-in', async (req : Request, res : Response) => {
  let status : number;
  let info : AuthenticationResponse;
  let { email, password } : AuthRequest = req.body; 
  try {
    let profile = await authenticate(email, password);
    let tokens : AuthTokens = await JWT.prototype.generateToken(profile);
    status = 200;
    info = {
      success: true,
      data: tokens
    }
  } catch(err) {
    if(err.message === 'Profile doesn\'t exist' || err.message === 'Invalid password') {
      status = 400;
      info = {
        success: false,
        error: err.message
      }
    } else {
      console.log(err);
      status = 500;
      info = {
        success: false,
        error: err
      }
    }
  }
  res.status(status).send(info);
})

let handler = serverless(app);

export { handler };