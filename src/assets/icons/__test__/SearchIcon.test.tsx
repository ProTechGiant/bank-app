import { create } from "react-test-renderer";

import { SearchIcon } from "../SearchIcon";

describe("icon/SearchIcon", () => {
  it("renders a SearchIcon", () => {
    const result = create(<SearchIcon />);

    expect(result).toMatchSnapshot();
  });
});
