import { create } from "react-test-renderer";

import { MoneyIcon } from "../MoneyIcon";

describe("icon/MoneyIcon", () => {
  it("renders a MoneyIcon", () => {
    const result = create(<MoneyIcon />);

    expect(result).toMatchSnapshot();
  });
});
