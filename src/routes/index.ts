import express, {Request, Response, NextFunction, Router, query} from 'express';
import { Client } from 'tdl'
import { TDLib, defaultLibraryFile } from 'tdl-tdlib-addon'
import dotenv from 'dotenv';
import fs from 'fs';
import { getTdjson } from 'prebuilt-tdlib';
import path from 'path';

const router = Router();

dotenv.config();

const client = new Client(new TDLib(getTdjson()), {
  apiId: process.env.APP_ID as number | undefined,
  apiHash: process.env.APP_HASH
})
client
  // .on('update', update => {
  //   console.log('Got update:', JSON.stringify(update, null, 2))
  // })
  .on('error', err => {
    console.error('Got error:', JSON.stringify(err, null, 2))
  })
  .on('destroy', () => {
    console.log('destroy event')
  })

/* GET home page. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  await client.connectAndLogin();
  console.log(await client.invoke({ _: 'getMe' }));
  
  const getChats = await client.invoke({
    _: 'getChats',
    chat_list: { _: 'chatListMain'},
    limit: 1000
  })
  console.log(getChats);
  
  console.log(await test().catch(console.error));

  res.render('index', { title: 'Express' });
});

async function test() {
  const getMessages = await client.invoke({
    _: 'getTopChats',
    category: { _: 'topChatCategoryGroups'},
    limit: 10
  })
  return getMessages;
}

module.exports = router;
