import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View, ViewStyle } from "react-native";

import { InfoFilledCircleIcon, TickIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { ProgressBar } from "@/features/GoalGetter/components";
import WarningBanner from "@/features/InternalTransfers/components/WarningBanner";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";
import { formatCurrency } from "@/utils";

import { Loader } from "../components";
import { useGetTodosList } from "../hooks/query-hooks";

export default function TodosScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [data, setData] = useState<any>({});
  const [isErrorModalVisible, setisErrorModalVisible] = useState<boolean>(false);
  const { data: list, refetch, isLoading, isError } = useGetTodosList("FE");

  useEffect(() => {
    if (!isLoading) {
      setData(isError ? {} : list);
    }
  }, [list, isLoading]);

  useEffect(() => {
    setisErrorModalVisible(isError);
  }, [isError]);

  const handleRefetch = () => {
    setisErrorModalVisible(false);
    refetch();
  };

  const handleOnGoBackPress = () => {
    navigation.goBack();
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["24p"],
    paddingBottom: theme.spacing["64p"],
    marginTop: theme.spacing["48p"],
  }));

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row-reverse",
    marginBottom: theme.spacing["8p"],
  }));

  const inCompleteItemStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["32p"],
    height: theme.spacing["32p"],
    width: theme.spacing["32p"],
    backgroundColor: theme.palette.neutralBase,
  }));

  const stackPerItem = useThemeStyles<ViewStyle>(theme => ({
    maxWidth: "85%",
    marginBottom: theme.spacing["32p"],
  }));

  const limitContainer = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    height: 69,
    alignSelf: "center",
    borderRadius: 25,
    paddingVertical: theme.spacing["8p"],
    backgroundColor: theme.palette["neutralBase+10"],
    marginVertical: theme.spacing["16p"],
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const warningBox = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["24p"],
  }));

  const headerMargin = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const percentage = Math.round((data.TotalNumberOfCompletedActions / data.TotalNumberOfActions) * 100) || 0;
  const isDataAvailable = data?.Actions?.length;

  return (
    <Page insets={["left", "right", "bottom"]} backgroundColor="neutralBase-60">
      <NavHeader variant="branded" title={t("Settings.TodosScreen.title")} testID="Settings.TodosScreen:NavHeader">
        {isDataAvailable && (
          <>
            <View style={limitContainer}>
              <Typography.Text color="neutralBase-50" size="body" weight="regular">
                {t("Settings.TodosScreen.grantedLimit")}
              </Typography.Text>
              <Typography.Text
                color="neutralBase-50"
                size="title3"
                weight="bold"
                testID="Settings.TodosScreen.GreetingLimit">
                {formatCurrency(data?.GrantedLimit || 0)} {t("Settings.TodosScreen.SAR")}
              </Typography.Text>
            </View>
            <Typography.Text color="neutralBase-50" size="footnote" weight="regular">
              {t("Settings.TodosScreen.todosProgress")}
            </Typography.Text>
            <View style={headerStyle}>
              <Typography.Text color="neutralBase-50" size="footnote" weight="regular">
                {`${percentage}% ${t("Settings.TodosScreen.completed")}`}
              </Typography.Text>
            </View>
            <ProgressBar percentage={percentage} hideText />
          </>
        )}
      </NavHeader>

      {isDataAvailable ? (
        <>
          <FlatList
            ListHeaderComponent={
              <Typography.Text color="neutralBase+30" size="callout" weight="regular" style={headerMargin}>
                {t("Settings.TodosScreen.listHeading")}
              </Typography.Text>
            }
            contentContainerStyle={contentStyle}
            data={data?.Actions || []}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item?.ActionCode}
            renderItem={({ item }) => (
              <Stack direction="horizontal" gap="20p" align="center" style={stackPerItem}>
                {item.Subscribed ? (
                  <View style={[inCompleteItemStyle, styles.completeItemStyle]}>
                    <TickIcon color={palette["neutralBase-60"]} height={18} width={18} />
                  </View>
                ) : (
                  <View style={inCompleteItemStyle} />
                )}
                <Stack direction="vertical" gap="4p">
                  <Typography.Text size="callout" testID={`Settings.TodosScreen:${item.ActionCode}`}>
                    {item.ActionCode}
                  </Typography.Text>
                  <Typography.Text
                    color="neutralBase"
                    size="footnote"
                    weight="regular"
                    testID={`Settings.TodosScreen:${item.ActionDescription}`}>
                    {item.ActionDescription}
                  </Typography.Text>
                </Stack>
              </Stack>
            )}
          />
        </>
      ) : (
        isLoading && <Loader />
      )}

      {isDataAvailable && (
        <View style={warningBox}>
          <WarningBanner text={t("Settings.TodosScreen.error.warningBanner")} icon={<InfoFilledCircleIcon />} />
        </View>
      )}

      <NotificationModal
        variant="error"
        title={t("Settings.TodosScreen.error.title")}
        message={t("Settings.TodosScreen.error.message")}
        isVisible={isErrorModalVisible}
        buttons={{
          primary: (
            <Button onPress={handleRefetch} testID="Settings.TodosScreen.reloadbutton">
              {t("Settings.TodosScreen.error.buttonReload")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleOnGoBackPress} testID="Settings.TodosScreen.goBackButton">
              {t("Settings.TodosScreen.error.goBack")}
            </Button>
          ),
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  completeItemStyle: {
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "center",
  },
});
