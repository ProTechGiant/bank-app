import * as React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, ViewStyle } from "react-native";

import { Theme, useThemeStyles } from "@/theme";

interface PageProps {
  backgroundColor?: keyof Theme["palette"];
  children: React.ReactNode;
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
}

export default function Page({
  backgroundColor: color,
  children,
  keyboardAvoiding = false,
  keyboardVerticalOffset = undefined,
}: PageProps) {
  const backgroundColor = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: color ? theme.palette[color] : undefined,
    }),
    [color]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled={keyboardAvoiding}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={[styles.keyboardAvoidingContainer, backgroundColor]}>
      <SafeAreaView style={[styles.container, backgroundColor]}>{children}</SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
});
