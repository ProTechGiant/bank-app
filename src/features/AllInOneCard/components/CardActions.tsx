import { StyleSheet, View } from "react-native";

import { TriangleBackgroundIcon } from "../assets/icons";

export default function CardActions() {
  return (
    <View style={styles.content}>
      <TriangleBackgroundIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: -200,
  },
});
