import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { LatestGoalTransactionItem } from "../components";
import { GoalGetterStackParams } from "../GoalGetterStack";

export default function LatestTransactionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.LatestTransactionsScreen">>();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader onBackPress={handleOnBackPress} />

      <ContentContainer isScrollView>
        <Typography.Text color="neutralBase+30" size="title1" weight="medium">
          {t("GoalGetter.LatestTransactionScreen.title")}
        </Typography.Text>
        {/* TODO - this code here (Stack) will change after get idea what we should do here from the designer */}
        <Stack direction="horizontal" justify="space-between" style={stackStyle}>
          <Typography.Text color="neutralBase-10" size="callout" weight="medium">
            Today
          </Typography.Text>

          <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
            + 1,500.00
          </Typography.Text>
        </Stack>

        {params.transactions
          ? params.transactions.map((transaction, index) => {
              return (
                <LatestGoalTransactionItem
                  key={`${transaction.Title}-${index}`}
                  title={transaction.Title}
                  amount={transaction.Amount}
                  subTitle={transaction.Date}
                  status={transaction.Status}
                />
              );
            })
          : null}
      </ContentContainer>
    </Page>
  );
}
