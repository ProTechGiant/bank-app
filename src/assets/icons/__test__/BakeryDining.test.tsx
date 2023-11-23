import { create } from "react-test-renderer";

import { BakeryDiningIcon } from "../BakeryDining";

describe("icon/BakeryDiningIcon", () => {
  it("renders a BakeryDiningIcon", () => {
    const result = create(<BakeryDiningIcon />);

    expect(result).toMatchSnapshot();
  });
});
