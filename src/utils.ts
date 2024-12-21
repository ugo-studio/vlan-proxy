import { type Response } from 'node-fetch';

async function getRequestOptions(request: Request, targetUrl: URL) {
  const method = request.method;
  const body = request.body ? Buffer.from(await request.arrayBuffer()) : null;
  const headers = Object.fromEntries(request.headers.entries());

  // Change host to target url host
  headers["host"] = targetUrl.host;
  delete headers["proxy-authorization"];

  return { method, body, headers };
}

function getResponseOptions(response: Response, _targetUrl: URL) {
  const body = response.body as any;
  const status = response.status as any;
  const headers = Object.fromEntries(response.headers.entries());

  // TODO: update `Location` header

  return { body, status, headers };
}

export { getRequestOptions, getResponseOptions };
