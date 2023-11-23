import { create } from "react-test-renderer";

import { MinusIcon } from "../MinusIcon";

describe("icon/MinusIcon", () => {
  it("renders a MinusIcon", () => {
    const result = create(<MinusIcon />);

    expect(result).toMatchSnapshot();
  });
});
