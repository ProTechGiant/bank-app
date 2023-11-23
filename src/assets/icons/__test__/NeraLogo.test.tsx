import { create } from "react-test-renderer";

import { NeraLogo } from "../NeraLogo";

describe("icon/NeraLogo", () => {
  it("renders a NeraLogo", () => {
    const result = create(<NeraLogo />);

    expect(result).toMatchSnapshot();
  });
});
