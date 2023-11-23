import { create } from "react-test-renderer";

import { CardSuccessIcon } from "../CardSuccessIcon";

describe("icon/CardSuccessIcon", () => {
  it("renders a CardSuccessIcon", () => {
    const result = create(<CardSuccessIcon />);

    expect(result).toMatchSnapshot();
  });
});
