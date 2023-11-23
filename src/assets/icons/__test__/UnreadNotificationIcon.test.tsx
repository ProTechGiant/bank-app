import { create } from "react-test-renderer";

import { UnreadNotificationIcon } from "../UnreadNotificationIcon";

describe("icon/UnreadNotificationIcon", () => {
  it("renders a UnreadNotificationIcon", () => {
    const result = create(<UnreadNotificationIcon />);

    expect(result).toMatchSnapshot();
  });
});
