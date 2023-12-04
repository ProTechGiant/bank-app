import { ActivityIndicator } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { AliasManagementWrapper } from "../components";
import { useGetUserProxies } from "../hooks/query-hooks";
import { userProxiesMocks } from "../mocks";

export default function AliasManagementScreen() {
  const navigation = useNavigation();

  const { data = userProxiesMocks, isFetching, isError } = useGetUserProxies();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader title="Alias Management" onBackPress={handleOnBackPress} />

      <ContentContainer isScrollView alwaysBounceVertical={true}>
        {isFetching ? (
          <ActivityIndicator />
        ) : data?.UserProxies && !isError ? (
          <AliasManagementWrapper data={data} />
        ) : (
          <AliasManagementWrapper data={data} />
        )}
      </ContentContainer>
    </Page>
  );
}
