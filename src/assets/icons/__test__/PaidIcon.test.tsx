import { create } from "react-test-renderer";

import { PaidIcon } from "../PaidIcon";

describe("icon/PaidIcon", () => {
  it("renders a PaidIcon", () => {
    const result = create(<PaidIcon />);

    expect(result).toMatchSnapshot();
  });
});
