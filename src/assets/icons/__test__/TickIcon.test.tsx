import { create } from "react-test-renderer";

import { TickIcon } from "../TickIcon";

describe("icon/TickIcon", () => {
  it("renders a TickIcon", () => {
    const result = create(<TickIcon />);

    expect(result).toMatchSnapshot();
  });
});
