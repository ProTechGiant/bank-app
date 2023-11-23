import { create } from "react-test-renderer";

import { ReportIcon } from "../ReportIcon";

describe("icon/ReportIcon", () => {
  it("renders a ReportIcon", () => {
    const result = create(<ReportIcon />);

    expect(result).toMatchSnapshot();
  });
});
