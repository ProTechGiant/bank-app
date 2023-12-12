import { StyleSheet, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

export default function FieldComponent({ title, value }: { title: string; value: string | undefined }) {
  const fieldContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["16p"],
    width: "100%",
    flexWrap: "wrap",
  }));
  return (
    <>
      {value !== undefined && value !== "" ? (
        <Stack direction="horizontal" style={[fieldContainerStyle, styles.topBorderNoRadius]} justify="space-between">
          <Typography.Text color="neutralBase">{title}</Typography.Text>
          <Typography.Text weight="bold">{value}</Typography.Text>
        </Stack>
      ) : null}
    </>
  );
}
const styles = StyleSheet.create({
  topBorderNoRadius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
