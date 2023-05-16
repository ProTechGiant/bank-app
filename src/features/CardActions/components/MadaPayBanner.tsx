import { Trans } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import MadaPayLogoSvg from "../assets/madapay-logo.svg";

export default function MadaPayBanner() {
  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["16p"],
    flex: 1,
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["10p"],
  }));

  return (
    <View style={containerStyle}>
      <MadaPayLogoSvg width={48} height={29} />
      <View style={textStyle}>
        <Typography.Text color="neutralBase" size="footnote" weight="regular">
          <Trans
            i18nKey="CardActions.madaPayDescription"
            components={{
              1: <Typography.Text color="neutralBase" size="footnote" weight="bold" />,
            }}
          />
        </Typography.Text>
      </View>
    </View>
  );
}
