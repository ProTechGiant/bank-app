import { create } from "react-test-renderer";

import { RecurringPaymentIcon } from "../RecurringPaymentIcon";

describe("icon/RecurringPaymentIcon", () => {
  it("renders a RecurringPaymentIcon", () => {
    const result = create(<RecurringPaymentIcon />);

    expect(result).toMatchSnapshot();
  });
});
