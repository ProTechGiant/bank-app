import { create } from "react-test-renderer";

import { LifestyleIcon } from "../LifestyleIcon";

describe("icon/LifestyleIcon", () => {
  it("renders a LifestyleIcon", () => {
    const result = create(<LifestyleIcon />);

    expect(result).toMatchSnapshot();
  });
});
