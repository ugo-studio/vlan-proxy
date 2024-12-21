import 'package:http/io_client.dart';
import 'dart:io';

Future<void> main() async {
  try {
    // Create HttpClient to set local address
    var httpClient = HttpClient();
    httpClient.connectionFactory = (uri, proxyHost, proxyPort) =>
        Socket.startConnect(InternetAddress("198.96.88.196"), 0);

    // Create http.Client with the custom HttpClient
    var client = IOClient(httpClient);

    // Make the request
    final response = await client.get(Uri.parse('https://example.com'));
    print(response.body);

    // Clean up
    client.close();
  } catch (e) {
    print('Error: $e');
  }
}
