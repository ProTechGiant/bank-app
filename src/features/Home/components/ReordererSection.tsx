import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ReordererSectionProps {
  children: React.ReactNode;
  count?: number;
  max?: number;
  title: string;
}

export default function ReordererSection({ children, count, max, title }: ReordererSectionProps) {
  const sectionHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing["12p"] / 2,
    marginBottom: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <View>
      <View style={sectionHeaderStyle}>
        <Typography.Text color="primaryBase-20" size="caption1" weight="medium">
          {title}
        </Typography.Text>
        {undefined !== count && undefined !== max ? (
          <Typography.Text color="primaryBase-20" size="caption1" weight="medium">
            {count + "/" + max}
          </Typography.Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}
