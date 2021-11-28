// ignore: avoid_web_libraries_in_flutter
import 'dart:html';
import 'package:chrome_extension/startup.dart';
import 'package:flutter/material.dart';


String? url;

void main() {
  final channel = BroadcastChannel('images');
  channel.onMessage.listen((event) {
    url = event.data.payload;
  });
  runApp(App());
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Startup(),
    );
  }
}