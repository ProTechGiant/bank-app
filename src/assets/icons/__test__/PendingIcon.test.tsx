import { create } from "react-test-renderer";

import { PendingIcon } from "../PendingIcon";

describe("icon/PendingIcon", () => {
  it("renders a PendingIcon", () => {
    const result = create(<PendingIcon />);

    expect(result).toMatchSnapshot();
  });
});
