import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { CheckboxInput } from "@/components/Input";
import { useThemeStyles } from "@/theme";

interface AccountCardItemProps {
  accountCardId: string;
  selected: boolean;
  onCheckboxChange: (value: boolean) => void;
  cardImageSource?: ImageSourcePropType;
  cardText: string;
  maskedNumber?: string;
}

const AccountCardItem: React.FC<AccountCardItemProps> = ({
  selected,
  onCheckboxChange,
  cardImageSource,
  cardText,
  maskedNumber,
}) => {
  const checkBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["12p"],
  }));

  return (
    <Stack direction="horizontal" style={styles.checkBoxStackStyle}>
      <Stack direction="horizontal" align="center">
        {cardImageSource ? <Image source={cardImageSource} /> : null}
        <View>
          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {cardText}
          </Typography.Text>
          <Typography.Text size="caption2" weight="regular" color="neutralBase">
            {maskedNumber}
          </Typography.Text>
        </View>
      </Stack>
      <View style={checkBoxStyle}>
        <CheckboxInput onChange={onCheckboxChange} value={selected} />
      </View>
    </Stack>
  );
};

export default AccountCardItem;

const styles = StyleSheet.create({
  checkBoxStackStyle: {
    alignItems: "center",
    justifyContent: "space-between",
  },
});
