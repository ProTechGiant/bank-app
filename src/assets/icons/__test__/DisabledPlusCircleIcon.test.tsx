import { create } from "react-test-renderer";

import { DisabledPlusCircleIcon } from "../DisabledPlusCircleIcon";

describe("icon/DisabledPlusCircleIcon", () => {
  it("renders a DisabledPlusCircleIcon", () => {
    const result = create(<DisabledPlusCircleIcon />);

    expect(result).toMatchSnapshot();
  });
});
