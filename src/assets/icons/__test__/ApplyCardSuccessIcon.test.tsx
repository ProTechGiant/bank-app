import { create } from "react-test-renderer";

import { ApplyCardSuccessIcon } from "../ApplyCardSuccessIcon";

describe("icon/ApplyCardSuccessIcon", () => {
  it("renders a ApplyCardSuccessIcon", () => {
    const result = create(<ApplyCardSuccessIcon />);

    expect(result).toMatchSnapshot();
  });
});
