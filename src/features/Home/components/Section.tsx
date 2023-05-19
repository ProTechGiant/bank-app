import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SectionProps {
  children: React.ReactNode;
  onViewAllPress: () => void;
  title: string;
}

export default function Section({ children, onViewAllPress, title }: SectionProps) {
  const { t } = useTranslation();
  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing["16p"],
    justifyContent: "space-between",
  }));

  return (
    <View>
      <View style={headerStyle}>
        <Typography.Text color="primaryBase-10" size="callout" weight="semiBold">
          {title}
        </Typography.Text>
        <Pressable onPress={onViewAllPress}>
          <Typography.Text color="primaryBase-30" size="footnote" weight="semiBold">
            {t("Home.DashboardScreen.viewAll")}
          </Typography.Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}
