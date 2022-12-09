import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface DarkOneProps {
  children: React.ReactNode;
}

const DarkOneGradient = ({ children }: DarkOneProps) => {
  return (
    <View style={darkOneStyles.container}>
      <LinearGradient
        start={{ x: 1, y: 1 }}
        end={{ x: 0.5, y: 0.5 }}
        colors={["#27347C", "#14183F"]}
        style={darkOneStyles.linearGradient}>
        {children}
      </LinearGradient>
    </View>
  );
};

export default DarkOneGradient;

const darkOneStyles = StyleSheet.create({
  container: {
    backgroundColor: "#010029",
    flex: 1,
  },
  linearGradient: { flex: 1 },
});
