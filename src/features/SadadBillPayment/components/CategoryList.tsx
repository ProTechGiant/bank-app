import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, View } from "react-native";

import Typography from "@/components/Typography";

import { Biller, BillerCategory } from "../types";
import ListItem from "./ListItem";

interface CategoryListProps {
  onSelect: (value: BillerCategory | Biller) => void;
  data?: Array<BillerCategory | Biller>;
  onEndReached: () => void;
  isFetching?: boolean;
}
export default function CategoryList({ data, onSelect, onEndReached, isFetching = false }: CategoryListProps) {
  const { t } = useTranslation();

  const listEmptyComponent = () => {
    return <Typography.Text>{t("SadadBillPayments.SelectBillerCategoryScreen.noBillerAvailableText")}</Typography.Text>;
  };

  const listFetchMoreDataLoader = () => {
    return (
      <View>
        <ActivityIndicator animating={isFetching} hidesWhenStopped={true} />
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      ListEmptyComponent={listEmptyComponent}
      ListFooterComponent={listFetchMoreDataLoader}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <ListItem onSelect={onSelect} data={item} />}
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
    />
  );
}
