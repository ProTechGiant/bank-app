import { create } from "react-test-renderer";

import { FriendsIcon } from "../FriendsIcon";

describe("icon/FriendsIcon", () => {
  it("renders a FriendsIcon", () => {
    const result = create(<FriendsIcon />);

    expect(result).toMatchSnapshot();
  });
});
