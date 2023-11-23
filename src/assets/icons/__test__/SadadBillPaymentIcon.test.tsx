import { create } from "react-test-renderer";

import { SadadBillPaymentIcon } from "../SadadBillPaymentIcon";

describe("icon/SadadBillPaymentIcon", () => {
  it("renders a SadadBillPaymentIcon", () => {
    const result = create(<SadadBillPaymentIcon />);

    expect(result).toMatchSnapshot();
  });
});
