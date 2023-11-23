import { create } from "react-test-renderer";

import { AccessTimeIcon } from "../AccessTimeIcon";

describe("icon/AccessTimeIcon", () => {
  it("renders a AccessTimeIcon", () => {
    const result = create(<AccessTimeIcon />);

    expect(result).toMatchSnapshot();
  });
});
