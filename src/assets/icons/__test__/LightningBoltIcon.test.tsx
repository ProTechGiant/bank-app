import { create } from "react-test-renderer";

import { LightningBoltIcon } from "../LightningBoltIcon";

describe("icon/LightningBoltIcon", () => {
  it("renders a LightningBoltIcon", () => {
    const result = create(<LightningBoltIcon />);

    expect(result).toMatchSnapshot();
  });
});
