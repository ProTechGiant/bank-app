import { create } from "react-test-renderer";

import Button from "./index";

describe("components/Button", () => {
  it("renders a primary, small button", () => {
    const result = create(
      <Button size="medium" variant="primary">
        Hello World!
      </Button>
    );

    expect(result).toMatchSnapshot();
  });
});
