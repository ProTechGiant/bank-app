import { Pressable, View, ViewStyle } from "react-native";

import { EditIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface EditInputProps {
  isHideTextInput?: boolean;
  name: string;
  value: string | number;
  isEditable: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
}

export default function EditInput({ name, value, isEditable, children, onPress, isHideTextInput }: EditInputProps) {
  const readOnlyStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["12p"],
    backgroundColor: theme.palette["neutralBase-40"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: theme.radii.small,
  }));

  const editIconColor = useThemeStyles(theme => theme.palette.primaryBase);

  return (
    <>
      {!isHideTextInput ? (
        <View style={readOnlyStyle}>
          <View>
            <Typography.Text color="neutralBase-20" size="caption2">
              {name}
            </Typography.Text>
            <Typography.Text color="neutralBase-20" size="callout">
              {value}
            </Typography.Text>
          </View>
          {isEditable ? (
            <Pressable onPress={onPress}>
              <EditIcon width={24} height={24} color={editIconColor} />
            </Pressable>
          ) : null}
        </View>
      ) : (
        children
      )}
    </>
  );
}
