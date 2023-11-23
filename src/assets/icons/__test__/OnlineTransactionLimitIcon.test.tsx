import { create } from "react-test-renderer";

import { OnlineTransactionLimitIcon } from "../OnlineTransactionLimitIcon";

describe("icon/OnlineTransactionLimitIcon", () => {
  it("renders a OnlineTransactionLimitIcon", () => {
    const result = create(<OnlineTransactionLimitIcon />);

    expect(result).toMatchSnapshot();
  });
});
