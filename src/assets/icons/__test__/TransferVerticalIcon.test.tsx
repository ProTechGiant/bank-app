import { create } from "react-test-renderer";

import { TransferVerticalIcon } from "../TransferVerticalIcon";

describe("icon/TransferVerticalIcon", () => {
  it("renders a TransferVerticalIcon", () => {
    const result = create(<TransferVerticalIcon />);

    expect(result).toMatchSnapshot();
  });
});
