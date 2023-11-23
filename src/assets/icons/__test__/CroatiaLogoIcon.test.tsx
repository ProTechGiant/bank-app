import { create } from "react-test-renderer";

import { CroatiaLogoIcon } from "../CroatiaLogoIcon";

describe("icon/CroatiaLogoIcon", () => {
  it("renders a CroatiaLogoIcon", () => {
    const result = create(<CroatiaLogoIcon />);

    expect(result).toMatchSnapshot();
  });
});
