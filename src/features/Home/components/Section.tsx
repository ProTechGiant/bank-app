import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SectionProps {
  children: React.ReactNode;
  onViewAllPress: () => void;
  title: string;
  testID?: string;
}

export default function Section({ children, onViewAllPress, title, testID }: SectionProps) {
  const { t } = useTranslation();

  const sectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
  }));

  return (
    <View testID={testID} style={sectionStyle}>
      <View style={styles.headerStyle}>
        <Typography.Text color="primaryBase" size="callout">
          {title}
        </Typography.Text>
        <Pressable
          onPress={onViewAllPress}
          testID={testID !== undefined ? `${testID}-SectionViewAllButton` : undefined}>
          <Typography.Text color="complimentBase" size="footnote">
            {t("Home.DashboardScreen.viewAll")}
          </Typography.Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
