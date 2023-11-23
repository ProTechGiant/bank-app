import { create } from "react-test-renderer";

import { CloseIcon } from "../CloseIcon";

describe("icon/CloseIcon", () => {
  it("renders a CloseIcon", () => {
    const result = create(<CloseIcon />);

    expect(result).toMatchSnapshot();
  });
});
