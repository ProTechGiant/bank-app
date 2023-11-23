import { create } from "react-test-renderer";

import { InternalTransferIcon } from "../InternalTransferIcon";

describe("icon/InternalTransferIcon", () => {
  it("renders a InternalTransferIcon", () => {
    const result = create(<InternalTransferIcon />);

    expect(result).toMatchSnapshot();
  });
});
