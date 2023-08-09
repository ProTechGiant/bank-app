import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";

import Typography from "@/components/Typography";

import { Biller, BillerCategory } from "../types";
import ListItem from "./ListItem";

interface CategoryListProps {
  onSelect: (value: BillerCategory | Biller) => void;
  data?: Array<BillerCategory | Biller>;
}
export default function CategoryList({ data, onSelect }: CategoryListProps) {
  const { t } = useTranslation();

  const listEmptyComponent = () => {
    return <Typography.Text>{t("SadadBillPayments.SelectBillerCategoryScreen.noBillerAvailableText")}</Typography.Text>;
  };

  return (
    <FlatList
      data={data}
      ListEmptyComponent={listEmptyComponent}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <ListItem onSelect={onSelect} data={item} />}
    />
  );
}
