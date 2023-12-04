import { StyleSheet, View } from "react-native";
import { Circle, Defs, LinearGradient, Stop, Svg } from "react-native-svg";

export function CircularProgressIcon({ percentage = 0 }) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const progress = (circumference * percentage) / 100;
  const strokeDashoffset = circumference - progress;
  const strokeWidth = 5;

  return (
    <View style={styles.parentView}>
      <Svg height="80" width="80">
        <Defs>
          <LinearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FF523D" />
            <Stop offset="100%" stopColor="#FF523D" />
          </LinearGradient>
        </Defs>
        <Circle cx="50" cy="50" r={radius} fill="transparent" stroke="#D9D9D9" strokeWidth={strokeWidth} />
        <Circle
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
          r={radius}
          fill="transparent"
          stroke="url(#fillGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  parentView: {
    justifyContent: "center",
    marginRight: -10,
    marginTop: 20,
  },
});
