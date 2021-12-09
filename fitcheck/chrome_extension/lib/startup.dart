import 'package:chrome_extension/constants.dart';
import 'package:chrome_extension/tab_view.dart';
import 'package:chrome_extension/widgets.dart';
import 'package:chrome_extension/fitcheck.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;
import 'dart:js' as js;
import 'dart:convert';
import 'dart:html' as html;
import 'package:crypto/crypto.dart' as crypto;

import 'main.dart';

class Startup extends StatefulWidget {
  const Startup({Key? key}) : super(key: key);

  @override
  State<Startup> createState() => _StartupState();
}

class _StartupState extends State<Startup> {
  final GlobalKey<CustomTabBarViewState> tabViewKey =
      GlobalKey<CustomTabBarViewState>();

  void initState() {
    super.initState();
  }

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
                // open up website
                js.context.callMethod(
                    'open', ['http://' + web_url /* + '/register' */]);
              }),
        ],
      ),
    );
  }
}

class LogIn extends StatefulWidget {
  const LogIn({Key? key}) : super(key: key);

  @override
  State<LogIn> createState() => _LogInState();
}

class _LogInState extends State<LogIn> {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  String loginErrorText = " ";

  final channel = html.BroadcastChannel('auth');

  void initState() {
    super.initState();

    this.channel.onMessage.listen((event) {
      // js.context['console'].callMethod('log', [event.data.toString()]);
      // js.context.callMethod('alert', [event.data.toString()]);
      var data = jsonDecode(event.data);
      if (data['action'] == 'notify' && data['value'] == 'complete') {
        pushReplace(FitCheck(), context);
      }
    });
  }

  saveToken(String token) {
    api_token = token.toString();
    this
        .channel
        .postMessage(jsonEncode({"action": "save", "value": api_token}));
  }

  requestLogIn(String username, String password, BuildContext context) async {
    username = username.trim();
    password = password.trim();
    if (username != "" && password != "") {
      final password_hash =
          crypto.sha256.convert(utf8.encode(password)).toString();
      final response = await http.post(Uri.http(web_url, 'api/sign_in'), body: {
        'username': username,
        'password': password_hash,
      });
      if (response.statusCode == 200) {
        var body = jsonDecode(response.body);
        var new_token = body['token'].toString();
        setState(() {
          loginErrorText = " ";
        });
        this.saveToken(new_token);
      } else {
        var body = jsonDecode(response.body);
        setState(() {
          loginErrorText = body['message'];
        });
        print(body);
      }
    }
  }

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
              weight: "500",
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
              hidden: true,
            ),
          ),
          SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              // color: darkRed,
              child: CustomText(
                text: loginErrorText,
                size: 15,
                letterSpacing: 0.9,
                align: TextAlign.center,
                color: darkRed,
              ),
            ),
          ),
          Spacer(),
          RoundButton(
              text: "Login",
              onPress: () {
                final username = usernameController.text;
                final password = passwordController.text;
                // login with actual credentials or example account
                requestLogIn(username, password, context);
                // pushReplace(FitCheck(), context);
              }),
        ],
      ),
    );
  }
}
