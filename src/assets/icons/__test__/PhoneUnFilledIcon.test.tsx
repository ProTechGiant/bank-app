import { create } from "react-test-renderer";

import { PhoneUnFilledIcon } from "../PhoneUnFilledIcon";

describe("icon/PhoneUnFilledIcon", () => {
  it("renders a PhoneUnFilledIcon", () => {
    const result = create(<PhoneUnFilledIcon />);

    expect(result).toMatchSnapshot();
  });
});
