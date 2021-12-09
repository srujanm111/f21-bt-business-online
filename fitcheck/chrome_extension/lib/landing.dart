import 'package:chrome_extension/constants.dart';
import 'package:chrome_extension/fitcheck.dart';
import 'package:chrome_extension/startup.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

// import 'package:chrome/chrome.dart' as chrome;
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:html' as html;
import 'dart:js' as js;

import 'main.dart';

class Landing extends StatefulWidget {
  const Landing({Key? key}) : super(key: key);

  @override
  State<Landing> createState() => _LandingState();
}

class _LandingState extends State<Landing> {
  final channel = html.BroadcastChannel('auth');

  void initState() {
    super.initState();

    this.channel.onMessage.listen((event) {
      // js.context['console'].callMethod('log', [event.data.toString()]);
      // js.context.callMethod('alert', [event.data.toString()]);
      var data = jsonDecode(event.data);
      if (data['action'] == 'provide') {
        api_token = data['value'].toString();
        // js.context.callMethod(
        //     'alert', [api_token + ' ' + (api_token == 'null').toString()]);
        this.checkAuthNext(context);
      }
    });

    WidgetsBinding.instance!
        .addPostFrameCallback((_) => this.checkAuth(context));
  }

  void checkAuth(BuildContext context) async {
    this
        .channel
        .postMessage(jsonEncode({"action": "request", "value": "token"}));
  }

  void checkAuthNext(BuildContext context) async {
    if (api_token == 'null') {
      pushReplace(Startup(), context);
      return;
    }
    final response = await http.post(Uri.http(web_url, 'api/auth_alt'), body: {
      'token': api_token,
    });
    // js.context.callMethod('alert', [response.statusCode]);
    // js.context.callMethod('alert', [response.body]);
    if (response.statusCode == 200) {
      var body = jsonDecode(response.body);
      print(body);
      pushReplace(FitCheck(), context);
    } else {
      var body = jsonDecode(response.body);
      print(body);
      pushReplace(Startup(), context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Image.asset('assets/logo300.png'),
      ],
    );
  }
}
