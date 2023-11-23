import { create } from "react-test-renderer";

import { ChevronUpIcon } from "../ChevronUpIcon";

describe("icon/ChevronUpIcon", () => {
  it("renders a ChevronUpIcon", () => {
    const result = create(<ChevronUpIcon />);

    expect(result).toMatchSnapshot();
  });
});
