import { create } from "react-test-renderer";

import { PaySadadBillIcon } from "../PaySadadBillIcon";

describe("icon/PaySadadBillIcon", () => {
  it("renders a PaySadadBillIcon", () => {
    const result = create(<PaySadadBillIcon />);

    expect(result).toMatchSnapshot();
  });
});
