import { create } from "react-test-renderer";

import { LeaderboardIcon } from "../LeaderboardIcon";

describe("icon/LeaderboardIcon", () => {
  it("renders a LeaderboardIcon", () => {
    const result = create(<LeaderboardIcon />);

    expect(result).toMatchSnapshot();
  });
});
