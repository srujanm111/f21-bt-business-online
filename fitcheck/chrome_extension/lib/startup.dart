import 'package:chrome_extension/tab_view.dart';
import 'package:flutter/material.dart';

class Startup extends StatelessWidget {
  const Startup({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomTabBar(
        tabs: [
          TabItem("Sign Up", () {}),
          TabItem("Log In", () {}),
        ],
      ),
    );
  }
}
