import { ActivityIndicator, StatusBar } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AliasManagementWrapper, Confirmation } from "../components";
import { useGetUserProxies } from "../hooks/query-hooks";

export default function AliasManagementScreen() {
  const navigation = useNavigation();

  const { data, isFetching, isError } = useGetUserProxies();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const whiteColor = useThemeStyles<string>(theme => theme.palette.transparent);
  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader title="Alias Management" onBackPress={handleOnBackPress} />
      <StatusBar barStyle="dark-content" backgroundColor={whiteColor} />
      <ContentContainer isScrollView alwaysBounceVertical={true}>
        {isFetching ? (
          <ActivityIndicator />
        ) : data?.UserProxies && !isError ? (
          <AliasManagementWrapper data={data} />
        ) : (
          <Confirmation />
        )}
      </ContentContainer>
    </Page>
  );
}
