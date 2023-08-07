import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { AliasManagementWrapper, Confirmation } from "../components";

export default function AliasManagementScreen() {
  const navigation = useNavigation();
  const handleOnBackPress = () => {
    navigation.goBack();
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader title="Alias Management" onBackPress={handleOnBackPress} />

      <ContentContainer>
        <Confirmation />
        <AliasManagementWrapper />
      </ContentContainer>
    </Page>
  );
}
