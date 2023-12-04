import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AgentJoinedChatProps {
  agentName: string;
}

export default function AgentJoinedChat({ agentName }: AgentJoinedChatProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["warningBase-20"],
    borderRadius: theme.radii.xlarge,
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
    marginBottom: theme.spacing["24p"],
    alignSelf: "center",
  }));

  return (
    <View style={containerStyle}>
      <Typography.Text color="neutralBase+30" weight="medium" size="footnote">
        {t("AgentJoinedChat.label", {
          agentName,
        })}
      </Typography.Text>
    </View>
  );
}
