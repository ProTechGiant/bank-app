import { ActivityIndicator } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { AliasManagementWrapper, Confirmation } from "../components";
import { useGetUserProxies } from "../hooks/query-hooks";

export default function AliasManagementScreen() {
  const navigation = useNavigation();

  const { data, isLoading } = useGetUserProxies();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader title="Alias Management" onBackPress={handleOnBackPress} />

      <ContentContainer isScrollView alwaysBounceVertical={true}>
        {isLoading ? (
          <ActivityIndicator />
        ) : data?.UserProxies ? (
          <AliasManagementWrapper data={data} />
        ) : (
          <Confirmation />
        )}
      </ContentContainer>
    </Page>
  );
}
