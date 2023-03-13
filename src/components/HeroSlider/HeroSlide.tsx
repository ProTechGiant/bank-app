import { StyleSheet, View } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface HeroSlideProps {
  topElement: React.ReactElement;
  title: string;
  text: string;
}

export default function HeroSlide({ topElement, title, text }: HeroSlideProps) {
  const contentStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["12p"] + theme.spacing["20p"],
  }));

  return (
    <View style={styles.container}>
      <Stack align="center" direction="vertical" justify="space-between" gap="24p" style={contentStyle}>
        {topElement}
        <Typography.Text align="center" color="primaryBase-10" size="large" weight="bold">
          {title}
        </Typography.Text>
        <Typography.Text align="center" color="primaryBase-10" size="callout" weight="regular">
          {text}
        </Typography.Text>
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
