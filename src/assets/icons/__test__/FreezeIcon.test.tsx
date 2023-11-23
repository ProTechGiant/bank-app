import { create } from "react-test-renderer";

import { FreezeIcon } from "../FreezeIcon";

describe("icon/FreezeIcon", () => {
  it("renders a FreezeIcon", () => {
    const result = create(<FreezeIcon />);

    expect(result).toMatchSnapshot();
  });
});
