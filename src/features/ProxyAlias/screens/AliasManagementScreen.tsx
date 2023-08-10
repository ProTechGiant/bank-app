import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { AliasManagementWrapper, Confirmation } from "../components";

export default function AliasManagementScreen() {
  const navigation = useNavigation();

  //TODO : removed when API is ready
  const isNotRegistered = false;
  const handleOnBackPress = () => {
    navigation.goBack();
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader title="Alias Management" onBackPress={handleOnBackPress} />

      <ContentContainer>
        {/*TODO: when i connect to api i will render this component conditionally */}
        {isNotRegistered ? <Confirmation /> : <AliasManagementWrapper />}
      </ContentContainer>
    </Page>
  );
}
