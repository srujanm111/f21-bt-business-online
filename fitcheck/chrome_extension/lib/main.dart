import 'package:chrome_extension/constants.dart';
import 'package:chrome_extension/landing.dart';
import 'package:flutter/material.dart';

// IMPORTANT
// Run this command to build chrome extension for release
// flutter build web --web-renderer html --csp

const chrome_debug = false;

void main() {
  runApp(App());
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'FitCheck',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: _debugWrap(Landing()),
    );
  }
}

Widget _debugWrap(Widget child) {
  return chrome_debug
      ? Stack(
          children: [
            Center(
              child: Container(
                height: 600,
                width: 360,
                decoration: BoxDecoration(
                  // border: Border.all(color: black),
                  borderRadius: BorderRadius.circular(10),
                  color: Colors.black,
                  // boxShadow: [
                  //   BoxShadow(color: Colors.grey, spreadRadius: 3),
                  // ],
                ),
                child: child,
              ),
            )
          ],
        )
      : child;
}

void pushReplace(Widget page, BuildContext context) {
  Navigator.of(context, rootNavigator: true).pushAndRemoveUntil(
    PageRouteBuilder(
      transitionDuration: const Duration(milliseconds: 200),
      pageBuilder: (context, animation1, animation2) => page,
      transitionsBuilder: (context, animation1, animation2, child) =>
          FadeTransition(
        opacity: animation1,
        child: _debugWrap(page),
      ),
    ),
    (Route<dynamic> route) => false,
  );
}
