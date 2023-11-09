import express, { Express, Request, Response } from 'express';

let app : Express = express();

import serverless from 'serverless-http';

import UsersTable from './module/DB/UsersTable';

let usersTable = new UsersTable();

import JWT from '../module_global/JWT';

app.use(express.json());

app.get('/auth/scan', async(req : Request, res : Response) => {
  res.status(200).send(await usersTable.scanTable());
})

app.post('/auth/sign-up', async (req : Request, res : Response) => {
  let { email, password } : AuthRequest = req.body;
  try {
    let profile : UserProfile = await usersTable.addUser(email, password);
    let authResponse = await JWT.prototype.generateToken(profile);
    res.status(200).send({
      success: true,
      data: authResponse
    })
  } catch(err) {
    if(err.message === 'Email must be unique') res.status(400).send(err.message);
    else {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  }
})

app.post('/auth/sign')

app.get('/auth/main', (req : Request, res : Response) : void => {
  res.status(200).send('Auth');
})

let handler = serverless(app);

export { handler };