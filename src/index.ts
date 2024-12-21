import 'dotenv/config';

import { Hono } from 'hono';
import http from 'http';
import https from 'https';
import fetch from 'node-fetch';

const app = new Hono();

const httpAgent = http.Agent;
const httpsAgent = https.Agent;

// Proxy handler
app.get("/:vlanIP/*", async (c) => {
  const vlanIP = c.req.param("vlanIP").trim();

  // Capture everything after the VLAN IP
  const targetURL = c.req.url.substring(
    c.req.url.indexOf(vlanIP) + vlanIP.length + 1
  );

  if (!targetURL) {
    return c.json({ error: "Invalid targetURL" }, 400);
  }

  console.log(`Proxying url(${targetURL}) through ip(${vlanIP})`);

  try {
    // Construct the URL
    const target = decodeURIComponent(targetURL);

    // Parse and validate the target URL
    const parsedURL = new URL(target);

    // Use `agent` with the localAddress option
    const agent = new (parsedURL.protocol === "http:" ? httpAgent : httpsAgent)(
      {
        localAddress: vlanIP === "null" ? undefined : vlanIP,
      }
    );

    // Fetch with agant
    const response = await fetch(parsedURL, {
      agent,
      // method: c.req.raw.method,
      // headers: c.req.raw.headers,
      // body:
      //   c.req.method === "GET" || c.req.raw.body === null
      //     ? null
      //     : Buffer.from(await c.req.arrayBuffer()),
    });

    // Stream the response back to the client
    return c.newResponse(
      response.body as any,
      response.status as any,
      Object.fromEntries(response.headers.entries())
    );
  } catch (err: any) {
    console.error(
      `Failed to proxy url(${targetURL}) through ip(${vlanIP}), error(${err.message})`
    );
    return c.json({ error: err.message }, 500);
  }
});

// Root endpoint
app.get("/", (c) => {
  return c.text("ugo-studio/vlan-proxy");
});

// Start server
const { port } = Bun.serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 5753),
});

console.log(`Proxy server is running on http://localhost:${port}`);
