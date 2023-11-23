import { create } from "react-test-renderer";

import { NeraNamedLogo } from "../NeraNamedLogo";

describe("icon/NeraNamedLogo", () => {
  it("renders a NeraNamedLogo", () => {
    const result = create(<NeraNamedLogo />);

    expect(result).toMatchSnapshot();
  });
});
