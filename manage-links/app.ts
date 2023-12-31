import serverless from 'serverless-http';

import express, { Express, Request, Response } from 'express';

let app : Express = express();

app.use(express.json());

import ShortLinks from '../module_global/DB_Classes/ShortLinks';
import Validator from '../module_global/Validator';
import formatLinksList from '../module_global/format-links-list';

let shortLinksTable = new ShortLinks();

app.get('/short-linker/links-list', async (req : any, res : Response) => {
  let userId = req.requestContext.authorizer.lambda.userId;
  try {
    let list = await shortLinksTable.getByUserId(userId);
    if(!list) list = [];
    res.status(200).send(formatLinksList(list));
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
})

app.post('/short-linker/create-link', async (req : any, res : Response) => {
  let userId = req.requestContext.authorizer.lambda.userId;
  let { timeToLive, originalLink } = req.body;
  try {
    if(!timeToLive || !originalLink) throw new Error('Missing props');
    await Validator.prototype.validateOriginalLink(originalLink);
    timeToLive = Validator.prototype.validateLifetime(timeToLive);
    try {
      let link = await shortLinksTable.addLink(userId, originalLink, timeToLive);
      res.status(200);
      res.send({
        success: true,
        data: {
          newLinkCode: link.linkId,
          originalLink: link.origLink,
          timeToLive: link.timeToLive ? link.timeToLive : 'One Time Use'
        }
      })
     } catch(err) {
      console.log(err);
      res.status(500).send(err);
     }
  } catch(err) {
    res.status(400).send(err.message);
  }
})

app.delete('/short-linker/deactivate-link', async (req : any, res : Response) => {
  try{
    let { linkId } = req.body;
    let userId = req.requestContext.authorizer.lambda.userId;
    if(!linkId) {
      res.status(400).send('Invalid Params');
      return
    } 
    let linkData = await shortLinksTable.getById(linkId);
    if(!linkData) res.status(404).send('Link doesn\'t exist');
    else if(linkData.userId !== userId) res.status(403).send('You don\'t have access to this link');
    else {
      await shortLinksTable.deleteLink(linkId);
      res.status(200).send('Link deleted successfully');
    }
  } catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
})

let handler = serverless(app);

export { handler };