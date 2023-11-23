import { create } from "react-test-renderer";

import { NumbersIcon } from "../NumbersIcon";

describe("icon/NumbersIcon", () => {
  it("renders a NumbersIcon", () => {
    const result = create(<NumbersIcon />);

    expect(result).toMatchSnapshot();
  });
});
