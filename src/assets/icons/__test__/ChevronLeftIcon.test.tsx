import { create } from "react-test-renderer";

import { ChevronLeftIcon } from "../ChevronLeftIcon";

describe("icon/ChevronLeftIcon", () => {
  it("renders a ChevronLeftIcon", () => {
    const result = create(<ChevronLeftIcon />);

    expect(result).toMatchSnapshot();
  });
});
