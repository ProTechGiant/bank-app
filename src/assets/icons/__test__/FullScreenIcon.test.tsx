import { create } from "react-test-renderer";

import { FullScreenIcon } from "../FullScreenIcon";

describe("icon/FullScreenIcon", () => {
  it("renders a FullScreenIcon", () => {
    const result = create(<FullScreenIcon />);

    expect(result).toMatchSnapshot();
  });
});
