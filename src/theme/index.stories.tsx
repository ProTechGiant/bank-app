import { Meta, Story } from "@storybook/react";

import * as values from "./values";

export default {
  title: "design/Palette",
  parameters: {
    viewport: "responsive",
  },
} as Meta;

export const Palette: Story = () => {
  const colors = Object.keys(values.palette);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", rowGap: 18 }}>
      {colors.map(name => (
        <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ height: 175, width: 175, backgroundColor: values.palette[name] }} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
};
