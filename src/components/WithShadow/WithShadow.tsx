import { StyleSheet, View } from "react-native";

import { Theme, useThemeStyles } from "@/theme";

interface WithShadowProps {
  children: React.ReactNode;
  backgroundColor: keyof Theme["palette"];
  elevation?: number;
  borderRadius: keyof Theme["radii"];
}

const WithShadow = ({ children, backgroundColor, elevation = 5, borderRadius }: WithShadowProps) => {
  const shadowStyles = useThemeStyles(theme => {
    return {
      elevation,
      backgroundColor: theme.palette[backgroundColor],
      borderRadius: theme.radii[borderRadius],
      shadowRadius: theme.radii.small,
    };
  });

  return <View style={[shadowStyles, styles.shadow]}>{children}</View>;
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "rgb(0, 51, 76)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
  },
});

export default WithShadow;
