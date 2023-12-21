import React from "react";
import { Pressable, View, ViewStyle } from "react-native";

import { PersonFilledIcon } from "@/assets/icons";
import { Typography } from "@/components";
import Radio from "@/components/Radio";
import { useThemeStyles } from "@/theme";

interface ContactListItemProps {
  fullName: string;
  contactInfo: string;
  isSelected: boolean;
  onContactPress?: () => void | undefined;
  testID?: string;
}

export default function ContactsListItem({
  fullName,
  contactInfo,
  isSelected = false,
  onContactPress,
  testID,
}: ContactListItemProps) {
  const itemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing["8p"],
    paddingVertical: theme.spacing["8p"],
    flex: 1,
  }));
  const profileIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    width: theme.spacing["48p"],
    height: theme.spacing["48p"],
    borderRadius: theme.spacing["48p"],
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing["12p"],
  }));

  const itemContentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    width: "60%",
  }));

  return (
    <Pressable testID={testID + ":ContactListItemPress"} onPress={onContactPress}>
      <View style={itemContainerStyle}>
        <View style={profileIconContainerStyle}>
          <PersonFilledIcon width={24} height={24} />
        </View>
        <View style={itemContentContainerStyle}>
          <Typography.Text size="callout" weight="medium">
            {fullName}
          </Typography.Text>
          <Typography.Text size="footnote" weight="regular" color="neutralBase">
            {contactInfo}
          </Typography.Text>
        </View>
        <Radio isSelected={isSelected} />
      </View>
    </Pressable>
  );
}
