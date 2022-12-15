import { create } from "react-test-renderer";

import Button from "./index";

describe("components/Button", () => {
  it("renders a primary button", () => {
    const result = create(<Button variant="primary">Hello World!</Button>);

    expect(result).toMatchSnapshot();
  });
});
