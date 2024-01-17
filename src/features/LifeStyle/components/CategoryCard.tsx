import React from "react";
import { Pressable, View, ViewStyle } from "react-native";

import SvgIcon from "@/components/SvgIcon/SvgIcon";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface Category {
  CategoryId: string;
  CategoryName: string;
  CategoryDescription: string;
  ImageUrl: string;
}

interface CardProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
}

export default function CategoryCard({ category, isSelected, onSelect }: CardProps) {
  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    width: "30%",
    flexDirection: "column",
    borderRadius: theme.radii.regular,
    marginVertical: theme.spacing["8p"],
    marginHorizontal: theme.spacing["8p"],
    height: 110,
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["8p"],
  }));

  const selectedCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.complimentBase,
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["12p"],
    marginTop: theme.spacing["4p"],
  }));

  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
    justifyContent: "flex-end",
    flex: 1,
    marginBottom: theme.spacing["4p"],
  }));

  return (
    <Pressable style={[cardContainerStyle, isSelected && selectedCardStyle]} onPress={onSelect}>
      <View style={iconContainerStyle}>
        {category.ImageUrl ? (
          <SvgIcon uri={category.ImageUrl} width={24} height={24} color={isSelected ? "#FAFAFA" : "#FF371E"} />
        ) : null}
      </View>
      <View style={textStyle}>
        <Typography.Text color={isSelected ? "neutralBase-60" : "neutralBase+30"} size="footnote" weight="regular">
          {category.CategoryName}
        </Typography.Text>
      </View>
    </Pressable>
  );
}
