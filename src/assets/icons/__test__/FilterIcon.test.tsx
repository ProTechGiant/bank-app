import { create } from "react-test-renderer";

import { FilterIcon } from "../FilterIcon";

describe("icon/FilterIcon", () => {
  it("renders a FilterIcon", () => {
    const result = create(<FilterIcon />);

    expect(result).toMatchSnapshot();
  });
});
