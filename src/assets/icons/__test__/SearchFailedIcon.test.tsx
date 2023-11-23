import { create } from "react-test-renderer";

import { SearchFailedIcon } from "../SearchFailedIcon";

describe("icon/SearchFailedIcon", () => {
  it("renders a SearchFailedIcon", () => {
    const result = create(<SearchFailedIcon />);

    expect(result).toMatchSnapshot();
  });
});
