import { create } from "react-test-renderer";

import { PhoneFilledIcon } from "../PhoneFilledIcon";

describe("icon/PhoneFilledIcon", () => {
  it("renders a PhoneFilledIcon", () => {
    const result = create(<PhoneFilledIcon />);

    expect(result).toMatchSnapshot();
  });
});
