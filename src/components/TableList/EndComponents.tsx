import { format as formatFn } from "date-fns";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, View, ViewStyle } from "react-native";

import { ChevronRightIcon, CopyIcon } from "@/assets/icons";
import { CalendarAltIcon } from "@/assets/icons";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useInfoStyles } from "./styling";

interface CopyProps {
  onPress: () => void;
}

interface ToggleProps {
  disabled?: boolean;
  onPress: () => void;
  value: boolean;
}

const Chevron = () => {
  const { infoColor } = useInfoStyles();

  return (
    <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
      <ChevronRightIcon color={infoColor} />
    </View>
  );
};

const Copy = ({ onPress }: CopyProps) => {
  const { iconColor } = useInfoStyles();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: 34,
    padding: theme.spacing["10p"],
  }));

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <CopyIcon color={iconColor} height={16} width={16} />
    </Pressable>
  );
};

const Label = ({ bold = false, children }: { bold?: boolean; children: React.ReactNode }) => {
  return (
    <Typography.Text
      color={bold ? "primaryBase-40" : "neutralBase"}
      size="callout"
      weight={bold ? "semiBold" : "regular"}>
      {children}
    </Typography.Text>
  );
};

const TableListDate = ({
  placeholder,
  format,
  value,
}: {
  placeholder?: string;
  format: string;
  value: Date | undefined;
}) => {
  const { iconColor } = useInfoStyles();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    columnGap: theme.spacing["8p"],
  }));

  return (
    <View style={containerStyle}>
      <CalendarAltIcon color={iconColor} />
      <Label bold>{undefined !== value ? formatFn(value, format) : placeholder}</Label>
    </View>
  );
};

const TableListDay = ({ placeholder, value }: { placeholder?: string; value: number | undefined }) => {
  const { t } = useTranslation();
  const { iconColor } = useInfoStyles();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    columnGap: theme.spacing["8p"],
  }));

  return (
    <View style={containerStyle}>
      <CalendarAltIcon color={iconColor} />
      <Label bold>
        {undefined !== value ? t("DayPicker.currentlyOnDay", { count: value, ordinal: true }) : placeholder}
      </Label>
    </View>
  );
};

const TableListToggle = ({ disabled = false, onPress, value }: ToggleProps) => {
  return <Toggle disabled={disabled} onPress={onPress} value={value} />;
};

export { Chevron, Copy, Label, TableListDate, TableListDay, TableListToggle };
