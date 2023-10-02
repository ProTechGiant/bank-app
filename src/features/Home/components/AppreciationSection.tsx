import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, useWindowDimensions, View, ViewStyle } from "react-native";

import { AppreciationCard } from "@/components";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { AppreciationType } from "@/types/Appreciation";
import { CustomerTierEnum } from "@/types/CustomerProfile";

import { useAppreciationWishlist, useTopAppreciations } from "../hooks/query-hooks";
import EmptySection from "./EmptySection";
import RefreshSection from "./RefreshSection";
import Section from "./Section";

interface AppreciationSectionProps {
  onViewAllPress: () => void;
}

export default function AppreciationSection({ onViewAllPress }: AppreciationSectionProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: AppreciationListData, isLoading, isError, refetch } = useTopAppreciations();
  const { data: userInfo } = useCustomerProfile();
  const userTier = userInfo?.CustomerTier ?? CustomerTierEnum.STANDARD;
  const userFullName = userInfo?.FullName;

  const { width } = useWindowDimensions();
  const appreciationWishlist = useAppreciationWishlist();
  const [appreciationList, setAppreciationList] = useState<AppreciationType<boolean>[] | undefined>(undefined);

  useEffect(() => {
    setAppreciationList(AppreciationListData);
  }, [AppreciationListData]);

  const handleOnAppreciationCardPress = (appreciation: AppreciationType<boolean>) => {
    navigation.navigate("Appreciation.AppreciationStack", {
      screen: "Appreciation.AppreciationDetailsScreen",
      params: { appreciation, userInfo: { userTier, userFullName }, handleOnLikeAppreciation },
    });
  };

  const handleOnLikeAppreciation = async (id: string, isFavourite: boolean) => {
    try {
      await appreciationWishlist.mutateAsync(id);
      setAppreciationList(list =>
        list?.map((appreciation: AppreciationType<boolean>) => {
          if (appreciation.AppreciationId === id) return { ...appreciation, isFavourite: !isFavourite };
          else {
            return appreciation;
          }
        })
      );
    } catch (err) {}
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["12p"],
    paddingRight: theme.spacing["20p"] * 2, // correct for padding twice
  }));

  const loadingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    height: width - theme.spacing["64p"],
    width: width - theme.spacing["64p"],
    justifyContent: "center",
  }));

  return (
    <Section title={t("Home.DashboardScreen.AppreciationSectionTitle")} onViewAllPress={onViewAllPress}>
      {isLoading ? (
        <View style={loadingContainerStyle}>
          <ActivityIndicator />
        </View>
      ) : isError ? (
        <RefreshSection
          hint={t("Home.RefreshSection.hintForAppreciation")}
          hasIcon={true}
          hasBorder={true}
          onRefreshPress={refetch}
        />
      ) : appreciationList && appreciationList.length > 0 ? (
        <ScrollView
          contentContainerStyle={contentStyle}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={containerStyle}>
          {appreciationList
            ? appreciationList.slice(0, 3).map((appreciation, index) => {
                return (
                  <AppreciationCard
                    appreciation={appreciation}
                    userTier={userTier}
                    key={index}
                    isPromoted={appreciation?.Rank === 1}
                    onPress={handleOnAppreciationCardPress}
                    onLike={handleOnLikeAppreciation}
                  />
                );
              })
            : null}
        </ScrollView>
      ) : (
        <EmptySection hint={t("Home.EmptySection.hintForAppreciation")} />
      )}
    </Section>
  );
}
