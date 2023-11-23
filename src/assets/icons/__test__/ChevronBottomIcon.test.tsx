import { create } from "react-test-renderer";

import { ChevronBottomIcon } from "../ChevronBottomIcon";

describe("icon/ChevronBottomIcon", () => {
  it("renders a ChevronBottomIcon", () => {
    const result = create(<ChevronBottomIcon />);

    expect(result).toMatchSnapshot();
  });
});
