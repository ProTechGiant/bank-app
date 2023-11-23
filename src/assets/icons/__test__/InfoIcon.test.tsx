import { create } from "react-test-renderer";

import { InfoIcon } from "../InfoIcon";

describe("icon/InfoIcon", () => {
  it("renders a InfoIcon", () => {
    const result = create(<InfoIcon />);

    expect(result).toMatchSnapshot();
  });
});
