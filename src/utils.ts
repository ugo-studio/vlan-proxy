async function getRequestOptions(request: Request, targetUrl: URL) {
  const method = request.method;
  const body = request.body ? Buffer.from(await request.arrayBuffer()) : null;
  const headers = Object.fromEntries(request.headers.entries());

  // Change host to target url host
  headers["host"] = targetUrl.host;
  delete headers["proxy-authorization"];

  return { method, body, headers };
}

export { getRequestOptions };
