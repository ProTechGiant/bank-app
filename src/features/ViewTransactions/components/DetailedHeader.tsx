import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { TransactionDetailed } from "../types";
import NumberWithDifferentFontSizes from "./NumberWithDifferentFontSizes";

interface DetailedHeaderProps {
  data: TransactionDetailed;
}

function DetailedHeader({ data }: DetailedHeaderProps) {
  const HeaderContainer = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["20p"],
    justifyContent: "space-between",
    backgroundColor: theme.palette.primaryBase,
  }));

  const textHeader = useThemeStyles<TextStyle>(theme => ({
    lineHeight: theme.typography.text._lineHeights.title2,
  }));

  const subText = useThemeStyles<TextStyle>(theme => ({
    lineHeight: theme.typography.text._lineHeights.caption1,
  }));

  return (
    <View style={HeaderContainer}>
      <View>
        <Typography.Text style={textHeader} color="neutralBase-50" size="title3" weight="bold">
          {data.title}
        </Typography.Text>
        <Typography.Text style={subText} color="primaryBase-40" weight="regular" size="caption2">
          {data.subTitle}
        </Typography.Text>
      </View>

      <View>
        <NumberWithDifferentFontSizes number={data.amount} />
      </View>
    </View>
  );
}

export default DetailedHeader;
