import { View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { AgentAvatarIcon } from "../assets/icons";

interface AgentAvatar {
  isOnline: boolean;
}

export default function AgentAvatar({ isOnline }: AgentAvatar) {
  const availableIconColor = useThemeStyles(theme => theme.palette.secondary_mintBase);
  const unavailableIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  const onlineStatus = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing["16p"],
    width: theme.spacing["16p"],
    borderRadius: theme.radii.small,
    alignSelf: "flex-end",
    borderColor: theme.palette["neutralBase-40"],
    borderWidth: theme.spacing["4p"],
    marginEnd: -theme.spacing["4p"],
    marginTop: -theme.spacing["16p"],
  }));

  return (
    <View>
      <AgentAvatarIcon />
      <View style={[onlineStatus, { backgroundColor: isOnline ? availableIconColor : unavailableIconColor }]} />
    </View>
  );
}
