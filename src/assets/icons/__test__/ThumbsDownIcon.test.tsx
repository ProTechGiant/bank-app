import { create } from "react-test-renderer";

import { ThumbsDownIcon } from "../ThumbsDownIcon";

describe("icon/ThumbsDownIcon", () => {
  it("renders a ThumbsDownIcon", () => {
    const result = create(<ThumbsDownIcon />);

    expect(result).toMatchSnapshot();
  });
});
