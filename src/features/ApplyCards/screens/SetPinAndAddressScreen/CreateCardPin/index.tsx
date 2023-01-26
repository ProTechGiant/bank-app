import { times } from "lodash";
import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

import { ErrorBlackIcon, InfoIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CreateCardPinProps {
  title: string;
  inputValue: string;
  isValid: boolean;
  remainingTries: number;
  mode: "input" | "confirm";
  pinInputLength: number;
  pinMaxTries: number;
  showErrorBox?: boolean;
  onSetNewPin?: () => void;
  onBoxPress?: () => void;
}

export default function CreateCardPin({
  title,
  inputValue,
  isValid,
  remainingTries,
  mode,
  pinInputLength,
  pinMaxTries,
  showErrorBox,
  onSetNewPin,
  onBoxPress,
}: CreateCardPinProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      paddingVertical: theme.spacing.large,
      marginBottom: 135,
    }),
    []
  );
  const inputBoxStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["neutralBase-50"],
      borderColor: theme.palette["neutralBase-20"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: 1,
      height: 60,
      justifyContent: "center",
      marginHorizontal: theme.spacing.small,
      width: 50,
    }),
    []
  );
  const highlightedBoxStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette.complimentBase,
      borderWidth: 2,
    }),
    []
  );
  const inputDotStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase+30"],
      borderRadius: 8,
      height: 10,
      width: 10,
    }),
    []
  );
  const errorBoxStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["errorBase-30"],
      borderColor: theme.palette.errorBase,
      borderWidth: 2,
    }),
    []
  );
  const infoContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["tintBase-30"],
      borderRadius: theme.radii.extraSmall,
      flexDirection: "row",
      padding: theme.spacing.large,
    }),
    []
  );
  const infoContainerInvalidStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["errorBase-40"],
    }),
    []
  );
  const infoTextStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing.medium,
      alignSelf: "flex-start",
    }),
    []
  );
  const errorContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["errorBase-40"],
      flexDirection: "row",
      justifyContent: "space-between",
      padding: theme.spacing.large,
    }),
    []
  );
  const buttonStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["errorBase-20"],
      borderRadius: theme.radii.xlarge,
      justifyContent: "center",
      minHeight: 40,
      minWidth: 100,
      padding: theme.spacing.small,
    }),
    []
  );

  useEffect(() => {
    setBoxDisplay(inputValue.substring(inputValue.length - 1));
    setTimeout(() => {
      setBoxDisplay("dot");
    }, 600);
  }, [inputValue]);

  const [boxDisplay, setBoxDisplay] = React.useState("");

  const { t } = useTranslation();

  const inputToDotOrDigit = (value: string, i: number) => {
    const emptyInput = " ";
    const input = value[i] || emptyInput;
    const isCurrentInput = i === value.length - 1;
    const isLastInput = i === pinInputLength - 1;

    if (isCurrentInput && !isLastInput) {
      if (boxDisplay === "dot") {
        return <View style={inputDotStyle} />;
      }
      return <Text>{boxDisplay}</Text>;
    } else if (input !== emptyInput) {
      return <View style={inputDotStyle} />;
    } else {
      return <View />;
    }
  };

  return (
    <ContentContainer>
      <View style={styles.headerText}>
        <Typography.Text size="large" weight="bold">
          {title}
        </Typography.Text>
      </View>
      <Pressable style={container} onPress={onBoxPress}>
        {times(pinInputLength, i => (
          <View
            key={i}
            style={[inputBoxStyle, i === inputValue.length && highlightedBoxStyle, !isValid && errorBoxStyle]}>
            {inputToDotOrDigit(inputValue, i)}
          </View>
        ))}
      </Pressable>
      {mode === "input" && (
        <View style={infoContainerStyle}>
          <InfoIcon />
          <View style={infoTextStyle}>
            <Typography.Text size="callout">
              {t("ApplyCards.SetPinAndAddressScreen.SetPin.avoidSimplePin")}
            </Typography.Text>
          </View>
        </View>
      )}

      {mode === "confirm" && remainingTries < pinMaxTries && showErrorBox && (
        <>
          {remainingTries > 0 ? (
            <View style={[infoContainerStyle, infoContainerInvalidStyle]}>
              <ErrorBlackIcon />
              <View style={infoTextStyle}>
                <Typography.Text size="callout">
                  {t("ApplyCards.SetPinAndAddressScreen.ConfirmPin.pinNotMatch", { count: remainingTries })}
                </Typography.Text>
              </View>
            </View>
          ) : (
            <View style={errorContainerStyle}>
              <ErrorBlackIcon />
              <View>
                <Typography.Text size="callout">
                  {t("ApplyCards.SetPinAndAddressScreen.ConfirmPin.tooManyTries")}
                </Typography.Text>
              </View>
              <View style={buttonStyle}>
                <Pressable onPress={onSetNewPin}>
                  <Typography.Text size="footnote" weight="medium">
                    {t("ApplyCards.SetPinAndAddressScreen.ConfirmPin.button")}
                  </Typography.Text>
                </Pressable>
              </View>
            </View>
          )}
        </>
      )}
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  headerText: {
    alignItems: "center",
  },
});
