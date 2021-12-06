// ignore_for_file: avoid_web_libraries_in_flutter

import 'dart:html';
import 'dart:js' as js;
import 'package:another_flushbar/flushbar.dart';
import 'package:chrome_extension/constants.dart';
import 'package:chrome_extension/tab_view.dart';
import 'package:chrome_extension/widgets.dart';
import 'package:flutter/material.dart';

import 'dart:convert';
import 'package:http/http.dart' as http;

// hardcoded examples for demo purposes (only one links back to the store page)
List<ClothingItem> localItems = [
  // ClothingItem("https://m.media-amazon.com/images/I/91tCUunPF7L._AC_UL640_FMwebp_QL65_.jpg", "", "Levi's Regular Fit Jeans", 34.99),
  // ClothingItem("https://m.media-amazon.com/images/I/71yVf4x3DIL._AC_UL640_FMwebp_QL65_.jpg", "", "Champion Lightweight Pant", 18.99),
  // ClothingItem("https://m.media-amazon.com/images/I/71hEatvXXqS._AC_UL640_FMwebp_QL65_.jpg", "https://www.amazon.com/Nautica-Sleeve-Stretch-Cotton-X-Large/dp/B07BN2731K/ref=sr_1_7?keywords=Nautica+Soft+Cotton+Polo&qid=1638555173&sr=8-7", "Nautica Soft Cotton Polo", 24.99),
  // ClothingItem("https://m.media-amazon.com/images/I/81fobZZxLES._AC_UL640_FMwebp_QL65_.jpg", "", "Adidas Cap", 14.99),
  // ClothingItem("https://m.media-amazon.com/images/I/813UuOjWfZL._AC_UL640_FMwebp_QL65_.jpg", "", "Fashion Sneaker", 59.85),
  // ClothingItem("https://m.media-amazon.com/images/I/71T2zcEvXvL._AC_UL640_FMwebp_QL65_.jpg", "", "Timberland Leather Belt", 15.99),
  // ClothingItem("https://m.media-amazon.com/images/I/51kP6aUntBL._AC_UL640_FMwebp_QL65_.jpg", "", "Adidas Short", 12.99),
  // ClothingItem("https://m.media-amazon.com/images/I/71Z1wHQ9MYL._AC_UL640_FMwebp_QL65_.jpg", "", "Under Armour Hoodie", 59.85),
];

class FitCheck extends StatelessWidget {
  final GlobalKey<CustomTabBarViewState> tabViewKey =
      GlobalKey<CustomTabBarViewState>();

  FitCheck({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: white,
      appBar: CustomTabBar(
        tabs: [
          TabItem("Add Item", () => tabViewKey.currentState?.changePage(0)),
          TabItem("Wardrobe", () => tabViewKey.currentState?.changePage(1)),
        ],
      ),
      body: CustomTabBarView(
        key: tabViewKey,
        pages: [
          AddItem(),
          Wardrobe(),
        ],
      ),
    );
  }
}

class AddItem extends StatefulWidget {
  const AddItem({Key? key}) : super(key: key);

  @override
  _AddItemState createState() => _AddItemState();
}

class _AddItemState extends State<AddItem> {
  final nameController = TextEditingController();
  final priceController = TextEditingController();

  String? imageUrl;
  String? pageUrl;
  // String? imageUrl =
  //     "https://m.media-amazon.com/images/I/91tCUunPF7L._AC_UL640_FMwebp_QL65_.jpg";
  // String? pageUrl =
  //     "https://www.amazon.com/Nautica-Sleeve-Stretch-Cotton-X-Large/dp/B07BN2731K/ref=sr_1_7?keywords=Nautica+Soft+Cotton+Polo&qid=1638555173&sr=8-7";

  @override
  void initState() {
    super.initState();

    final channel = BroadcastChannel('images');
    channel.onMessage.listen((event) {
      setState(() {
        imageUrl = event.data['imageUrl'];
        pageUrl = event.data['pageUrl'];
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return imageUrl == null ? _instructions() : _addItem();
  }

  Widget _instructions() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset('assets/shirt.png'),
          CustomText(
            text:
                "Right-Click on a clothing item you like and it will show up here!",
            align: TextAlign.center,
          ),
          SizedBox(height: 128),
        ],
      ),
    );
  }

