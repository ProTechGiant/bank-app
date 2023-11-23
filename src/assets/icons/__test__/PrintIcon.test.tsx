import { create } from "react-test-renderer";

import { PrintIcon } from "../PrintIcon";

describe("icon/PrintIcon", () => {
  it("renders a PrintIcon", () => {
    const result = create(<PrintIcon />);

    expect(result).toMatchSnapshot();
  });
});
