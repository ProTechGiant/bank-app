import { create } from "react-test-renderer";

import { ThreeDotsIcon } from "../ThreeDotsIcon";

describe("icon/ThreeDotsIcon", () => {
  it("renders a ThreeDotsIcon", () => {
    const result = create(<ThreeDotsIcon />);

    expect(result).toMatchSnapshot();
  });
});
