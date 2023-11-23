import { create } from "react-test-renderer";

import { LocalTransferIcon } from "../LocalTransferIcon";

describe("icon/LocalTransferIcon", () => {
  it("renders a LocalTransferIcon", () => {
    const result = create(<LocalTransferIcon />);

    expect(result).toMatchSnapshot();
  });
});
