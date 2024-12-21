import https from 'https';
import fetch from 'node-fetch';

const agent = new https.Agent({
  localAddress: "198.96.88.196",
});

fetch("https://example.com", { agent })
  .then((res) => res.text())
  .then(console.log)
  .catch(console.error);
