import { create } from "react-test-renderer";

import { ChevronRightIcon } from "../ChevronRightIcon";

describe("icon/ChevronRightIcon", () => {
  it("renders a ChevronRightIcon", () => {
    const result = create(<ChevronRightIcon />);

    expect(result).toMatchSnapshot();
  });
});
