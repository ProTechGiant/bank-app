import { create } from "react-test-renderer";

import { BankAccountIcon } from "../BankAccountIcon";

describe("icon/BankAccountIcon", () => {
  it("renders a BankAccountIcon", () => {
    const result = create(<BankAccountIcon />);

    expect(result).toMatchSnapshot();
  });
});
