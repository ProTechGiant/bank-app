import { create } from "react-test-renderer";

import { PersonIcon } from "../PersonIcon";

describe("icon/PersonIcon", () => {
  it("renders a PersonIcon", () => {
    const result = create(<PersonIcon />);

    expect(result).toMatchSnapshot();
  });
});
