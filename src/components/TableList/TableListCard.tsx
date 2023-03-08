import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";

import { Chevron, Copy, Label, TableListDate, TableListToggle } from "./EndComponents";
import TableListContainer from "./ListContainer";
import { styles } from "./Styles";

export interface TableListProps {
  label?: string;
  helperText?: string;
  onInfoPress?: () => void;
  onChevronPress?: () => void;
  onCopyPress?: () => void;
  isTransparent?: boolean;
  end?: React.ReactNode;
  icon?: React.ReactElement<SvgProps | IconProps>;
  position?: "alone" | "first" | "last" | "middle";
  onPress?: () => void;
}

TableListCard.Copy = Copy;
TableListCard.Chevron = Chevron;
TableListCard.Label = Label;
TableListCard.Date = TableListDate;
TableListCard.Toggle = TableListToggle;

export default function TableListCard({
  helperText,
  label,
  onInfoPress,
  onChevronPress,
  icon,
  isTransparent,
  position = "alone",
  end,
}: TableListProps) {
  return (
    <TableListContainer
      position={position}
      icon={icon}
      isTransparent={isTransparent}
      helperText={helperText}
      label={label}
      onInfoPress={onInfoPress}
      onPress={onChevronPress}>
      <View style={styles.rightComponent}>{end}</View>
    </TableListContainer>
  );
}
