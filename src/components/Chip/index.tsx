import { cloneElement } from "react";
import { Pressable, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg/lib/typescript/ReactNativeSVG";

import { CloseIcon, IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ChipProps {
  title: string;
  isClosable: boolean;
  isEnabled: boolean;
  onPress: () => void;
  leftIcon?: React.ReactElement<SvgProps | IconProps>;
}

export default function Chip({ title, isClosable, isEnabled, onPress, leftIcon }: ChipProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: isEnabled ? theme.palette["neutralBase-40"] : undefined,
      borderRadius: theme.radii.xlarge,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      borderColor: isEnabled ? theme.palette.primaryBase : theme.palette["neutralBase-30"],
      borderWidth: 2,
      flexDirection: "row",
      gap: theme.spacing["8p"],
    }),
    [isEnabled]
  );

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  const iconDimension = useThemeStyles<number>(theme => theme.iconDimensions.chipComponent);

  return (
    <Pressable style={containerStyle} onPress={onPress}>
      {leftIcon ? (
        <>
          {cloneElement(leftIcon, {
            height: iconDimension,
            width: iconDimension,
            color: iconColor,
          })}
        </>
      ) : null}
      <Typography.Text size="footnote">{title}</Typography.Text>
      {isClosable ? <CloseIcon width={iconDimension} height={iconDimension} /> : null}
    </Pressable>
  );
}
