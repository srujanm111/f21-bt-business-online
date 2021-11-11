import 'package:chrome_extension/tab_view.dart';
import 'package:flutter/material.dart';

class FitCheck extends StatelessWidget {
  final GlobalKey<CustomTabBarViewState> tabViewKey =
      GlobalKey<CustomTabBarViewState>();

  FitCheck({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
  const AddItem({ Key? key }) : super(key: key);

  @override
  _AddItemState createState() => _AddItemState();
}

class _AddItemState extends State<AddItem> {
  @override
  Widget build(BuildContext context) {
    return Container(
      
    );
  }
}

class Wardrobe extends StatefulWidget {
  const Wardrobe({ Key? key }) : super(key: key);

  @override
  _WardrobeState createState() => _WardrobeState();
}

class _WardrobeState extends State<Wardrobe> {
  @override
  Widget build(BuildContext context) {
    return Container(
      
    );
  }
}