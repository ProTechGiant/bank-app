import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import { DropdownInput } from "@/components/Input";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { usePOSLimits } from "../hooks/query-hooks";
import { mockPOSTransactionLimits } from "../mocks/mockPOSTransactionLimits";

export default function POSLimitScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isError, isLoading, refetch } = usePOSLimits();
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState(false);
  const [currentPOSLimit, setCurrentPOSLimit] = useState("5000"); //TODO: replace with original pos limit

  useEffect(() => {
    // setIsLoadingErrorVisible(isError); //TODO: un-comment this when api is developed.
  }, [isError]);

  const handleOnPOSLimitChange = (value: string) => {
    //TODO: Handle navigation for selection
    if (Number(value) > Number(currentPOSLimit)) {
      Alert.alert("OTP FLOW");
      setCurrentPOSLimit(value);
    } else {
      setCurrentPOSLimit(value);
    }
  };

  const handleOnDone = () => {
    //TODO: Add api here
  };

  const handleOnCancel = () => {
    navigation.goBack();
  };

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginVertical: theme.spacing["16p"],
  }));

  const posFieldContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    marginTop: theme.spacing["32p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <ContentContainer style={mainContainerStyle}>
            <Stack direction="vertical" gap="8p">
              <Typography.Text color="neutralBase+30" size="title1" weight="regular">
                {t("CardActions.POSLimitScreen.title")}
              </Typography.Text>
              <Typography.Text size="callout" color="neutralBase+20" weight="regular">
                {t("CardActions.POSLimitScreen.subTitle")}
              </Typography.Text>
            </Stack>
            <View style={posFieldContainerStyle}>
              <DropdownInput
                autoselect={false}
                buttonLabel={t("CardActions.POSLimitScreen.doneButton")}
                isFixedHeight
                headerText={t("CardActions.POSLimitScreen.dropDownTitle")}
                options={mockPOSTransactionLimits}
                variant="small"
                label={t("CardActions.POSLimitScreen.dropDownTitle")}
                value={currentPOSLimit}
                onChange={handleOnPOSLimitChange}
              />
              <Stack align="stretch" direction="vertical">
                <Button onPress={handleOnDone}>
                  <Typography.Text color="neutralBase-60" size="body" weight="medium">
                    {t("CardActions.POSLimitScreen.doneButton")}
                  </Typography.Text>
                </Button>
                <Button onPress={handleOnCancel} variant="tertiary">
                  <Typography.Text size="body" weight="medium">
                    {t("CardActions.POSLimitScreen.cancelButton")}
                  </Typography.Text>
                </Button>
              </Stack>
            </View>
          </ContentContainer>
        )}
      </Page>
      <LoadingErrorNotification
        isVisible={isLoadingErrorVisible}
        onClose={() => setIsLoadingErrorVisible(false)}
        onRefresh={() => refetch()}
      />
    </SafeAreaProvider>
  );
}
