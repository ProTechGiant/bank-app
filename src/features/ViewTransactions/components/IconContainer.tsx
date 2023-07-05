import React from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { Path, Svg } from "react-native-svg";

import { WithShadow } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

type IconContainerProps = {
  path: string;
  name: string;
  selected: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
};

const IconContainer = ({ path, name, selected, onPress, containerStyle }: IconContainerProps) => {
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

  const categoryIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  const categoryTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["10p"],
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing["10p"],
  }));

  const iconWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    height: 56,
  }));

  const selectedIconWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    borderRadius: theme.radii.xxlarge,
  }));

  const selectedIconStyle = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  const renderIcon = () => (
    <View style={[iconWrapperStyle, selected ? selectedIconWrapperStyle : null]}>
      <Svg
        width={25}
        height={25}
        viewBox={getViewBox(name)}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path d={path} fill={selected ? selectedIconStyle : categoryIconColor} />
      </Svg>
    </View>
  );

  return (
    <Pressable style={[iconContainerStyle, containerStyle]} onPress={onPress}>
      {selected ? (
        <WithShadow backgroundColor="neutralBase-50" borderRadius="xxlarge">
          {renderIcon()}
        </WithShadow>
      ) : (
        renderIcon()
      )}
      <Typography.Text style={categoryTextStyle} size="caption1" weight="regular">
        {name}
      </Typography.Text>
    </Pressable>
  );
};

export default IconContainer;
