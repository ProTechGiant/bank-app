import { Keyboard, Pressable } from "react-native";

interface DismissKeyboardWrapperProps {
  children: React.ReactNode;
}

export default function DismissKeyboardWrapper({ children }: DismissKeyboardWrapperProps) {
  const handleOnPress = () => {
    Keyboard.dismiss();
  };

  return <Pressable onPress={handleOnPress}>{children}</Pressable>;
}
