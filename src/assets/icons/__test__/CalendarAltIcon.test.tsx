import { create } from "react-test-renderer";

import { CalendarAltIcon } from "../CalendarAltIcon";

describe("icon/CalendarAltIcon", () => {
  it("renders a CalendarAltIcon", () => {
    const result = create(<CalendarAltIcon />);

    expect(result).toMatchSnapshot();
  });
});
