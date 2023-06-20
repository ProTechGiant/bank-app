import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface HeroSlideProps {
  topElement: React.ReactElement;
  title: string;
  text: string;
  containerStyle?: StyleProp<ViewStyle>;
  bottomElementStyle?: StyleProp<ViewStyle>;
}

export default function HeroSlide({ topElement, title, text, containerStyle, bottomElementStyle }: HeroSlideProps) {
  const { height } = useWindowDimensions();

  const headerSize = height > 735 ? "large" : "medium";

  const contentStyle = useThemeStyles(theme => ({
    height: "100%",
    paddingHorizontal: theme.spacing["12p"] + theme.spacing["20p"],
  }));

  return (
    <View style={styles.container}>
      <Stack align="center" direction="vertical" justify="center" gap="24p" style={[contentStyle, containerStyle]}>
        {topElement}
        <View style={bottomElementStyle}>
          <Typography.Header align="center" color="neutralBase+30" size={headerSize} weight="bold">
            {title}
          </Typography.Header>
          <Typography.Text align="center" color="neutralBase+10" size="callout" weight="regular">
            {text}
          </Typography.Text>
        </View>
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
