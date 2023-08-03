import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import { useThemeStyles } from "@/theme";

import { FinancialInformationSection, TouchableEditIcon } from "../components";

interface ViewFinancialInformationProps {
  setIsEditable: (isViewing: boolean) => void;
  isEditable?: boolean;
}

export default function ViewFinancialInformationScreen({ setIsEditable, isEditable }: ViewFinancialInformationProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data: userInformation, isFetching } = useCustomerProfile();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnEditable = () => {
    setIsEditable(!isEditable);
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    top: theme.spacing["4p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    alignSelf: "center",
    backgroundColor: theme.palette["neutralBase-60"],
    flex: 1,
    paddingLeft: theme.spacing["16p"],
    paddingRight: theme.spacing["16p"],
  }));

  const cardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderColor: theme.palette["neutralBase-20"],
    borderWidth: 0.5,
    borderRadius: theme.radii.small,
    paddingTop: theme.spacing["12p"],
    paddingBottom: theme.spacing["8p"],
  }));

  const headerTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    marginBottom: theme.spacing["20p"],
  }));

  return (
    <Page insets={["left", "right", "bottom"]}>
      <View style={headerStyle}>
        <NavHeader title={t("Settings.FinancialInformation.title")} onBackPress={handleOnBackPress} />
      </View>
      {userInformation === undefined || isFetching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <>
          <View style={containerStyle}>
            <View style={headerTextStyle}>
              <Typography.Text color="neutralBase+30" size="title3" weight="medium">
                {t("Settings.FinancialInformation.subTitle")}
              </Typography.Text>
            </View>

            <View style={cardStyle}>
              <View style={styles.iconContainer}>
                <FinancialInformationSection
                  label={t("Settings.FinancialInformation.occupation")}
                  value={userInformation.FinancialInformation.OccupationCode}
                />
                <TouchableEditIcon onPress={handleOnEditable} />
              </View>
              <FinancialInformationSection
                label={t("Settings.FinancialInformation.useCroatia")}
                value={userInformation.FinancialInformation.AccountPurpose}
              />
              <FinancialInformationSection
                label={t("Settings.FinancialInformation.sourceOfIncome")}
                value={userInformation.FinancialInformation.SourceOfIncome}
              />
              <FinancialInformationSection
                label={t("Settings.FinancialInformation.spendEachMonth")}
                value={userInformation.FinancialInformation.MonthlyLimit}
              />
            </View>
          </View>
        </>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
