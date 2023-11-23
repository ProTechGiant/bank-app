import { create } from "react-test-renderer";

import { GiftIcon } from "../GiftIcon";

describe("icon/GiftIcon", () => {
  it("renders a GiftIcon", () => {
    const result = create(<GiftIcon />);

    expect(result).toMatchSnapshot();
  });
});
