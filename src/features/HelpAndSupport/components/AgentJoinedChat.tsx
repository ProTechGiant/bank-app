import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export default function AgentJoinedChat() {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["secondary_yellowBase-20"],
    borderRadius: theme.radii.xlarge,
    padding: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      <Typography.Text color="neutralBase+20" weight="regular" size="footnote">
        {t("AgentJoinedChat.label")}
      </Typography.Text>
    </View>
  );
}
