import { create } from "react-test-renderer";

import { ThumbsUpIcon } from "../ThumbsUpIcon";

describe("icon/ThumbsUpIcon", () => {
  it("renders a ThumbsUpIcon", () => {
    const result = create(<ThumbsUpIcon />);

    expect(result).toMatchSnapshot();
  });
});
