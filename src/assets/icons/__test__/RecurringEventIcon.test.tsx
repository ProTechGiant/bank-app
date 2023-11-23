import { create } from "react-test-renderer";

import { RecurringEventIcon } from "../RecurringEventIcon";

describe("icon/RecurringEventIcon", () => {
  it("renders a RecurringEventIcon", () => {
    const result = create(<RecurringEventIcon />);

    expect(result).toMatchSnapshot();
  });
});
