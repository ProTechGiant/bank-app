import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet } from "react-native";

import { ChevronRightIcon, MobileIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CategoryListProps {
  onSelect: (value: string) => void;
  data: string[];
}
export default function CategoryList({ onSelect, data }: CategoryListProps) {
  const { t } = useTranslation();

  const listEmptyComponent = () => {
    return <Typography.Text>{t("SadadBillPayments.SelectBillerCategoryScreen.noBillerAvailableText")}</Typography.Text>;
  };
  const chevronIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  const itemStyle = useThemeStyles(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <FlatList
      data={data}
      ListEmptyComponent={listEmptyComponent}
      renderItem={({ item }) => (
        <Pressable onPress={() => onSelect(item)}>
          <Stack style={itemStyle} justify="space-between" direction="horizontal">
            <MobileIcon color={chevronIconColor} />
            <Typography.Text style={styles.listTitleText} color="neutralBase+30" size="callout" weight="regular">
              {item}
            </Typography.Text>
            <ChevronRightIcon color={chevronIconColor} />
          </Stack>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listTitleText: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
