import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

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

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing["20p"],
  }));

  return (
    <View testID={testID} style={sectionStyle}>
      <View style={headerStyle}>
        <Typography.Text color="primaryBase" weight="medium" size="title3">
          {title}
        </Typography.Text>
        <Pressable
          onPress={onViewAllPress}
          testID={testID !== undefined ? `${testID}-SectionViewAllButton` : undefined}>
          <Typography.Text color="complimentBase" size="footnote" weight="medium">
            {t("Home.DashboardScreen.viewAll")}
          </Typography.Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}
