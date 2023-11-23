import { create } from "react-test-renderer";

import { TopUpIcon } from "../TopUpIcon";

describe("icon/TopUpIcon", () => {
  it("renders a TopUpIcon", () => {
    const result = create(<TopUpIcon />);

    expect(result).toMatchSnapshot();
  });
});
