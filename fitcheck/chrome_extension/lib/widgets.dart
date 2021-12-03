import 'package:chrome_extension/constants.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomText extends StatelessWidget {
  final String text;
  final Color color;
  final double size;
  final TextAlign? align;

  CustomText({required this.text, this.color = gray, this.size = 23, this.align});

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: align,
      style: GoogleFonts.raleway(
        textStyle: TextStyle(
          fontWeight: FontWeight.w800,
          fontSize: size,
          color: color,
        ),
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
    this.fontSize = 20,
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
          duration: Duration(milliseconds: isPressedDown ? 10 : 100),
          child: Container(
            height: 66,
            decoration: BoxDecoration(
              color: pink,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: CustomText(
                text: widget.text,
                color: white,
                size: widget.fontSize,
              ),
            ),
          ),
        ),
      ),
    );
  }

}

class CustomTextField extends StatelessWidget {

  final String hint;
  final TextEditingController controller;

  const CustomTextField({Key? key, required this.hint, required this.controller}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      cursorColor: black,
      style: GoogleFonts.raleway(
        textStyle: TextStyle(
          fontWeight: FontWeight.w800,
          fontSize: 20,
          color: black,
        ),
      ),
      decoration: InputDecoration(
        hintText: hint,
        contentPadding: const EdgeInsets.all(20),
        hintStyle: GoogleFonts.raleway(
          textStyle: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 20,
            color: Color(0xFF505050),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: pink, width: 3.0),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: gray, width: 3.0),
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
