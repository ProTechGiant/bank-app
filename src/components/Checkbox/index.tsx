import CheckBox from "@react-native-community/checkbox";
import { useField } from "formik";
import { useState } from "react";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

type Props = {
  name: string;
  border: boolean;
  title?: string;
  disabled?: boolean;
};

const Checkbox = ({ name, border, title, disabled = false }: Props) => {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["neutralBase-50"],
      borderColor: theme.palette["neutralBase-20"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: 1,
      padding: theme.spacing.medium,
      flexDirection: "row",
      minHeight: 54,
    }),
    []
  );
  const checkBoxStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginRight: theme.spacing.medium,
    }),
    []
  );
  const boxCheckedStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette["complimentBase"],
    }),
    []
  );
  const boxUncheckedStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette["neutralBase-20"],
    }),
    []
  );
  const onFillColor = useThemeStyles<string>(theme => theme.palette["complimentBase"], []);
  const onCheckColor = useThemeStyles<string>(theme => theme.palette["neutralBase-50"], []);
  const onTintColor = useThemeStyles<string>(theme => theme.palette["complimentBase"], []);
  const tintColor = useThemeStyles<string>(theme => theme.palette["neutralBase"], []);

  const [field, meta, helper] = useField(name);
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);

  const containerStyle = [
    container,
    { borderWidth: toggleCheckBox ? 2 : 1 },
    { borderWidth: border ? 1 : 0 },
    { borderColor: toggleCheckBox ? boxCheckedStyle : boxUncheckedStyle },
    { opacity: disabled ? 0.5 : 1 },
  ];

  return (
    <>
      <View style={containerStyle}>
        <CheckBox
          disabled={disabled}
          onFillColor={onFillColor}
          onCheckColor={onCheckColor}
          onTintColor={onTintColor}
          tintColor={tintColor}
          boxType="square"
          value={toggleCheckBox}
          style={checkBoxStyle}
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
