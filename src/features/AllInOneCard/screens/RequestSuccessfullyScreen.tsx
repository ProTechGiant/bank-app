import { RouteProp, useRoute } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../AllInOneCardStack";

export default function RequestSuccessfullyScreen() {
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.RequestSuccessfullyScreen">>();
  const { title, description, buttonText, imageLogo, onPress, crossButton } = route.params;

  const containerStyle = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase+30" testID="AllInOneCard.RequestSuccessfullyScreen:page">
      {crossButton ? (
        <NavHeader
          testID="AllInOneCard.RequestSuccessfullyScreen:NavHeader"
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={crossButton} color="neutralBase-60" />}
        />
      ) : null}
      <ContentContainer>
        <View style={styles.container}>
          <Stack flex={1} direction="vertical" align="center" justify="center">
            <View style={styles.image}>{imageLogo}</View>
            <Stack direction="vertical" align="center" gap="8p" justify="space-between" style={containerStyle}>
              <Typography.Header size="brand" weight="bold" align="center" color="neutralBase-60">
                {title}
              </Typography.Header>
              <Typography.Text size="callout" weight="regular" align="center" color="neutralBase-60">
                {description}
              </Typography.Text>
            </Stack>
          </Stack>
          <Button color="dark" onPress={onPress} testID="AllInOneCard.RequestSuccessfullyScreen:button">
            {buttonText}
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    height: 418,
    justifyContent: "center",
  },
});
