import { useState } from "react";
import { Keyboard, StyleSheet, TextInput, View } from "react-native";

import { palette, radii, spacing, typography } from "@/theme/values";
import Typography from "../Typography";
import { useField } from "formik";

type Props = {
  name: string;
  placeholder: string;
  label: string;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
};

const TextField = ({ name, placeholder, label, keyboardType = "default" }: Props) => {
  const [field, meta, helper] = useField(name);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = meta.error && meta.touched;

  let viewStyle;

  if (isFocused) {
    viewStyle = [{ borderColor: palette.complimentBase, borderWidth: 2 }];
  }
  if (hasError) {
    viewStyle = { borderWidth: 2, backgroundColor: palette["errorBase-40"], borderColor: palette["errorBase-10"] };
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    field.onBlur(name);
    helper.setTouched(true);
    setIsFocused(false);
    Keyboard.dismiss();
  };

  return (
    <>
      <View>
        {label && (
          <Typography.Text
            size="callout"
            weight="medium"
            color={hasError ? "errorBase" : "neutralBase+30"}
            style={styles.label}>
            {label}
          </Typography.Text>
        )}
        <View style={[styles.innerView, viewStyle]}>
          <TextInput
            style={styles.text}
            placeholder={placeholder}
            onChangeText={text => helper.setValue(text)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            autoCapitalize="none"
            autoCorrect={false}
            value={field.value}
            name={field.name}
            keyboardType={keyboardType}
          />
        </View>
        {hasError && (
          <Typography.Text color="errorBase" size="caption1" weight="regular">
            {meta.error}
          </Typography.Text>
        )}
      </View>
    </>
  );
};

export default TextField;

const styles = StyleSheet.create({
  innerView: {
    alignItems: "center",
    backgroundColor: palette["neutralBase-50"],
    borderColor: palette["neutralBase-20"],
    borderRadius: radii.extraSmall,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    minHeight: 54,
  },
  label: {
    marginBottom: spacing.small,
  },
  text: {
    fontSize: typography.text.sizes.callout,
    fontWeight: typography.text.weights.regular,
    lineHeight: typography.text._lineHeights.callout,
    width: "100%",
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
});
