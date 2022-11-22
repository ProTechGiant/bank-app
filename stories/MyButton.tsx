import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    backgroundColor: "purple",
    borderRadius: 4,
    flexGrow: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonContainer: {
    alignItems: "flex-start",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const MyButton = ({ text, onPress, color, textColor }) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={[styles.button, !!color && { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={[styles.buttonText, !!textColor && { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  </View>
);
