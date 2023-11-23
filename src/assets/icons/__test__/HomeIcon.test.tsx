import { create } from "react-test-renderer";

import { HomeIcon } from "../HomeIcon";

describe("icon/HomeIcon", () => {
  it("renders a HomeIcon", () => {
    const result = create(<HomeIcon />);

    expect(result).toMatchSnapshot();
  });
});
