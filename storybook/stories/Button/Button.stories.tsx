import { storiesOf } from "@storybook/react-native";
import { Text } from "react-native";

import CenterView from "../CenterView";
import Button from ".";

storiesOf("Button", module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add("with text", () => (
    <Button>
      <Text>Hello there!</Text>
    </Button>
  ))
  .add("with some emoji", () => (
    <Button>
      <Text>😀 😎 👍 💯</Text>
    </Button>
  ));
