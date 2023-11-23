import { create } from "react-test-renderer";

import { AccountBalanceWalletIcon } from "../AccountBalanceWalletIcon";

describe("icon/AccountBalanceWalletIcon", () => {
  it("renders a AccountBalanceWalletIcon", () => {
    const result = create(<AccountBalanceWalletIcon />);

    expect(result).toMatchSnapshot();
  });
});
