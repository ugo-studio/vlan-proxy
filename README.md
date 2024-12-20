Documentation: VLAN Proxy Server

This document explains how to set up and use the VLAN Proxy Server implemented with Hono.js. The server enables proxying HTTP requests through specific VLAN IPs.

---

Features

1. Root Endpoint: A simple test endpoint at / that returns a "Hello Hono!" message.

2. Proxy Endpoint: Forward requests using a specified VLAN IP.

Endpoint format: /:vlanIP/:targetURL

Example: http://localhost:5753/192.168.1.1/https://example.com

---

Setup Instructions

Prerequisites

Node.js: Ensure Node.js is installed (v18+ recommended).

NPM: Comes with Node.js; required to install dependencies.

1. Clone the Repository

Clone the repository or create a new folder for the project:

`git clone https://github.com/ugo-studio/vlan-proxy.git
cd vlan-proxy`

2. Install Dependencies

Install the required Node.js packages:

`npm install`

3. Update VLAN IP Configuration (Optional)

The server uses the localAddress option to bind to specific VLAN IPs.

If no VLAN IP is provided (e.g., /null/...), the server will use the default network interface.

---

Usage

1. Start the Server

Run the server:

node index.js

By default, the server listens on port 5753. To change the port, set the PORT environment variable:

PORT=8080 node index.js

2. Access the Endpoints

Root Endpoint:

URL: http://localhost:5753/

Response: "Hello Hono!"

Proxy Endpoint:

Format: http://localhost:5753/:vlanIP/:targetURL

:vlanIP: The VLAN IP to use for the outgoing request (use null to ignore).

:targetURL: The URL to proxy the request to.

Example:

curl http://localhost:5753/192.168.1.1/https://example.com/path?query=value

If 192.168.1.1 is a valid VLAN IP, the request will be forwarded to https://example.com/path?query=value using that IP.

---

Notes

Error Handling: If the targetURL is invalid or there’s an issue with the proxy request, the server returns an error response.

Example error response:

{
"error": "Invalid targetURL"
}

Local Address Fallback: If vlanIP is set to null, the default network interface is used.

---

Example

Proxy Request with VLAN IP

curl http://localhost:5753/192.168.1.1/https://jsonplaceholder.typicode.com/posts

VLAN IP: 192.168.1.1

Target URL: https://jsonplaceholder.typicode.com/posts

Response:

The response from https://jsonplaceholder.typicode.com/posts is streamed back to the client.

Proxy Request Without VLAN IP

curl http://localhost:5753/null/https://jsonplaceholder.typicode.com/posts

This routes the request through the default network interface.

---

Troubleshooting

1. Invalid VLAN IP:

Ensure the VLAN IP is configured on your system.

Use null if no VLAN IP is required.

2. Invalid Target URL:

Ensure the targetURL is correctly URL-encoded.

Example:

curl http://localhost:5753/192.168.1.1/https%3A%2F%2Fexample.com

---

License

This project is licensed under the MIT License.
