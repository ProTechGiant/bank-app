import React from "react";
import { Pressable, View, ViewStyle } from "react-native";

import { CloseIcon, PersonIcon } from "@/assets/icons";
import { Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface SelectedContactProps {
  fullName: string;
  contactInfo: string;
  onCancelPress?: () => void | undefined;
  testID?: string;
}

export default function ContactsListItem({ fullName, contactInfo, onCancelPress, testID }: SelectedContactProps) {
  const itemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing["8p"],
    padding: theme.spacing["16p"],
    borderWidth: 0.5,
    borderRadius: theme.spacing["8p"],
    width: "100%",
  }));
  const profileIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing["48p"],
    height: theme.spacing["48p"],
    borderRadius: theme.spacing["48p"],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.3,
  }));

  const itemContentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginStart: theme.spacing["16p"],
  }));

  const personIconColor = useThemeStyles(theme => theme.palette["neutralBase-10"]);

  return (
    <View style={itemContainerStyle}>
      <View style={profileIconContainerStyle}>
        <PersonIcon color={personIconColor} width={24} height={24} />
      </View>
      <View style={itemContentContainerStyle}>
        <Typography.Text size="callout" weight="medium">
          {fullName}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular" color="neutralBase">
          {contactInfo}
        </Typography.Text>
      </View>
      <Pressable testID={testID + ":CancelSelectedContactPress"} onPress={onCancelPress}>
        <CloseIcon />
      </Pressable>
    </View>
  );
}
