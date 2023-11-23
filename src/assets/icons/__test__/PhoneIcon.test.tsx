import { create } from "react-test-renderer";

import { PhoneIcon } from "../PhoneIcon";

describe("icon/PhoneIcon", () => {
  it("renders a PhoneIcon", () => {
    const result = create(<PhoneIcon />);

    expect(result).toMatchSnapshot();
  });
});
