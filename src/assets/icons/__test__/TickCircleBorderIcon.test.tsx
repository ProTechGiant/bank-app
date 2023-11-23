import { create } from "react-test-renderer";

import { TickCircleBorderIcon } from "../TickCircleBorderIcon";

describe("icon/TickCircleBorderIcon", () => {
  it("renders a TickCircleBorderIcon", () => {
    const result = create(<TickCircleBorderIcon />);

    expect(result).toMatchSnapshot();
  });
});
