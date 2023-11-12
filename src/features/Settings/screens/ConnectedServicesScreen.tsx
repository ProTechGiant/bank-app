import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, ViewStyle } from "react-native";

import { FilterIcon, InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import { useThemeStyles } from "@/theme";

import { ConnectedServicesCardList, ConnectedServicesFilterModal, ConnectedServicesInfoModal } from "../components";
import ConnectedServicesAppliedFilterPills from "../components/ConnectedServicesAppliedFilterPills";
import {
  ConnectedServicesStatus,
  ConnectedServicesTabTypes,
  currentTabDefaultUserConsentApiParams,
  DefaultOffset,
  DefaultPageSize,
  historyTabDefaultUserConsentApiParams,
} from "../constants";
import { useGetAccountAccessConsents, useGetTppList } from "../hooks/query-hooks";
import {
  ConnectedServicesDataListInterface,
  ConnectedServicesFilterInterface,
  UserConsentQueryParamsInterface,
} from "../types";

const ConnectedServicesScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState<ConnectedServicesTabTypes>(ConnectedServicesTabTypes.CURRENT);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);
  const { isError: errorDuringGetTpp, data: tppList } = useGetTppList();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [connectedAccountsList, setConnectedAccountsList] = useState<ConnectedServicesDataListInterface[]>([]);
  const [selectedTppId, setSelectedTppId] = useState<string | undefined>();
  const [selectedFilters, setSelectedFilters] = useState<ConnectedServicesFilterInterface | null>(null);
  const [userConsentApiParams, setUserConsentApiParams] = useState<UserConsentQueryParamsInterface>(
    currentTabDefaultUserConsentApiParams
  );

  const {
    isError: errorDuringGetAccount,
    isLoading,
    data: accountAccessConsents,
    refetch,
  } = useGetAccountAccessConsents({
    ...userConsentApiParams,
    Status: (currentTab === ConnectedServicesTabTypes.CURRENT
      ? currentTabDefaultUserConsentApiParams.Status
      : selectedFilters?.statusFilters ?? historyTabDefaultUserConsentApiParams.Status
    ).join(","),
    ToCreationDate: selectedFilters?.creationDateFilter,
    TPPId: selectedTppId,
  });

  useEffect(() => {
    if (userConsentApiParams.Offset > 0) {
      setConnectedAccountsList(prev => [...prev, ...(accountAccessConsents?.connectedAccounts || [])]);
    } else {
      setConnectedAccountsList(accountAccessConsents?.connectedAccounts ?? []);
    }
  }, [accountAccessConsents]);

  useEffect(() => {
    setIsErrorModalVisible(errorDuringGetAccount || errorDuringGetTpp);
  }, [errorDuringGetTpp, errorDuringGetAccount]);

  const handleOnTabChange = (tab: ConnectedServicesTabTypes) => {
    if (tab === currentTab) return;
    handleOnClearAllFilters();
    setConnectedAccountsList([]);

    if (tab === ConnectedServicesTabTypes.CURRENT) {
      setUserConsentApiParams(currentTabDefaultUserConsentApiParams);
    } else {
      setUserConsentApiParams(historyTabDefaultUserConsentApiParams);
    }

    setCurrentTab(tab);
  };

  const handleOnGoBack = () => {
    navigation.goBack();
  };

  const handleOnToggleInfoModal = () => {
    setIsInfoModalVisible(!isInfoModalVisible);
  };

  const handleOnToggleErrorModal = () => {
    setIsErrorModalVisible(!isErrorModalVisible);
  };

  const handleOnToggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const handleOnEndReached = () => {
    if (!accountAccessConsents || isLoading) return;

    const totalRecords = accountAccessConsents.totalRecords || 0;
    const currentRecords = connectedAccountsList.length;

    if (currentRecords < totalRecords) {
      setUserConsentApiParams(prev => ({
        ...prev,
        Offset: prev.Offset + 1,
      }));
    }
  };

  const handleOnRefresh = () => {
    setUserConsentApiParams(pre => ({
      ...pre,
      PageSize: DefaultPageSize,
      Offset: DefaultOffset,
    }));
    refetch();
  };

  const handleOnApplyFilter = (status?: ConnectedServicesStatus[], createDate?: string, tppId?: string) => {
    setSelectedTppId(tppId);

    if (status || createDate) {
      const filtersCopy = { ...selectedFilters };
      if (currentTab === ConnectedServicesTabTypes.CURRENT) {
        setUserConsentApiParams(currentTabDefaultUserConsentApiParams);
      } else {
        setUserConsentApiParams(historyTabDefaultUserConsentApiParams);
      }
      setConnectedAccountsList([]);
      if (currentTab === ConnectedServicesTabTypes.CURRENT) {
        filtersCopy.creationDateFilter = createDate;
      } else {
        filtersCopy.statusFilters = status;
      }
      setSelectedFilters(filtersCopy);
    }

    handleOnToggleFilterModal();
  };

  const handleOnClearAllFilters = () => {
    setSelectedFilters(null);
    setSelectedTppId(undefined);
    setIsFilterModalVisible(false);
  };

  const handleOnRemoveFilter = (filterType: string, isTpp?: boolean) => {
    setConnectedAccountsList([]);

    if (isTpp) {
      setSelectedTppId(undefined);
    } else {
      if (!selectedFilters) return;
      const filterCopy = { ...selectedFilters };
      if (currentTab === ConnectedServicesTabTypes.CURRENT) {
        filterCopy.creationDateFilter = undefined;
      } else {
        filterCopy.statusFilters = filterCopy.statusFilters?.filter(filter => filter !== filterType);
      }
      if (!filterCopy.creationDateFilter && (!filterCopy.statusFilters || !filterCopy.statusFilters.length)) {
        setSelectedFilters(null);
      } else {
        setSelectedFilters(filterCopy);
      }
    }
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

  const iconWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: "auto",
    marginRight: theme.spacing["20p"],
  }));

  const selectedTpp = tppList?.find(item => item.TPPId === selectedTppId);
  return (
    <Page>
      <NavHeader withBackButton={true} />
      <ContentContainer>
        <Typography.Text size="title1" weight="medium" style={titleStyle}>
          {t("Settings.ConnectedServicesScreen.title")}
        </Typography.Text>
        <Typography.Text size="callout" weight="medium" color="neutralBase+10" style={subTitleStyle}>
          {t("Settings.ConnectedServicesScreen.subTitle")}
          <Stack as={Pressable} onPress={handleOnToggleInfoModal} direction="horizontal">
            <InfoCircleIcon />
          </Stack>
        </Typography.Text>
        <Stack style={segmentedControlStyle} direction="horizontal">
          <SegmentedControl onPress={handleOnTabChange} value={currentTab}>
            <SegmentedControl.Item value={ConnectedServicesTabTypes.CURRENT} fontWeight="regular">
              {t("Settings.ConnectedServicesScreen.current")}
            </SegmentedControl.Item>
            <SegmentedControl.Item value={ConnectedServicesTabTypes.HISTORY} fontWeight="regular">
              {t("Settings.ConnectedServicesScreen.history")}
            </SegmentedControl.Item>
          </SegmentedControl>
          <Pressable onPress={handleOnToggleFilterModal} style={iconWrapperStyle}>
            <FilterIcon />
          </Pressable>
        </Stack>

        {selectedFilters || selectedTpp ? (
          <ConnectedServicesAppliedFilterPills
            currentTab={currentTab}
            appliedFilters={selectedFilters}
            onRemove={handleOnRemoveFilter}
            selectedTpp={selectedTpp ?? null}
          />
        ) : null}

        <SafeAreaView>
          <ConnectedServicesCardList
            isFilterActive={!!selectedFilters}
            onEndReached={handleOnEndReached}
            onRefresh={handleOnRefresh}
            isLoading={false}
            connectedAccounts={connectedAccountsList ?? []}
          />
        </SafeAreaView>
      </ContentContainer>
      <ConnectedServicesInfoModal isVisible={isInfoModalVisible} onClose={handleOnToggleInfoModal} />
      <ConnectedServicesFilterModal
        tppList={tppList ?? []}
        isVisible={isFilterModalVisible}
        onClose={handleOnToggleFilterModal}
        currentTab={currentTab}
        onApplyFilter={handleOnApplyFilter}
        appliedFilters={selectedFilters}
        onClearAll={handleOnClearAllFilters}
        preSelectedTppId={selectedTppId}
      />
      <NotificationModal
        isVisible={isErrorModalVisible}
        title={t("Settings.ConnectedServicesScreen.ErrorModal.title")}
        message={t("Settings.ConnectedServicesScreen.ErrorModal.description")}
        onClose={handleOnToggleErrorModal}
        variant="error"
        buttons={{
          primary: <Button onPress={handleOnRefresh}>{t("Settings.ConnectedServicesScreen.reload")}</Button>,
          secondary: <Button onPress={handleOnGoBack}>{t("Settings.ConnectedServicesScreen.goBack")}</Button>,
        }}
      />
    </Page>
  );
};

export default ConnectedServicesScreen;
