import { storiesOf } from "@storybook/react";

import Button from "@/components/Button";

const sizes = ["small", "medium", "large"] as const;
const variants = ["primary", "secondary", "tertiary"] as const;

const storiesApi = storiesOf("components/Button", module);

variants.forEach(variant => {
  sizes.forEach(size => {
    storiesApi.add(`${variant}, ${size}`, () => (
      <Button size={size} variant={variant}>
        Hello World!
      </Button>
    ));
  });
});
