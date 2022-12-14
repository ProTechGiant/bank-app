import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { ReactNode } from "react";

interface props {
  children: ReactNode;
}

const HideKeyboard = ({ children }: props) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);
export default HideKeyboard;
