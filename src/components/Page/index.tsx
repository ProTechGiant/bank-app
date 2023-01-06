import * as React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from "react-native";

interface PageProps {
  backgroundColor?: string;
  children: React.ReactNode;
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
}

export default function Page({
  backgroundColor,
  children,
  keyboardAvoiding = false,
  keyboardVerticalOffset = undefined,
}: PageProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled={keyboardAvoiding}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={[styles.keyboardAvoidingContainer, { backgroundColor }]}>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>{children}</SafeAreaView>
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
