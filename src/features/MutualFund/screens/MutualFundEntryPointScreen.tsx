import { useTranslation } from "react-i18next";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

// TODO:its temp for structure
export default function MutualFundEntryPointScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader title={t("MutualFund.EntryPointScreen.title")} onBackPress={handleOnBackPress} />
      <Typography.Header> Temporary screen </Typography.Header>
    </Page>
  );
}
