import { create } from "react-test-renderer";

import { GlobeIcon } from "../GlobeIcon";

describe("icon/GlobeIcon", () => {
  it("renders a GlobeIcon", () => {
    const result = create(<GlobeIcon />);

    expect(result).toMatchSnapshot();
  });
});