  Widget _addItem() {
    return Padding(
      padding: const EdgeInsets.all(15),
      child: Column(
        children: [
          Container(
            height: 280,
            width: 330,
            decoration: BoxDecoration(
              border: Border.all(color: green, width: 8),
              borderRadius: BorderRadius.circular(15),
            ),
            child: Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Image.network(imageUrl!),
              ),
            ),
          ),
          SizedBox(height: 10),
          CustomTextField(hint: "Name", controller: nameController),
          SizedBox(height: 10),
          CustomTextField(hint: "Price", controller: priceController),
          Spacer(),
          RoundButton(
              text: "Add to Wardrobe",
              onPress: () {
                // js.context.callMethod('alert', ["trace - onpress"]);
                final item = ClothingItem(imageUrl!, pageUrl!,
                    nameController.text, double.parse(priceController.text));
                // localItems.insert(0, item);
                // _addItemToBackend(item);
                _addItemToBackend(item, (bool success) async {
                  if (success) {
                    setState(() {
                      imageUrl = null;
                      pageUrl = null;
                    });
                    await Flushbar(
                      borderRadius: BorderRadius.circular(10),
                      margin: EdgeInsets.all(14),
                      messageText: CustomText(
                        text: '${nameController.text} was added!',
                        size: 16,
                        color: white,
                      ),
                      duration: Duration(seconds: 3),
                      isDismissible: true,
                    ).show(context);
                  }
                });
              }),
        ],
      ),
    );
  }

  _addItemToBackend(ClothingItem item, Function(bool) next) async {
    // TODO add clothing item to backend database
    // js.context.callMethod('alert', ["trace - add item to backend"]);

    final response =
        await http.post(Uri.http(api_url, 'api/create_clothing'), body: {
      'name': item.name,
      'price': item.price.toString(),
      'page_url': item.pageUrl,
      'image_url': item.imageUrl,
      'store_name': "",
      'token': api_token,
    });

    // js.context.callMethod('alert', [response.statusCode.toString()]);

    if (response.statusCode == 200) {
      var body = jsonDecode(response.body);
      // js.context.callMethod('alert', ["success"]);
      // js.context.callMethod('alert', [body.toString()]);
      js.context['console'].callMethod('log', [body.toString()]);
      print(body);
      next(true);
    } else {
      var body = jsonDecode(response.body);
      // js.context.callMethod('alert', [body['message'].toString()]);
      js.context['console'].callMethod('log', [body['message'].toString()]);
      print(body);
      next(false);
    }
  }
}

class Wardrobe extends StatefulWidget {
  const Wardrobe({Key? key}) : super(key: key);

  @override
  _WardrobeState createState() => _WardrobeState();
}

class _WardrobeState extends State<Wardrobe> {
  // final List<ClothingItem> wardrobeItems = [];

  void initState() {
    super.initState();
    WidgetsBinding.instance!.addPostFrameCallback((_) => loadWardrobe(context));
  }

  void loadWardrobe(BuildContext context) async {
    // js.context.callMethod('alert', ["loading wardrobe"]);

    setState(() {
      localItems.clear();
    });

    final response =
        await http.post(Uri.http(api_url, 'api/get_clothing'), body: {
      'token': api_token,
    });

    // js.context.callMethod('alert', [response.statusCode.toString()]);

    if (response.statusCode == 200) {
      var body = jsonDecode(response.body);
      // js.context.callMethod('alert', ["success"]);
      // js.context.callMethod('alert', [body.toString()]);
      // js.context['console'].callMethod('log', [body['list'].toString()]);
      print(body);

      js.context['console'].callMethod('log', [body['list'].length]);

      body['list'].forEach((item) {
        js.context['console'].callMethod('log', [item.toString()]);
        // js.context.callMethod('alert', [item['image_url']]);
        ClothingItem new_item = ClothingItem(item['image_path'],
            item['product_url'], item['name'], item['price']);
        setState(() {
          localItems.insert(0, new_item);
        });
      });
      // js.context['console'].callMethod('log', [body]);
    } else {
      var body = jsonDecode(response.body);
      // js.context.callMethod('alert', [body['message'].toString()]);
      js.context['console'].callMethod('log', [body['message'].toString()]);
      print(body);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(5.0),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
        ),
        itemCount: localItems.length,
        itemBuilder: (BuildContext context, int index) {
          final item = localItems[index];
          return GestureDetector(
            onTap: () => js.context.callMethod('open', [item.pageUrl]),
            child: Padding(
              padding: const EdgeInsets.all(5.0),
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    width: 8,
                    color: green,
                  ),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Stack(
                  children: [
                    Align(
                        alignment: Alignment.center,
                        child: Image.network(item.imageUrl)),
                    Align(
                        alignment: Alignment.topRight,
                        child: Padding(
                          padding: const EdgeInsets.only(top: 8, right: 8),
                          child: Container(
                            decoration: BoxDecoration(
                              color: pink,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.only(
                                  left: 8, right: 8, bottom: 8, top: 2),
                              child: CustomText(
                                text: item.price.toString(),
                                color: white,
                                size: 16,
                              ),
                            ),
                          ),
                        )),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class ClothingItem {
  final String imageUrl;
  final String pageUrl;
  final String name;
  final double price;

  ClothingItem(this.imageUrl, this.pageUrl, this.name, this.price);
}
