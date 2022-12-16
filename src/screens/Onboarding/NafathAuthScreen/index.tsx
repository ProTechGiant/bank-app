import { useEffect, useState } from "react";
import { Linking, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";

import MoreInfoDropdown from "@/features/MoreInfoDropdown";
import LinkCard from "@/components/LinkCard";
import LinkModal from "@/components/LinkModal";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { palette, spacing } from "@/theme/values";
import { Stack } from "@/components/Stack";
import { Inline } from "@/components/Inline";
import axios from "axios";

const NafathAuthScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [requestNumber, setRequestNumber] = useState(null);

  const postRequestNumber = () => {
    return axios
      .post("http://alpha-nafath-adapter.apps.development.projectcroatia.cloud/v1/customers/link", {
        NationalId: "0123456789",
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw new Error(error);
      });
  };

  const getRequestNumber = async () => {
    const number = await postRequestNumber();
    setRequestNumber(number.Otp);
  };

  useEffect(() => {
    if (modalVisible) {
      getRequestNumber();
    }
  }, [modalVisible]);

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
            {requestNumber !== null ? (
              <View style={styles.numberContainer}>
                <Typography.Text style={styles.textCenter} color="neutralBase-50" weight="bold" size="title1">
                  {requestNumber}
                </Typography.Text>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <Typography.Text style={styles.textCenter} color="neutralBase" weight="bold" size="title1">
                  Loading...
                </Typography.Text>
              </View>
            )}
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
  loadingContainer: {
    alignContent: "center",
    justifyContent: "center",
    marginVertical: spacing.xlarge,
  },
  textCenter: {
    textAlign: "center",
  },
});
