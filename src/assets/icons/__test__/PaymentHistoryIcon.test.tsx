import { create } from "react-test-renderer";

import { PaymentHistoryIcon } from "../PaymentHistoryIcon";

describe("icon/PaymentHistoryIcon", () => {
  it("renders a PaymentHistoryIcon", () => {
    const result = create(<PaymentHistoryIcon />);

    expect(result).toMatchSnapshot();
  });
});
