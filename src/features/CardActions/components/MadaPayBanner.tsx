import { Trans } from "react-i18next";
import { StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";

import MadaPayLogoSvg from "../assets/madapay-logo.svg";

export default function MadaPayBanner() {
  return (
    <View style={styles.container}>
      <MadaPayLogoSvg />
      <View style={styles.textContainer}>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    width: "100%",
  },
  textContainer: {
    marginStart: 16,
    paddingEnd: 50,
  },
});
