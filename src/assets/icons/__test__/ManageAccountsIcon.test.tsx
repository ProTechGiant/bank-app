import { create } from "react-test-renderer";

import { ManageAccountsIcon } from "../ManageAccountsIcon";

describe("icon/ManageAccountsIcon", () => {
  it("renders a ManageAccountsIcon", () => {
    const result = create(<ManageAccountsIcon />);

    expect(result).toMatchSnapshot();
  });
});
