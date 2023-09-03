import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AgentLeftChatProps {
  agentName: string;
}

export default function AgentLeftChat({ agentName }: AgentLeftChatProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-20-30%"],
    borderRadius: theme.radii.xlarge,
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
    marginBottom: theme.spacing["24p"],
    alignSelf: "center",
  }));

  return (
    <View style={containerStyle}>
      <Typography.Text color="neutralBase+20" weight="regular" size="footnote">
        {t("AgentLeftChat.label", {
          agentName,
        })}
      </Typography.Text>
    </View>
  );
}
