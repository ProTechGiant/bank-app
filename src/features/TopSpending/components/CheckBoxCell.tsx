import { Pressable, Text, View, ViewStyle } from "react-native";

import CheckBoxCheckedIcon from "@/assets/icons/CheckBoxCheckedIcon";
import CheckBoxIcon from "@/assets/icons/CheckBoxIcon";
import IconGenerator from "@/components/IconGenerator";
import { useThemeStyles } from "@/theme";

import { categoryIconViewBox } from "../mocks/MockData";

interface CategoryType {
  categoryId: number;
  categoryName: string;
  iconPath: string;
}

interface CheckBoxCellProps {
  category: CategoryType;
  choosenCategories: CategoryType[];
  handleOnUpdateCategories: (category: CategoryType, isChecked: boolean) => void;
}

export default function CheckBoxCell({ category, choosenCategories, handleOnUpdateCategories }: CheckBoxCellProps) {
  const isChecked = choosenCategories.some(chosenCategory => chosenCategory.categoryId === category.categoryId);

  const handlePress = () => {
    handleOnUpdateCategories(category, isChecked);
  };

  const radioButtonCellStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    justifyContent: "space-between",
    flexDirection: "row",
  }));
  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    marginHorizontal: theme.spacing["16p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const getViewBox = (iconName: string) => categoryIconViewBox[iconName as keyof typeof categoryIconViewBox];

  return (
    <View style={radioButtonCellStyle} key={category.categoryId}>
      <IconGenerator
        viewBox={getViewBox(category.categoryName)}
        path={category.iconPath?.replace('d="', "").replace('"', "")}
        color={iconColor}
        width={22}
        height={22}
      />
      <View style={textStyle}>
        <Text>{category.categoryName}</Text>
      </View>
      <Pressable onPress={handlePress}>{isChecked ? <CheckBoxCheckedIcon /> : <CheckBoxIcon />}</Pressable>
    </View>
  );
}
