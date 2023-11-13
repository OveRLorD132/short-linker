import express, { Express, Request, Response } from 'express';

import serverless from 'serverless-http';

let app : Express = express();

import ShortLinks from '../module_global/DB_Classes/ShortLinks';

let shortLinksTable = new ShortLinks();

app.get('/sh-lks/:link', async (req : Request, res : Response) => {
  let linkCode : string = req.params.link;
  let link = await shortLinksTable.getById(linkCode);
  if(!link) res.status(400).send('Link doesn\'t exist');
  else res.redirect(link.origLink);
})

let handler = serverless(app);

export { handler };