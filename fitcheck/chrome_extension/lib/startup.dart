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
      padding: EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomText(
            text: "So, what is FitCheck?",
            size: 26,
          ),
          SizedBox(height: 30),
          Padding(
            padding: const EdgeInsets.only(left: 20),
            child: SizedBox(
              width: 240,
              child: CustomText(
                text: "FitCheck is the place where you can out pick clothes that you like from any store and see how they would look together.",
                size: 20,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 80),
            child: Image.asset('assets/signup.png'),
          ),
          Spacer(),
          RoundButton(text: "Go to Website", onPress: () {
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
      padding: EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomText(
            text: "Let’s get started!",
            size: 26,
          ),
          SizedBox(height: 30),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: CustomText(
              text: "Awesome, you already have an account! Just sign in to start expanding your wardrobe!",
              size: 20,
            ),
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
            ),
          ),
          Spacer(),
          RoundButton(text: "Login", onPress: () {
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
