import { create } from "react-test-renderer";

import { ShippingIcon } from "../ShippingIcon";

describe("icon/ShippingIcon", () => {
  it("renders a ShippingIcon", () => {
    const result = create(<ShippingIcon />);

    expect(result).toMatchSnapshot();
  });
});
