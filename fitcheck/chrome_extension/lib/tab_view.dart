import 'package:chrome_extension/constants.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class TabItem {
  final String name;
  final VoidCallback onPress;

  const TabItem(this.name, this.onPress);
}

class CustomTabBar extends StatefulWidget implements PreferredSizeWidget {
  final List<TabItem> tabs;

  CustomTabBar({Key? key, required this.tabs}) : super(key: key);

  @override
  _CustomTabBarState createState() => _CustomTabBarState();

  @override
  Size get preferredSize => Size.fromHeight(75);
}

class _CustomTabBarState extends State<CustomTabBar> {
  int index = 0;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: widget.tabs.map<Widget>((item) => tab(item)).toList(),
    );
  }

  Widget tab(TabItem item) {
    return Flexible(
      child: GestureDetector(
        behavior: HitTestBehavior.translucent,
        onTap: () {
          setState(() {
            index = widget.tabs.indexOf(item);
            item.onPress();
          });
        },
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: border,
              width: 1.5,
            ),
          ),
          child: Center(
            child: Text(
              item.name,
              style: GoogleFonts.raleway(
                textStyle: TextStyle(
                  color: index == widget.tabs.indexOf(item) ? pink : gray,
                  fontSize: 23,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class CustomTabBarView extends StatefulWidget {
  const CustomTabBarView({Key? key}) : super(key: key);

  @override
  _CustomTabBarViewState createState() => _CustomTabBarViewState();
}

class _CustomTabBarViewState extends State<CustomTabBarView> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
