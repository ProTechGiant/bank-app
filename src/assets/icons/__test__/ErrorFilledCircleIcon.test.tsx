import { create } from "react-test-renderer";

import { ErrorFilledCircleIcon } from "../ErrorFilledCircleIcon";

describe("icon/ErrorFilledCircleIcon", () => {
  it("renders a ErrorFilledCircleIcon", () => {
    const result = create(<ErrorFilledCircleIcon />);

    expect(result).toMatchSnapshot();
  });
});
