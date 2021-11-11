import 'package:chrome_extension/constants.dart';
import 'package:chrome_extension/widgets.dart';
import 'package:flutter/material.dart';

class TabItem {
  final String name;
  final VoidCallback onPress;

  const TabItem(this.name, this.onPress);
}

class CustomTabBar extends StatefulWidget implements PreferredSizeWidget {
  final List<TabItem> tabs;

  const CustomTabBar({Key? key, required this.tabs}) : super(key: key);

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
              width: 2,
            ),
          ),
          child: Center(
            child: CustomText(
              text: item.name,
              color: index == widget.tabs.indexOf(item) ? pink : gray,
            ),
          ),
        ),
      ),
    );
  }
}

class CustomTabBarView extends StatefulWidget {
  final List<Widget> pages;

  const CustomTabBarView({Key? key, required this.pages}) : super(key: key);

  @override
  CustomTabBarViewState createState() => CustomTabBarViewState();
}

class CustomTabBarViewState extends State<CustomTabBarView> {
  int index = 0;

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 200),
      transitionBuilder: (Widget child, Animation<double> animation) {
        return FadeTransition(child: child, opacity: animation);
      },
      child: widget.pages[index],
    );
  }

  void changePage(int index) {
    setState(() => this.index = index);
  }
}
