import { useState } from "react";
import { Button, View } from "react-native";

import StorybookUI from "../storybook";

export default function App() {
  const [mode, setMode] = useState<"start" | "storybook">("start");

  return mode === "start" ? (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Button onPress={() => setMode("storybook")} title="Move to Storybook" />
    </View>
  ) : (
    <StorybookUI />
  );
}
