import 'package:chrome_extension/constants.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomText extends StatelessWidget {
  final String text;
  final Color color;
  final double size;

  CustomText({required this.text, this.color = gray, this.size = 23});

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: GoogleFonts.raleway(
        textStyle: TextStyle(
          fontWeight: FontWeight.w800,
          fontSize: size,
          color: color,
        )
      ),
    );
  }
}
