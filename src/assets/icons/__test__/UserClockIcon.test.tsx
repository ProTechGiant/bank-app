import { create } from "react-test-renderer";

import { UserClockIcon } from "../UserClockIcon";

describe("icon/UserClockIcon", () => {
  it("renders a UserClockIcon", () => {
    const result = create(<UserClockIcon />);

    expect(result).toMatchSnapshot();
  });
});
