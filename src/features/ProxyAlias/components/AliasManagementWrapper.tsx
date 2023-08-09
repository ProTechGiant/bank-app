import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import AccountIcon from "../assets/AccountIcon";
import AccountModal from "./AccountModal";

export default function AliasManagementWrapper() {
  const { t } = useTranslation();

  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);

  const accountInfoButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["20p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-20"],
    borderRadius: theme.radii.small,
    marginTop: theme.spacing["24p"],
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const accountIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const chevronColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <>
      <View>
        <Typography.Text weight="regular" size="body">
          {t("ProxyAlias.AliasManagementScreen.aliasManagement")}
        </Typography.Text>

        <Pressable onPress={() => setIsAccountModalVisible(true)} style={accountInfoButtonStyle}>
          <Stack direction="horizontal" gap="16p" align="center">
            <AccountIcon color={accountIconColor} />

            <Typography.Text size="callout" weight="medium" color="primaryBase">
              {t("ProxyAlias.AliasManagementScreen.accountInformation")}
            </Typography.Text>
          </Stack>
          <View style={styles.chevronContainer}>
            <ChevronRightIcon color={chevronColor} />
          </View>
        </Pressable>
      </View>

      <AccountModal visible={isAccountModalVisible} onClose={() => setIsAccountModalVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
