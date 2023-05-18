/* eslint-disable react-native/no-inline-styles */
import { Meta, Story } from "@storybook/react";
import { cloneElement } from "react";

import * as icons from "./index";

export default {
  title: "design/Iconography",
  parameters: {
    viewport: "responsive",
  },
} as Meta;

export const Iconography: Story = () => {
  const iconTitles = Object.keys(icons);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", rowGap: 24 }}>
      {iconTitles.map(name => {
        // @ts-expect-error cannot use name to index `icons`
        const Element = icons[name] as React.FC<icons.IconProps> | string;

        return (
          <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {typeof Element === "string" ? (
              <img src={Element} style={{ height: 40, width: 40, color: "black" }} />
            ) : (
              cloneElement(<Element />, { width: 40, height: 40, color: "black" })
            )}
            <span>{name}</span>
          </div>
        );
      })}
    </div>
  );
};
