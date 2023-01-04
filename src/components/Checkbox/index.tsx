import CheckBox from "@react-native-community/checkbox";
import { useField } from "formik";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";
import { palette, radii, spacing } from "@/theme/values";

type Props = {
  name: string;
  border: boolean;
  title?: string;
  disabled?: boolean;
};

const Checkbox = ({ name, border, title, disabled = false }: Props) => {
  const [field, meta, helper] = useField(name);
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);

  const containerStyle = [
    styles.container,
    { borderWidth: toggleCheckBox ? 2 : 1 },
    { borderWidth: border ? 1 : 0 },
    { borderColor: toggleCheckBox ? palette.complimentBase : palette["neutralBase-20"] },
    { opacity: disabled ? 0.5 : 1 },
  ];

  return (
    <>
      <View style={containerStyle}>
        <CheckBox
          disabled={disabled}
          onFillColor={palette.complimentBase}
          onCheckColor={palette["neutralBase-50"]}
          onTintColor={palette.complimentBase}
          tintColor={palette.neutralBase}
          boxType="square"
          value={toggleCheckBox}
          style={{ marginRight: spacing.medium }}
          onValueChange={newValue => {
            setToggleCheckBox(newValue);
            helper.setValue(newValue);
          }}
        />
        <Typography.Text size="callout" weight="regular" color="tintBase+30">
          {title}
        </Typography.Text>
      </View>
    </>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: palette["neutralBase-50"],
    borderColor: palette["neutralBase-20"],
    borderRadius: radii.extraSmall,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 54,
    padding: spacing.medium,
  },
});
