import React, { useCallback, useEffect, useRef } from "react";
import type { EmitterSubscription, KeyboardEventName, StyleProp, ViewStyle } from "react-native";
import { Animated, Easing, Keyboard, KeyboardEvent, Platform } from "react-native";

type KeyboardAvoidingViewProps = {
  style?: StyleProp<ViewStyle>;
  keyboardShowingDuration?: number;
  keyboardHidingDuration?: number;
  keyboardShowingOffset?: number;
  onKeyboardShow?: () => void;
  onKeyboardHide?: () => void;
  children: React.ReactNode;
};

export default function CustomKeyboardAvoidingView({
  style,
  keyboardShowingDuration = 350,
  keyboardHidingDuration = 250,
  keyboardShowingOffset = 0,
  onKeyboardShow,
  onKeyboardHide,
  children,
}: KeyboardAvoidingViewProps) {
  const keyboardHeight = useRef(new Animated.Value(0));

  const showEvent: KeyboardEventName = Platform.select({
    android: "keyboardDidShow",
    default: "keyboardWillShow",
  });

  const hideEvent: KeyboardEventName = Platform.select({
    android: "keyboardDidHide",
    default: "keyboardWillHide",
  });

  const handleKeyboardWillShow = useCallback(
    (event: KeyboardEvent) => {
      Animated.timing(keyboardHeight.current, {
        toValue: keyboardShowingOffset - event.endCoordinates.height,
        duration: keyboardShowingDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(onKeyboardShow);
    },
    [keyboardShowingDuration, keyboardShowingOffset, onKeyboardShow]
  );

  const handleKeyboardWillHide = useCallback(() => {
    Animated.timing(keyboardHeight.current, {
      toValue: 0,
      duration: keyboardHidingDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(onKeyboardHide);
  }, [keyboardHidingDuration, onKeyboardHide]);

  useEffect(() => {
    const showSubscription: EmitterSubscription = Keyboard.addListener(showEvent, handleKeyboardWillShow);
    const hideSubscription: EmitterSubscription = Keyboard.addListener(hideEvent, handleKeyboardWillHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [handleKeyboardWillHide, handleKeyboardWillShow, showEvent, hideEvent]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY: keyboardHeight.current }],
        },
      ]}>
      {children}
    </Animated.View>
  );
}
