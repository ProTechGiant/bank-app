import { create } from "react-test-renderer";

import { CalendarSmallIcon } from "../CalendarSmallIcon";

describe("icon/CalendarSmallIcon", () => {
  it("renders a CalendarSmallIcon", () => {
    const result = create(<CalendarSmallIcon />);

    expect(result).toMatchSnapshot();
  });
});
