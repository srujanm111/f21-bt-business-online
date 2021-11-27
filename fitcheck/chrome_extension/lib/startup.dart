import 'package:chrome_extension/constants.dart';
import 'package:chrome_extension/tab_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import 'main.dart';

class Startup extends StatelessWidget {
  final GlobalKey<CustomTabBarViewState> tabViewKey =
      GlobalKey<CustomTabBarViewState>();

  Startup({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomTabBar(
        tabs: [
          TabItem("Sign Up", () => tabViewKey.currentState?.changePage(0)),
          TabItem("Log In", () => tabViewKey.currentState?.changePage(1)),
        ],
      ),
      body: CustomTabBarView(
        key: tabViewKey,
        pages: [
          SignUp(),
          LogIn(),
        ],
      ),
    );
  }
}

class SignUp extends StatefulWidget {
  const SignUp({Key? key}) : super(key: key);

  @override
  State<SignUp> createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() {}),
      child: Container(
        color: green,
        child: Center(
          child: url != null ? Image.network(url!) : Text(url ?? "no url"),
        ),
      ),
    );
  }
}

class LogIn extends StatelessWidget {
  const LogIn({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: green,
      child: Center(
        child: url != null ? Image.network(url!) : Text(url ?? "no url"),
      ),
    );
  }
}
