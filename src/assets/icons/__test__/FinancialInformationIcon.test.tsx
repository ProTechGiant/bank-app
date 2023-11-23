import { create } from "react-test-renderer";

import { FinancialInformationIcon } from "../FinancialInformationIcon";

describe("icon/FinancialInformationIcon", () => {
  it("renders a FinancialInformationIcon", () => {
    const result = create(<FinancialInformationIcon />);

    expect(result).toMatchSnapshot();
  });
});
