import { useTranslation } from "react-i18next";
import { ScrollView, ViewStyle } from "react-native";

import { AppreciationCard } from "@/components";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { CustomerTierEnum } from "@/types/CustomerProfile";

import { useTopAppreciations } from "../hooks/query-hooks";
import Section from "./Section";

interface AppreciationSectionProps {
  onViewAllPress: () => void;
}

export default function AppreciationSection({ onViewAllPress }: AppreciationSectionProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: AppreciationList } = useTopAppreciations();
  const { data: userInfo } = useCustomerProfile();
  const userTier = userInfo?.CustomerTier ?? CustomerTierEnum.STANDARD;
  const userFullName = userInfo?.FullName;

  const handleOnAppreciationCardPress = (appreciation: AppreciationType) => {
    navigation.navigate("Appreciation.AppreciationStack", {
      screen: "Appreciation.AppreciationDetailsScreen",
      params: { appreciation, userInfo: { userTier, userFullName } },
    });
  };

  const handleOnLikeAppreciation = () => {
    //TODO like an appreciation logic
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["12p"],
    paddingRight: theme.spacing["20p"] * 2, // correct for padding twice
  }));

  return (
    <Section title={t("Home.DashboardScreen.AppreciationSectionTitle")} onViewAllPress={onViewAllPress}>
      <ScrollView
        contentContainerStyle={contentStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={containerStyle}>
        {AppreciationList?.Appreciations
          ? AppreciationList.Appreciations.slice(0, 3).map((appreciation, index) => {
              return (
                <AppreciationCard
                  appreciation={appreciation}
                  userTier={userTier}
                  key={index}
                  onPress={handleOnAppreciationCardPress}
                  onLike={handleOnLikeAppreciation}
                />
              );
            })
          : null}
      </ScrollView>
    </Section>
  );
}
