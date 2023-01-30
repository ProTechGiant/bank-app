import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TermProps {
  title: string;
  desc: string;
}

const Term = ({ title, desc }: TermProps) => {
  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 54,
    height: 54,
    borderRadius: 54,
    backgroundColor: theme.palette.primaryBase,
    marginRight: theme.spacing.medium,
  }));

  const headingStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing.medium,
  }));

  return (
    <View style={styles.container}>
      <View style={iconStyle} />
      <View style={styles.content}>
        <Typography.Text size="callout" weight="semiBold" color="primaryBase" style={headingStyle}>
          {title}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular">
          {desc}
        </Typography.Text>
      </View>
    </View>
  );
};

export default Term;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
});
