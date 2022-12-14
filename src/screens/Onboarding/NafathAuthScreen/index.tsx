import { useState } from "react";
import { Linking, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";

import MoreInfoDropdown from "@/features/MoreInfoDropdown";
import LinkCard from "@/components/LinkCard";
import LinkModal from "@/components/LinkModal";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { palette, spacing } from "@/theme/values";
import { Stack } from "@/components/Stack";
import { Inline } from "@/components/Inline";

const NafathAuthScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModalHandler = () => {
    setModalVisible(!modalVisible);
  };

  const appNavigationHandler = () => {
    navigation.navigate("Onboarding.ConfirmDetails");
  };
  const webNavigationHandler = () => {
    Linking.openURL("https://www.absher.sa/");
    setTimeout(() => {
      navigation.navigate("Onboarding.ConfirmDetails");
    }, 500);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <LinkModal
          modalVisible={modalVisible}
          linkText="Open Nafath App"
          onNavigate={appNavigationHandler}
          toggleModal={toggleModalHandler}>
          <Inline xAlign="center">
            <View style={styles.numberContainer}>
              <Typography.Text style={styles.textCenter} color="neutralBase-50" weight="bold" size="title1">
                96
              </Typography.Text>
            </View>
            <Typography.Text style={styles.textCenter} color="neutralBase" size="footnote" weight="semiBold">
              Make a note of this number as you will be asked for it shortly
            </Typography.Text>
          </Inline>
        </LinkModal>
        <View style={styles.headerContainer}>
          <Typography.Text size="large" weight="bold">
            Authentication by Nafath
          </Typography.Text>
        </View>
        <Stack space="medium">
          <LinkCard onNavigate={toggleModalHandler}>
            <Typography.Text size="callout" weight="medium" color="primaryBase+10">
              Nafath app{" "}
              <Typography.Text weight="regular" size="footnote">
                Your fastest experience
              </Typography.Text>
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              Select this option for a quick ID authentication
            </Typography.Text>
          </LinkCard>
          <LinkCard onNavigate={webNavigationHandler}>
            <Typography.Text size="callout" weight="medium" color="primaryBase+10">
              Nafath site
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              You will be taken from this app to the Nafath site
            </Typography.Text>
          </LinkCard>
          <MoreInfoDropdown title="Why do I have to use Nafath?">
            <Typography.Text color="neutralBase" size="footnote">
              Nafath enables Croatia to verify your identity
            </Typography.Text>
          </MoreInfoDropdown>
        </Stack>
      </View>
    </SafeAreaView>
  );
};

export default NafathAuthScreen;

const styles = StyleSheet.create({
  container: {
    margin: spacing.large,
  },
  headerContainer: {
    marginBottom: spacing.large,
  },
  numberContainer: {
    alignContent: "center",
    backgroundColor: palette.complimentBase,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginVertical: spacing.xlarge,
    width: 60,
  },
  textCenter: {
    textAlign: "center",
  },
});
