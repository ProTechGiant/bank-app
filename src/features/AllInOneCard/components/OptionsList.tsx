import React from "react";
import { Image, Pressable, StyleSheet, ViewStyle } from "react-native";

import Radio from "@/components/Radio";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { CashbackIcon } from "../assets/icons";
import mokafaaIcon from "../assets/MokafaaIcon.png";
import { RewardsMethods } from "../types";

interface OptionsListProps {
  optionsList: RewardsMethods[];
  onSelectOptions: (value: number) => void;
  predefinedValue: number;
}

export default function OptionsList({ optionsList, onSelectOptions, predefinedValue }: OptionsListProps) {
  const selectionCardStackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["16p"],
    borderRadius: theme.spacing["8p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
  }));
  return (
    <>
      {optionsList.map((predefinedElement: RewardsMethods) => {
        const backgroundColor = predefinedElement.Id === predefinedValue ? "#F2F2F2" : "transparent";
        return (
          <Pressable onPress={() => onSelectOptions(predefinedElement.Id)}>
            <Stack
              direction="horizontal"
              justify="space-between"
              align="center"
              style={[selectionCardStackStyle, { backgroundColor: backgroundColor }]}>
              <Stack direction="horizontal" gap="16p" style={style.nameAndDescriptionStack}>
                {predefinedElement.Name === "Cashback" ? (
                  <CashbackIcon />
                ) : (
                  <Image resizeMode="contain" source={mokafaaIcon} />
                )}
                <Stack direction="vertical" gap="4p">
                  <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                    {predefinedElement.Name}
                  </Typography.Text>
                  <Typography.Text size="footnote" weight="regular" color="neutralBase-10">
                    {predefinedElement.Description}
                  </Typography.Text>
                </Stack>
              </Stack>
              <Radio
                isSelected={predefinedElement.Id === predefinedValue}
                onPress={() => onSelectOptions(predefinedElement.Id)}
              />
            </Stack>
          </Pressable>
        );
      })}
    </>
  );
}

const style = StyleSheet.create({
  nameAndDescriptionStack: {
    width: "70%",
  },
});
