import { create } from "react-test-renderer";

import { NotificationIcon } from "../NotificationIcon";

describe("icon/NotificationIcon", () => {
  it("renders a NotificationIcon", () => {
    const result = create(<NotificationIcon />);

    expect(result).toMatchSnapshot();
  });
});
