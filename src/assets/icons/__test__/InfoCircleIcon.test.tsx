import { create } from "react-test-renderer";

import { InfoCircleIcon } from "../InfoCircleIcon";

describe("icon/InfoCircleIcon", () => {
  it("renders a InfoCircleIcon", () => {
    const result = create(<InfoCircleIcon />);

    expect(result).toMatchSnapshot();
  });
});
