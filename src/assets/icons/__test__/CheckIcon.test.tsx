import { create } from "react-test-renderer";

import { CheckIcon } from "../CheckIcon";

describe("icon/CheckIcon", () => {
  it("renders a CheckIcon", () => {
    const result = create(<CheckIcon />);

    expect(result).toMatchSnapshot();
  });
});
