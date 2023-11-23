import { create } from "react-test-renderer";

import { TransferHorizontalIcon } from "../TransferHorizontalIcon";

describe("icon/TransferHorizontalIcon", () => {
  it("renders a TransferHorizontalIcon", () => {
    const result = create(<TransferHorizontalIcon />);

    expect(result).toMatchSnapshot();
  });
});
