import { create } from "react-test-renderer";

import { TickCircleOutlineIcon } from "../TickCircleOutlineIcon";

describe("icon/TickCircleOutlineIcon", () => {
  it("renders a TickCircleOutlineIcon", () => {
    const result = create(<TickCircleOutlineIcon />);

    expect(result).toMatchSnapshot();
  });
});
