import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Chip from "@/components/Chip";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

import { FilterItemType } from "../types";

interface FilterTopBarProps {
  whatsNextTypes: FilterItemType[];
  whatsNextCategories: FilterItemType[];
  onTypeFilterItemRemovePress: (name: string) => void;
  onCategoryFilterItemRemovePress: (name: string) => void;
  onClearFiltersPress: () => void;
}

export default function FilterTopBar({
  whatsNextTypes,
  whatsNextCategories,
  onTypeFilterItemRemovePress,
  onCategoryFilterItemRemovePress,
  onClearFiltersPress,
}: FilterTopBarProps) {
  const { t } = useTranslation();

  return (
    <View>
      <Stack direction="horizontal" gap="8p" style={styles.center}>
        <Typography.Text color="neutralBase-10" size="footnote">
          {t("WhatsNext.HubScreen.filterBy")}
        </Typography.Text>
        <ScrollView horizontal>
          <Stack direction="horizontal" gap="8p">
            {whatsNextTypes
              .filter(val => val.isActive === true)
              .map(data => {
                return (
                  <View key={data.id}>
                    <Chip
                      title={data.name}
                      isSelected={true}
                      isRemovable={true}
                      onPress={() => {
                        onTypeFilterItemRemovePress(data.name);
                      }}
                    />
                  </View>
                );
              })}
            {whatsNextCategories
              .filter(val => val.isActive === true)
              .map(data => {
                return (
                  <View key={data.id}>
                    <Chip
                      title={data.name}
                      isSelected={true}
                      isRemovable={true}
                      onPress={() => onCategoryFilterItemRemovePress(data.name)}
                    />
                  </View>
                );
              })}
          </Stack>
        </ScrollView>

        <Pressable onPress={onClearFiltersPress}>
          <Typography.Text size="footnote">{t("WhatsNext.HubScreen.clearAll")}</Typography.Text>
        </Pressable>
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
  },
});
