import { Children, isValidElement } from "react";
import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import { Theme, useThemeStyles } from "@/theme";

import { ListContextProvider } from "./context/ListContext";
import * as ListEnds from "./end-components";
import * as ListItems from "./ListItem";

List.Item = ListItems;
List.End = ListEnds;

interface ListProps extends ViewProps {
  isBordered?: boolean;
  variant?: "dark" | "light";
  gap?: keyof Theme["spacing"];
  children: React.ReactElement | null | Array<React.ReactElement | null>;
}

export default function List({ isBordered = false, variant = "light", gap, children, ...restProps }: ListProps) {
  const elements = Children.toArray(children) as Array<React.ReactElement | null>;

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: variant === "dark" ? theme.palette.primaryBase : theme.palette["neutralBase-30"],
  }));

  const borderStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: variant === "dark" ? theme.palette["primaryBase-10"] : theme.palette["neutralBase-30"],
    borderWidth: 1,
  }));

  const hasBorderStyle = isBordered ? [borderStyle] : [];

  const hasBorderItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" gap={gap} style={[containerStyle, ...hasBorderStyle]} {...restProps}>
      {elements.map((element, index) => {
        return (
          <ListContextProvider variant={variant} key={index}>
            <View style={[...(isBordered ? [hasBorderItemStyle] : [])]}>
              {isValidElement(element) ? React.cloneElement(element) : null}
            </View>
            {isBordered ? elements.length - 1 === index ? null : <View style={separatorStyle} /> : null}
          </ListContextProvider>
        );
      })}
    </Stack>
  );
}
