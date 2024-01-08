import { FlatList, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Stack } from "@/components";
import IconGenerator from "@/components/IconGenerator";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { categoryIconViewBox } from "../mocks/MockData";

interface ChoosenCategoriesProps {
  categories: CategoryType[];
  handleRemoveCategory: (categoryId: number) => void;
}
interface CategoryType {
  categoryId: number;
  categoryName: string;
  iconPath: string;
}

export default function ChoosenCategories({ categories, handleRemoveCategory }: ChoosenCategoriesProps) {
  const cell = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
    marginBottom: theme.spacing["12p"],
    height: 32,
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["8p"],
    marginHorizontal: theme.spacing["4p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase+30"],
  }));

  const margins = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["4p"],
  }));

  const { iconColor, closeIconColor } = useThemeStyles(theme => ({
    iconColor: theme.palette["neutralBase+30"],
    closeIconColor: theme.palette["neutralBase+30"],
  }));

  const getViewBox = (iconName: string) => categoryIconViewBox[iconName as keyof typeof categoryIconViewBox];

  return (
    <View style={styles.flatListViewStyle}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={categories}
        renderItem={({ item }) => (
          <Stack direction="horizontal" gap="8p" style={cell}>
            <IconGenerator
              viewBox={getViewBox(item.categoryName)}
              path={item.iconPath?.replace('d="', "").replace('"', "")}
              color={iconColor}
              width={16}
              height={16}
            />
            <Typography.Text color="neutralBase+30" weight="medium" size="caption1" style={margins}>
              {item.categoryName}
            </Typography.Text>
            <Pressable onPress={() => handleRemoveCategory(item.categoryId)}>
              <CloseIcon width={12} height={12} color={closeIconColor} />
            </Pressable>
          </Stack>
        )}
        keyExtractor={item => item.categoryId.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flatListViewStyle: { height: "18%" },
});
