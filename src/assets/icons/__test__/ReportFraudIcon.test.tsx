import { create } from "react-test-renderer";

import { ReportFraudIcon } from "../ReportFraudIcon";

describe("icon/ReportFraudIcon", () => {
  it("renders a ReportFraudIcon", () => {
    const result = create(<ReportFraudIcon />);

    expect(result).toMatchSnapshot();
  });
});
