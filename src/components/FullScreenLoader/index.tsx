import { StyleSheet, useWindowDimensions, ViewStyle } from "react-native";

import loaderAnimation from "@/assets/illustrations/loader.json";
import AnimationView from "@/components/AnimationView";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface FullScreenLoaderProps {
  title?: string;
  message?: string;
}

export default function FullScreenLoader({ title, message }: FullScreenLoaderProps) {
  const { height } = useWindowDimensions();

  const withTextContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop:
      height / 4 - // calculation to get 25% of screen height
      theme.spacing["20p"], // remove ContentContainer Padding
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <Stack
      direction="vertical"
      gap="24p"
      align="stretch"
      style={title !== undefined || message !== undefined ? withTextContainerStyle : styles.noText}>
      <AnimationView source={loaderAnimation} style={styles.animation} />
      {title !== undefined || message !== undefined ? (
        <Stack direction="vertical" align="center" gap="8p">
          {title ? (
            <Typography.Text size="title1" weight="bold" align="center">
              {title}
            </Typography.Text>
          ) : null}
          {message ? (
            <Typography.Text color="neutralBase-10" align="center">
              {message}
            </Typography.Text>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}

const styles = StyleSheet.create({
  animation: {
    height: 80,
    width: 80,
  },
  noText: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
});
