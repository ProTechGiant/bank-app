import { create } from "react-test-renderer";

import { ErrorCircleIcon } from "../ErrorCircleIcon";

describe("icon/ErrorCircleIcon", () => {
  it("renders a ErrorCircleIcon", () => {
    const result = create(<ErrorCircleIcon />);

    expect(result).toMatchSnapshot();
  });
});
