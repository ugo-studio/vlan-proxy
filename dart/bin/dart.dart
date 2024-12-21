import 'dart:convert';
import 'dart:io';

import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:http/http.dart' as http;

Future<Response> proxyHandler(Request request) async {
  final vlanIP = request.url.pathSegments.isNotEmpty ? request.url.pathSegments.first : null;
  final remainingPath = request.url.pathSegments.skip(1).join('/');

  if (vlanIP == null || remainingPath.isEmpty) {
    return Response(400, body: jsonEncode({'error': 'Invalid targetURL'}));
  }

  final targetURL = Uri.decodeFull(remainingPath);
  print('Proxying url($targetURL) through ip($vlanIP)');

  try {
    final parsedURL = Uri.parse(targetURL);

    final client = HttpClient()
      ..connectionFactory = (uri, proxy, timeout) {
        return SecureSocket.connect(uri.host, uri.port, bindAddress: vlanIP == 'null' ? null : vlanIP);
      };

    final requestHeaders = request.headers;
    final httpClientRequest = await client.openUrl(
      request.method,
      parsedURL,
    );

    requestHeaders.forEach((key, value) {
      httpClientRequest.headers.set(key, value);
    });

    if (request.method != 'GET') {
      await httpClientRequest.addStream(request.read());
    }

    final httpClientResponse = await httpClientRequest.close();

    return Response(httpClientResponse.statusCode,
        body: httpClientResponse,
        headers: httpClientResponse.headers.forEach((key, values) => MapEntry(key, values.join(','))));
  } catch (e) {
    print('Failed to proxy url($targetURL) through ip($vlanIP), error(${e.toString()})');
    return Response(500, body: jsonEncode({'error': e.toString()}));
  }
}

Response rootHandler(Request request) {
  return Response.ok('ugo-studio/vlan-proxy');
}

void main(List<String> args) async {
  final handler = Pipeline()
      .addMiddleware(logRequests())
      .addHandler((Request request) {
    if (request.url.path == '') {
      return rootHandler(request);
    } else {
      return proxyHandler(request);
    }
  });

  final port = int.parse(Platform.environment['PORT'] ?? '5753');
  final server = await io.serve(handler, InternetAddress.anyIPv4, port);

  print('Proxy server is running on http://localhost:${server.port}');
}
