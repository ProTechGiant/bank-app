import React from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { Path, Svg } from "react-native-svg";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

type IconContainerProps = {
  path: string;
  name: string;
  selected: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
};

export default function IconContainer({ path, name, selected, onPress, containerStyle, testID }: IconContainerProps) {
  const viewBoxMap = {
    General: "0 0 19 22",
    Transfer: "0 0 19 22",
    Round_Up: "0 0 19 22",
    Groceries: "0 0 19 22",
    Shopping: "0 0 19 22",
    Gift: "0 0 19 22",
    "Utility Bills": "0 0 19 22",
    "Food and Drinks": "18 18 20 20",
    Travel: "18 18 20 20",
    Entertainment: "18 18 20 20",
    "Health Care": "18 18 20 20",
    // We will add more categories as needed
  };

  const getViewBox = (iconName: string) => viewBoxMap[iconName as keyof typeof viewBoxMap];

  const categoryTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing["12p"],
  }));

  const iconWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    backgroundColor: theme.palette.primaryBase,
    borderRadius: theme.radii.medium,
    height: 56,
  }));

  const selectedIconWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+20"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  const renderIcon = () => (
    <View style={[iconWrapperStyle, selected ? selectedIconWrapperStyle : null]}>
      <Svg
        width={25}
        height={25}
        viewBox={getViewBox(name)}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path d={path} fill={iconColor} />
      </Svg>
    </View>
  );

  return (
    <Pressable style={[iconContainerStyle, containerStyle]} onPress={onPress} testID={testID}>
      {renderIcon()}
      <Typography.Text style={categoryTextStyle} size="caption1" weight="regular">
        {name}
      </Typography.Text>
    </Pressable>
  );
}
