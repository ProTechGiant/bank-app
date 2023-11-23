import { create } from "react-test-renderer";

import { SummarizeIcon } from "../SummarizeIcon";

describe("icon/SummarizeIcon", () => {
  it("renders a SummarizeIcon", () => {
    const result = create(<SummarizeIcon />);

    expect(result).toMatchSnapshot();
  });
});
