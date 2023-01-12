import LinearGradient from "react-native-linear-gradient";

interface GreyGradient {
  children: JSX.Element | JSX.Element[];
}

const GreyGradient = ({ children }: GreyGradient) => {
  return (
    <LinearGradient colors={["#D8E2EE", "#E0E1E9"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
      {children}
    </LinearGradient>
  );
};

export { GreyGradient };
