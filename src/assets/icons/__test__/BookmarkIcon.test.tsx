import { create } from "react-test-renderer";

import { BookmarkIcon } from "../BookmarkIcon";

describe("icon/BookmarkIcon", () => {
  it("renders a BookmarkIcon", () => {
    const result = create(<BookmarkIcon />);

    expect(result).toMatchSnapshot();
  });
});
