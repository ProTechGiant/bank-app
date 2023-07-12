/* eslint-disable react/no-unstable-nested-components */
import React, { Dispatch, SetStateAction } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { FaceIdIcon, RemoveIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface NumberPadProps {
  passcode: string;
  setPasscode: Dispatch<SetStateAction<string>> | ((passcode: string) => void);
  isBiomatric?: boolean;
  handleBioMatric?: () => void;
}
interface ButtonInterface {
  children: string | number | JSX.Element;
  index: number;
}
const NumberPad = ({ passcode, setPasscode, isBiomatric, handleBioMatric }: NumberPadProps) => {
  const handleNumberPress = (number: string) => {
    if (passcode.length < 6) {
      const password = passcode + number;
      setPasscode(password);
    }
  };

  const handleRemove = () => {
    setPasscode(passcode.slice(0, passcode.length - 1));
  };

  const button = useThemeStyles<ViewStyle>(theme => ({
    width: 80,
    height: 80,
    marginHorizontal: theme.spacing["16p"],
    marginVertical: theme.spacing["4p"],
    borderRadius: theme.radii.xxlarge,
    justifyContent: "center",
    alignItems: "center",
  }));

  const Button = ({ children, index }: ButtonInterface) => {
    return (
      <Pressable
        style={button}
        disabled={index === 9 && !isBiomatric}
        onPress={() => {
          index === 11
            ? handleRemove()
            : index === 9
            ? !!isBiomatric && handleBioMatric && handleBioMatric()
            : typeof children === "string" && handleNumberPress(children);
        }}>
        <Typography.Text size="title1" color="primaryBase">
          {children}
        </Typography.Text>
      </Pressable>
    );
  };

  const NumPad = () => {
    return (
      <View style={styles.rowStyle}>
        {[
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          isBiomatric ? <FaceIdIcon color="#080E53" /> : "",
          "0",
          <RemoveIcon />,
        ].map((value, index) => {
          return (
            <Button key={index} index={index}>
              {value}
            </Button>
          );
        })}
      </View>
    );
  };

  return <NumPad />;
};

export default NumberPad;

const styles = StyleSheet.create({
  rowStyle: {
    bottom: 80,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    position: "absolute",
  },
});
