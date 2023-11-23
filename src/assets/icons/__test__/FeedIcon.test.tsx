import { create } from "react-test-renderer";

import { FeedIcon } from "../FeedIcon";

describe("icon/FeedIcon", () => {
  it("renders a FeedIcon", () => {
    const result = create(<FeedIcon />);

    expect(result).toMatchSnapshot();
  });
});
