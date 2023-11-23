import { create } from "react-test-renderer";

import { RemoveIcon } from "../RemoveIcon";

describe("icon/RemoveIcon", () => {
  it("renders a RemoveIcon", () => {
    const result = create(<RemoveIcon />);

    expect(result).toMatchSnapshot();
  });
});
