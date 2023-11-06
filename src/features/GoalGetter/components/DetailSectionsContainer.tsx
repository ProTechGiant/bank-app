import { ReactNode } from "react";
import { I18nManager, Pressable, ViewStyle } from "react-native";

import PenIcon from "@/assets/icons/PenIcon";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

interface DetailSectionsContainerProps {
  children: ReactNode;
  showEditIcon?: boolean;
  onPress?: () => void;
}

export default function DetailSectionsContainer({ children, showEditIcon, onPress }: DetailSectionsContainerProps) {
  const detailSectionsContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    padding: theme.spacing["16p"],
  }));

  const editIconStyles = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    alignSelf: "flex-end",
    padding: theme.spacing["16p"],
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }));

  return (
    <Stack direction="vertical" gap="16p" style={detailSectionsContainerStyles}>
      {showEditIcon ? (
        <Pressable onPress={onPress} style={editIconStyles}>
          <PenIcon />
        </Pressable>
      ) : null}
      {children}
    </Stack>
  );
}
