import 'package:chrome_extension/constants.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomText extends StatelessWidget {
  final String text;
  final Color color;
  final double size;
  final String? weight;
  final TextAlign? align;
  final bool? italic;
  final double letterSpacing;

  CustomText(
      {required this.text,
      this.color = darkGray,
      this.size = 23,
      this.align,
      this.weight,
      this.italic,
      this.letterSpacing = 0.9});

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: align,
      style: GoogleFonts.raleway(
        textStyle: TextStyle(
            fontWeight: (this.weight == "800"
                ? FontWeight.w800
                : (this.weight == "700"
                    ? FontWeight.w700
                    : (this.weight == "600"
                        ? FontWeight.w600
                        : (this.weight == "500"
                            ? FontWeight.w500
                            : FontWeight.w400)))),
            fontSize: size,
            color: color,
            letterSpacing: this.letterSpacing,
            fontStyle:
                this.italic == true ? FontStyle.italic : FontStyle.normal),
      ),
    );
  }
}

class RoundButton extends StatefulWidget {
  final String text;
  final double fontSize;
  final VoidCallback onPress;

  const RoundButton({
    Key? key,
    required this.text,
    this.fontSize = 22,
    required this.onPress,
  }) : super(key: key);

  @override
  _RoundButtonState createState() => _RoundButtonState();
}

class _RoundButtonState extends State<RoundButton> {
  bool isPressedDown = false;

  @override
  Widget build(BuildContext context) {
    return Listener(
      onPointerDown: (event) => setState(() => isPressedDown = true),
      onPointerUp: (event) => setState(() => isPressedDown = false),
      onPointerCancel: (event) => setState(() => isPressedDown = false),
      child: GestureDetector(
        onTap: widget.onPress,
        child: AnimatedOpacity(
          opacity: isPressedDown ? 0.6 : 1,
          duration: Duration(milliseconds: isPressedDown ? 30 : 100),
          child: MouseRegion(
            cursor: SystemMouseCursors.click,
            child: Container(
                height: 66,
                decoration: BoxDecoration(
                  color: pink,
                  borderRadius: BorderRadius.circular(9),
                ),
                child: Center(
                  child: CustomText(
                    text: widget.text,
                    color: white,
                    size: widget.fontSize,
                    weight: "800",
                  ),
                )),
          ),
        ),
      ),
    );
  }
}

class CustomTextField extends StatelessWidget {
  final String hint;
  final TextEditingController controller;
  final bool hidden;
  final bool borderLighterToggle;

  const CustomTextField({
    Key? key,
    required this.hint,
    required this.controller,
    this.hidden = false,
    this.borderLighterToggle = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      cursorColor: black,
      obscureText: hidden,
      style: GoogleFonts.raleway(
        textStyle: TextStyle(
          fontWeight: FontWeight.w700,
          fontSize: 20,
          color: darkGray,
        ),
      ),
      decoration: InputDecoration(
        hintText: hint,
        contentPadding: const EdgeInsets.all(20),
        hintStyle: GoogleFonts.raleway(
          textStyle: TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 20,
            color: lightGray, //Color(0xFF505050),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(
              color: pink, width: (this.borderLighterToggle ? 1.3 : 1.5)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(
              color: this.borderLighterToggle
                  ? borderLighter
                  : border /* borderDarker */,
              width: this.borderLighterToggle ? 1.3 : 1.5),
        ),
      ),
      validator: (String? value) {
        if (value == null || value.isEmpty) {
          return "Please enter a value.";
        }
      },
    );
  }
}
