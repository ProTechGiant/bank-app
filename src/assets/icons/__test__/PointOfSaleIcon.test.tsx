import { create } from "react-test-renderer";

import { PointOfSaleIcon } from "../PointOfSaleIcon";

describe("icon/PointOfSaleIcon", () => {
  it("renders a PointOfSaleIcon", () => {
    const result = create(<PointOfSaleIcon />);

    expect(result).toMatchSnapshot();
  });
});
