import { create } from "react-test-renderer";

import { PaymentsIcon } from "../PaymentsIcon";

describe("icon/PaymentsIcon", () => {
  it("renders a PaymentsIcon", () => {
    const result = create(<PaymentsIcon />);

    expect(result).toMatchSnapshot();
  });
});
