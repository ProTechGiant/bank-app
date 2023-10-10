import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import TermsAndConditionDetails from "@/components/TermsAndConditionDetails";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TermsAndConditionSection } from "@/types/Content";

interface TermsAndConditionsModalProps {
  termsSections: TermsAndConditionSection[] | undefined;
}
export default function TermsAndConditionsPage({ termsSections }: TermsAndConditionsModalProps) {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["20p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />

        {termsSections === undefined ? (
          <FlexActivityIndicator />
        ) : (
          <ContentContainer isScrollView>
            <View style={containerStyle}>
              <Typography.Text color="neutralBase+30" weight="medium" size="title1">
                {t("TermsAndConditionsModal.title")}
              </Typography.Text>
            </View>

            {termsSections.map((term, index) => (
              <Typography.Text key={index} size="callout" color="primaryBase-40" weight="medium">
                {`${index + 1}. ${term.Title}`}
              </Typography.Text>
            ))}

            <View style={separatorStyle} />

            {termsSections.map((term, index) => {
              return <TermsAndConditionDetails key={index} title={term.Title} data={term.Bodies} index={index + 1} />;
            })}
          </ContentContainer>
        )}
      </Page>
    </SafeAreaProvider>
  );
}
