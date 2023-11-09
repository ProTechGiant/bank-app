import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { FilterIcon, InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import { useThemeStyles } from "@/theme";

import {
  ConnectedServicesCardList,
  ConnectedServicesFilterModal,
  ConnectedServicesInfoModal,
  Loader,
} from "../components";
import { ConnectedServicesStatus, ConnectedServicesTabTypes } from "../constants";
import { useGetAccountAccessConsents, useGetTppList } from "../hooks/query-hooks";
import { TppInfoInterface } from "../types";
import { sortNewestToOldest } from "../utils/sortNewestToOldest";

export default function ConnectedServicesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState<ConnectedServicesTabTypes>(ConnectedServicesTabTypes.CURRENT);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const {
    isError: errorDuringGetAccount,
    isLoading,
    data: connectedAccounts,
    refetch: refetchAccountAccessConsents,
  } = useGetAccountAccessConsents();
  const { isError: errorDuringGetTpp, data: tppList } = useGetTppList();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedTpp, setSelectedTpp] = useState<Omit<TppInfoInterface, "TPPLogo"> | null>(null);

  useEffect(() => {
    setIsErrorModalVisible(errorDuringGetAccount || errorDuringGetTpp);
  }, [errorDuringGetTpp, errorDuringGetAccount]);

  const [authorizedConnectedAccounts, othersConnectedAccounts] = useMemo(() => {
    return [
      connectedAccounts?.filter(account => account.ConsentStatus === ConnectedServicesStatus.AUTHORIZED),
      connectedAccounts?.filter(account => account.ConsentStatus !== ConnectedServicesStatus.AUTHORIZED),
    ];
  }, [connectedAccounts]);

  const handleOnInfo = () => {
    setIsInfoModalVisible(!isInfoModalVisible);
  };

  const handleOnError = () => {
    setIsErrorModalVisible(!isErrorModalVisible);
  };

  const handleOnFilter = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
    setSelectedTpp(null);
    setSelectedFilters([]);
  };

  const handleOnGoBack = () => {
    navigation.goBack();
  };

  const handleOnReload = () => {
    refetchAccountAccessConsents();
  };

  const handleOnApplyFilter = () => {
    handleOnFilter();
  };

  const handleOnSelectTpp = (value: string) => {
    if (!tppList) return;
    const tpp = /* tppList?.TPPList */ tppList.find(item => item.TPPId === value);
    if (!tpp) return;
    setSelectedTpp(tpp);
  };

  const handleOnClearAll = () => {
    setSelectedFilters([]);
    handleOnFilter();
  };

  const handleOnSelectFilter = (filter: string) => {
    const selectedFiltersCopy = [...selectedFilters];
    const filterIndex = selectedFiltersCopy.indexOf(filter);
    if (filterIndex > -1) {
      selectedFiltersCopy.splice(filterIndex, 1);
    } else {
      selectedFiltersCopy.push(filter);
    }
    setSelectedFilters(selectedFiltersCopy);
  };

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const subTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    flexDirection: "row",
  }));

  const iconWraperStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: "auto",
    marginRight: theme.spacing["20p"],
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />

      <ContentContainer>
        <Typography.Text size="title1" weight="medium" style={titleStyle}>
          {t("Settings.ConnectedServicesScreen.title")}
        </Typography.Text>
        <Typography.Text size="callout" weight="medium" color="neutralBase+10" style={subTitleStyle}>
          {t("Settings.ConnectedServicesScreen.subTitle")}
          <Stack as={Pressable} onPress={handleOnInfo} direction="horizontal">
            <InfoCircleIcon />
          </Stack>
        </Typography.Text>
        <Stack style={segmentedControlStyle} direction="horizontal">
          <SegmentedControl
            onPress={item => {
              setCurrentTab(item);
            }}
            value={currentTab}>
            <SegmentedControl.Item value={ConnectedServicesTabTypes.CURRENT} fontWeight="regular">
              {t("Settings.ConnectedServicesScreen.current")}
            </SegmentedControl.Item>
            <SegmentedControl.Item value={ConnectedServicesTabTypes.HISTORY} fontWeight="regular">
              {t("Settings.ConnectedServicesScreen.history")}
            </SegmentedControl.Item>
          </SegmentedControl>
          <Pressable onPress={handleOnFilter} style={iconWraperStyle}>
            <FilterIcon />
          </Pressable>
        </Stack>
        <Stack direction="vertical" style={styles.containerStyle} align="stretch">
          {isLoading ? (
            <Loader />
          ) : currentTab === ConnectedServicesTabTypes.CURRENT ? (
            <ConnectedServicesCardList connectedAccounts={sortNewestToOldest(authorizedConnectedAccounts ?? [])} />
          ) : (
            <>
              <ConnectedServicesCardList connectedAccounts={othersConnectedAccounts ?? []} />
            </>
          )}
        </Stack>
      </ContentContainer>
      <ConnectedServicesInfoModal isVisible={isInfoModalVisible} onClose={handleOnInfo} />
      <ConnectedServicesFilterModal
        tppList={tppList ?? []}
        isVisible={isFilterModalVisible}
        onClose={handleOnFilter}
        status={currentTab}
        onApplyFilter={handleOnApplyFilter}
        onSelectFilter={handleOnSelectFilter}
        onClearAll={handleOnClearAll}
        selectedTpp={selectedTpp}
        onSelectTpp={handleOnSelectTpp}
        selectedFilters={selectedFilters}
      />
      <NotificationModal
        isVisible={isErrorModalVisible}
        title={t("Settings.ConnectedServicesScreen.ErrorModal.title")}
        message={t("Settings.ConnectedServicesScreen.ErrorModal.description")}
        onClose={handleOnError}
        variant="error"
        buttons={{
          primary: <Button onPress={handleOnReload}>{t("Settings.ConnectedServicesScreen.reload")}</Button>,
          secondary: <Button onPress={handleOnGoBack}>{t("Settings.ConnectedServicesScreen.goBack")}</Button>,
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingBottom: 100,
  },
});
