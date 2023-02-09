import { StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface HeroSlideProps {
  topElement: React.ReactElement;
  title: string;
  subText: string;
}

export default function HeroSlide({ topElement, title, subText }: HeroSlideProps) {
  const subTextStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing["16p"],
      textAlign: "center",
    }),
    []
  );
  const TitleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing["20p"],
      textAlign: "center",
    }),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View>{topElement}</View>
        <Typography.Text color="neutralBase-50" size="large" weight="bold" style={TitleStyle}>
          {title}
        </Typography.Text>
        <Typography.Text color="neutralBase-20" size="callout" style={subTextStyle}>
          {subText}
        </Typography.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "space-between",
  },
});
