import { create } from "react-test-renderer";

import { GoldWalletIcon } from "../GoldWalletIcon";

describe("icon/GoldWalletIcon", () => {
  it("renders a GoldWalletIcon", () => {
    const result = create(<GoldWalletIcon />);

    expect(result).toMatchSnapshot();
  });
});
