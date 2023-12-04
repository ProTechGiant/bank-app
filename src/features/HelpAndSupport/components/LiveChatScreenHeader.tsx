import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LiveChatScreenHeaderProps {
  isHide?: boolean;
  onBackPress: () => void;
}

export default function LiveChatScreenHeader({ onBackPress }: LiveChatScreenHeaderProps) {
  const { t } = useTranslation();

  const navHeaderContainer = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const titleContainer = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase+30"],
    paddingVertical: theme.spacing["16p"],
  }));

  const darkColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  return (
    <React.Fragment>
      <View style={navHeaderContainer}>
        <NavHeader onBackPress={onBackPress} showStatusBar={false} backgroundColor={darkColor} variant="white" />
        <ContentContainer style={titleContainer}>
          <Typography.Text color="neutralBase-60" size="title1" weight="medium">
            {t("HelpAndSupport.LiveChatScreen.headerTitle")}
          </Typography.Text>
          <Typography.Text color="neutralBase-60" size="callout" weight="semiBold">
            {`${t("HelpAndSupport.LiveChatScreen.firstLineTitle")} ${t(
              "HelpAndSupport.LiveChatScreen.secondLineTitle"
            )}`}
          </Typography.Text>
        </ContentContainer>
      </View>
    </React.Fragment>
  );
}
