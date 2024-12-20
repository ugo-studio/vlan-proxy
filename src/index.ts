import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { fetch, Agent } from "undici";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Proxy handler
app.get("/:vlanIP/*", async (c) => {
  const vlanIP = c.req.param("vlanIP");
  const targetURL = c.req.url.split(`/${vlanIP}/`).pop(); // Capture everything after the VLAN IP

  if (!targetURL) {
    return c.json({ error: "Invalid targetURL" }, 400);
  }

  try {
    // Construct the URL
    const target = decodeURIComponent(targetURL);

    // Parse and validate the target URL
    const parsedURL = new URL(target);

    // Use `fetch` with the localAddress option
    const response = await fetch(parsedURL.toString(), {
      method: c.req.raw.method,
      headers: c.req.raw.headers,
      body: c.req.method !== "GET" ? await c.req.text() : null,
      dispatcher: new Agent({
        localAddress: vlanIP === "null" ? undefined : vlanIP,
      }),
    });

    // Stream the response back to the client
    return c.newResponse(
      response.body as any,
      response.status as any,
      Object.fromEntries(response.headers.entries())
    );
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT || 5753),
  },
  ({ port }) => console.log(`Server is running on http://localhost:${port}`)
);
