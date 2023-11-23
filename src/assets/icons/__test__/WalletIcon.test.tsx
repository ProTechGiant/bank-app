import { create } from "react-test-renderer";

import { WalletIcon } from "../WalletIcon";

describe("icon/WalletIcon", () => {
  it("renders a WalletIcon", () => {
    const result = create(<WalletIcon />);

    expect(result).toMatchSnapshot();
  });
});
