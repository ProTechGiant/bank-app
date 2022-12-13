import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

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

  const navigationHandler = () => {
    navigation.navigate("Onboarding.ConfirmDetails");
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <LinkModal
          modalVisible={modalVisible}
          linkText="Open Nafath App"
          onNavigate={navigationHandler}
          toggleModal={toggleModalHandler}>
          <Inline xAlign="center">
            <View style={styles.numberContainer}>
              <Typography.Text style={styles.textCenter} color="neutralBase-50" weight="bold" size="title1">
                96
              </Typography.Text>
            </View>
            <Typography.Text style={styles.textCenter} color="neutralBase" size="footnote" weight="semiBold">
              Nafath Requered number is 96. Remember to the end of the autentication
            </Typography.Text>
          </Inline>
        </LinkModal>
        <View style={styles.headerContainer}>
          <Typography.Text size="large" weight="bold">
            Continue with an authentication method
          </Typography.Text>
        </View>
        <Stack space="medium">
          <LinkCard onNavigate={toggleModalHandler}>
            <Typography.Text size="callout" weight="medium" color="primaryBase+10">
              Nafath App{" "}
              <Typography.Text weight="regular" size="footnote">
                fastest
              </Typography.Text>
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              Verification by using biometric: the app uses your face ID as third level of security
            </Typography.Text>
          </LinkCard>
          <LinkCard onNavigate={navigationHandler}>
            <Typography.Text size="callout" weight="medium" color="primaryBase+10">
              Nafath website
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
              For customers who do not have the Nafath app and choose not to download it
            </Typography.Text>
          </LinkCard>
          <MoreInfoDropdown title="What is Nafath?">
            <Typography.Text color="neutralBase" size="footnote">
              Nafath is an application that allows Croatia uses to help verify your identity. Lorem ipsum text: Helpful
              text explaining which option to pick if you haven’t used Nafath before.
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
  modalContent: {
    alignItems: "center",
    display: "flex",
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
