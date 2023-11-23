import { create } from "react-test-renderer";

import { CheckCircleIcon } from "../CheckCircleIcon";

describe("icon/CheckCircleIcon", () => {
  it("renders a CheckCircleIcon", () => {
    const result = create(<CheckCircleIcon />);

    expect(result).toMatchSnapshot();
  });
});
