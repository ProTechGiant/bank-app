import { create } from "react-test-renderer";

import { CalendarIcon } from "../CalendarIcon";

describe("icon/CalendarIcon", () => {
  it("renders a CalendarIcon", () => {
    const result = create(<CalendarIcon />);

    expect(result).toMatchSnapshot();
  });
});
