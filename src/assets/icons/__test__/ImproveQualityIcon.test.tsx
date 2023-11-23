import { create } from "react-test-renderer";

import { ImproveQualityIcon } from "../ImproveQualityIcon";

describe("icon/ImproveQualityIcon", () => {
  it("renders a ImproveQualityIcon", () => {
    const result = create(<ImproveQualityIcon />);

    expect(result).toMatchSnapshot();
  });
});
