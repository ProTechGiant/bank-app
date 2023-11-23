import { create } from "react-test-renderer";

import { CanPurchaseIcon } from "../CanPurchaseIcon";

describe("icon/CanPurchaseIcon", () => {
  it("renders a CanPurchaseIcon", () => {
    const result = create(<CanPurchaseIcon />);

    expect(result).toMatchSnapshot();
  });
});
