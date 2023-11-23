import { create } from "react-test-renderer";

import { ThreeDotsVerticalIcon } from "../ThreeDotsVerticalIcon";

describe("icon/ThreeDotsVerticalIcon", () => {
  it("renders a ThreeDotsVerticalIcon", () => {
    const result = create(<ThreeDotsVerticalIcon />);

    expect(result).toMatchSnapshot();
  });
});
