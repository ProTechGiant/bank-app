import { create } from "react-test-renderer";

import { FlagIcon } from "../FlagIcon";

describe("icon/FlagIcon", () => {
  it("renders a FlagIcon", () => {
    const result = create(<FlagIcon />);

    expect(result).toMatchSnapshot();
  });
});
