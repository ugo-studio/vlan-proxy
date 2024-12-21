import type { StatusCode } from 'hono/utils/http-status';
import type { Response } from 'node-fetch';

async function getRequestOptions(request: Request) {
  const method = request.method;
  const body = request.body ? Buffer.from(await request.arrayBuffer()) : null;
  const headers = Object.fromEntries(request.headers.entries());

  // Change host to target url host
  delete headers["host"];
  delete headers["proxy-authorization"];

  return { method, body, headers };
}

function getResponseOptions(response: Response) {
  const body = response.body as ReadableStream | null;
  const status = response.status as StatusCode;
  const headers = Object.fromEntries(response.headers.entries());

  // BUG: Bunjs remove's content-length header
  headers["x-content-length"] = headers["content-length"];

  // TODO: update `Location` header

  return { body, status, headers };
}

export { getRequestOptions, getResponseOptions };
