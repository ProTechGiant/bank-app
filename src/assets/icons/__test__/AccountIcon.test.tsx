import { create } from "react-test-renderer";

import { AccountIcon } from "../AccountIcon";

describe("icon/AccountIcon", () => {
  it("renders a AccountIcon", () => {
    const result = create(<AccountIcon />);

    expect(result).toMatchSnapshot();
  });
});
