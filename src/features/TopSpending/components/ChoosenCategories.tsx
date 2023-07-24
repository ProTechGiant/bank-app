import { FlatList, Pressable, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { categoryIconViewBox } from "../mocks/MockData";
import IconGenerator from "./IconGenerator";

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
    marginTop: theme.spacing["8p"],
    borderRadius: theme.radii.extraSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    backgroundColor: theme.palette["primaryBase-10"],
    marginHorizontal: theme.spacing["4p"],
  }));

  const margins = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["4p"],
  }));

  const { iconColor, closeIconColor } = useThemeStyles(theme => ({
    iconColor: theme.palette["neutralBase-20"],
    closeIconColor: theme.palette["neutralBase-20"],
  }));

  const getViewBox = (iconName: string) => categoryIconViewBox[iconName as keyof typeof categoryIconViewBox];

  return (
    <FlatList
      horizontal={true}
      data={categories}
      renderItem={({ item }) => (
        <View style={cell}>
          <IconGenerator
            viewBox={getViewBox(item.categoryName)}
            path={item.iconPath?.replace('d="', "").replace('"', "")}
            color={iconColor}
            width={16}
            height={16}
          />
          <Typography.Text color="neutralBase-60" weight="medium" size="caption2" style={margins}>
            {item.categoryName}
          </Typography.Text>
          <Pressable onPress={() => handleRemoveCategory(item.categoryId)}>
            <CloseIcon width={12} height={12} color={closeIconColor} />
          </Pressable>
        </View>
      )}
      keyExtractor={item => item.categoryId.toString()}
    />
  );
}
