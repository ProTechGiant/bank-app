import { create } from "react-test-renderer";

import { PostcardIcon } from "../PostcardIcon";

describe("icon/PostcardIcon", () => {
  it("renders a PostcardIcon", () => {
    const result = create(<PostcardIcon />);

    expect(result).toMatchSnapshot();
  });
});
