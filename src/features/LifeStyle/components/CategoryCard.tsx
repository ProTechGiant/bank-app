import React from "react";
import { Pressable, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import * as Icons from "../assets/icon/index";

interface CardProps {
  title: string;
  description: string;
  onSelect: () => void;
  isSelected: boolean;
  iconName: string;
}

const iconComponents = [
  { name: "ArrowBack", component: Icons.ArrowBackIcon },
  { name: "Coffee", component: Icons.CoffeeIcon },
  { name: "Eating Out", component: Icons.EatingOutIcon },
  { name: "Education", component: Icons.EducationIcon },
  { name: "Events", component: Icons.EventsIcon },
  { name: "Fashion", component: Icons.FashionIcon },
  { name: "Gaming", component: Icons.GamingIcon },
  { name: "Movies", component: Icons.MoviesIcon },
  { name: "Music", component: Icons.MusicIcon },
  { name: "Photography", component: Icons.PhotographyIcon },
  { name: "Shopping", component: Icons.ShoppingIcon },
  { name: "Sport", component: Icons.SportIcon },
  { name: "Travel", component: Icons.TravelIcon },
];

export default function CategoryCard({ title, onSelect, isSelected, iconName }: CardProps) {
  const selectedIcon = iconComponents.find(icon => icon.name === iconName);
  const IconComponent = selectedIcon?.component || Icons.DefaultIcon;

  const selectedIconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);
  const unselectedIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.spacing["4p"],
    flexDirection: "column",
    paddingHorizontal: theme.spacing["8p"],
    marginVertical: theme.spacing["8p"],
    width: "30%",
  }));

  const selectedCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.complimentBase,
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["12p"],
    marginTop: theme.spacing["4p"],
  }));

  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["48p"],
  }));

  return (
    <Pressable style={[cardContainerStyle, isSelected && selectedCardStyle]} onPress={onSelect}>
      <View style={iconContainerStyle}>
        <IconComponent width={24} height={24} color={isSelected ? selectedIconColor : unselectedIconColor} />
      </View>
      <View style={textStyle}>
        <Typography.Text color={isSelected ? "neutralBase-60" : "neutralBase+30"} size="footnote" weight="regular">
          {title}
        </Typography.Text>
      </View>
    </Pressable>
  );
}
