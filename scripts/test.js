import 'dotenv/config';

import https from 'https';
import fetch from 'node-fetch';

const agent = new https.Agent({
  localAddress: process.env.LOCAL_ADDRESS,
});

fetch("https://example.com", { agent })
  .then((res) => res.text())
  .then(console.log)
  .catch(console.error);
