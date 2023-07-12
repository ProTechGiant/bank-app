import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import CustomCard from "../components/CustomCard";
import { questions } from "../mocks/mockQuestions";

interface ViewFinancialInformationProps {
  setIsEditable: (isViewing: boolean) => void;
  isEditable?: boolean;
}

export default function ViewFinancialInformationScreen({ setIsEditable, isEditable }: ViewFinancialInformationProps) {
  const navigation = useNavigation();

  const { t } = useTranslation();

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
  }));

  const cardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    alignSelf: "center",
    alignContent: "center",
    width: "100%",
    paddingLeft: theme.spacing["12p"],
    paddingRight: theme.spacing["12p"],
    marginTop: theme.spacing["24p"],
  }));

  return (
    <Page insets={["left", "right", "bottom"]}>
      <View style={headerStyle}>
        <NavHeader title={t("Settings.FinancialInformation.title")} onBackPress={handleOnBackPress} />
      </View>
      <View style={containerStyle}>
        <View style={cardStyle}>
          <CustomCard
            inputs={questions}
            onPress={handleOnEditable}
            title={t("Settings.FinancialInformation.subTitle")}
          />
        </View>
      </View>
    </Page>
  );
}
