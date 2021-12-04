import 'package:chrome_extension/constants.dart';
import 'package:chrome_extension/fitcheck.dart';
import 'package:chrome_extension/tab_view.dart';
import 'package:chrome_extension/widgets.dart';
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
      backgroundColor: white,
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
    return Padding(
      padding: EdgeInsets.all(30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomText(
            text: "So, what is FitCheck?",
            size: 26,
            weight: "500",
            letterSpacing: 0.95,
            italic: true,
          ),
          SizedBox(height: 30),
          Padding(
            padding: const EdgeInsets.only(left: 20),
            child: SizedBox(
              width: 240,
              child: CustomText(
                  text:
                      "FitCheck is the place where you can pick out clothes that you like from any store and see how they would look together.",
                  size: 20,
                  letterSpacing: 0.65,
                  weight: "500"),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 112, top: 0),
            child: Image.asset('assets/signup.png', width: 220, height: 160.69),
          ),
          Spacer(),
          RoundButton(
              text: "Go To Website",
              onPress: () {
                // TODO open up website
              }),
        ],
      ),
    );
  }
}

class LogIn extends StatelessWidget {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  LogIn({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomText(
            text: "Let’s get started!",
            size: 26,
            weight: "500",
            letterSpacing: 0.95,
            italic: true,
          ),
          SizedBox(height: 30),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: CustomText(
                text:
                    "Awesome, you already have an account! Just sign in to start expanding your wardrobe!",
                size: 20,
                letterSpacing: 0.7,
                weight: "500"),
          ),
          SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: CustomTextField(
              hint: 'Username',
              controller: usernameController,
            ),
          ),
          SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: CustomTextField(
              hint: 'Password',
              controller: passwordController,
              hidden: true,
            ),
          ),
          SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Align(
              alignment: Alignment.center,
              child: Container(
                // color: darkRed,
                child: CustomText(
                    text: " ",
                    size: 15,
                    letterSpacing: 0.9,
                    align: TextAlign.center,
                    color: darkRed),
              ),
            ),
          ),
          Spacer(),
          RoundButton(
              text: "Login",
              onPress: () {
                final username = usernameController.text;
                final password = passwordController.text;
                // TODO login with actual credentials or example account
                pushReplace(FitCheck(), context);
              }),
        ],
      ),
    );
  }
}
