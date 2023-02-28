import { useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";

import { AngleDownIcon, AngleUpIcon, InfoCircleIcon } from "@/assets/icons";
import { GreyGradient } from "@/components/LinearGradients/GradientButtons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface MoreInfoDropdownProps {
  children: JSX.Element | JSX.Element[];
  title: string;
}

export default function MoreInfoDropdown({ children, title }: MoreInfoDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
    overflow: "hidden",
    width: "100%",
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["32p"],
    paddingVertical: theme.spacing["16p"],
  }));

  const pressableContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  }));

  const toggleIconStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.iconDimensions.accordian,
    width: theme.iconDimensions.accordian,
    justifyContent: "center",
    alignItems: "flex-end",
  }));

  const titleStyles = useThemeStyles<ViewStyle>(theme => ({
    flexGrow: 1,
    marginHorizontal: theme.spacing["8p"],
  }));

  return (
    <Pressable onPress={() => setIsExpanded(c => !c)} style={containerStyle}>
      <GreyGradient>
        <View style={pressableContainerStyle}>
          <InfoCircleIcon />
          <Typography.Text color="primaryBase" weight="semiBold" size="callout" style={titleStyles}>
            {title}
          </Typography.Text>
          <View style={toggleIconStyle}>{isExpanded ? <AngleUpIcon /> : <AngleDownIcon />}</View>
        </View>
      </GreyGradient>
      {isExpanded && <View style={contentStyle}>{children}</View>}
    </Pressable>
  );
}
