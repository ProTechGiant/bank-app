import { useTranslation } from "react-i18next";
import { Image, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { userType } from "../mocks";
import { Tag } from "../types";

interface TagChartProp {
  data: Tag;
  TotalAmount: number;
}

export default function TagChart({ data, TotalAmount }: TagChartProp) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    backgroundColor: theme.palette["neutralBase-60"],
  }));
  const titlesLayoutsStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));
  const imagesStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["8p"],
  }));

  return (
    <View style={containerStyle}>
      <Typography.Text color="neutralBase+30" size="title3" weight="medium">
        {data.TagName}
      </Typography.Text>
      <View style={titlesLayoutsStyle}>
        <Typography.Text color="neutralBase" size="caption1" weight="regular">
          {t("TopSpending.SingleTagScreen.totalSpending")}
        </Typography.Text>

        <Typography.Text color="neutralBase+30" size="title3" weight="bold">
          {TotalAmount} {t("Currency.sar")}
        </Typography.Text>
      </View>

      <View style={imagesStyle}>
        {userType !== "plusTier" ? <Image source={require("../assets/images/hidden-text.png")} /> : null}
        <Image source={require("../assets/images/hidden-graph.png")} />
      </View>
    </View>
  );
}
