import { create } from "react-test-renderer";

import { SpendingInsightIcon } from "../SpendingInsightIcon";

describe("icon/SpendingInsightIcon", () => {
  it("renders a SpendingInsightIcon", () => {
    const result = create(<SpendingInsightIcon />);

    expect(result).toMatchSnapshot();
  });
});
