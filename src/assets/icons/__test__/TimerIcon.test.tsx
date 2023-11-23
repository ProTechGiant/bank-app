import { create } from "react-test-renderer";

import { TimerIcon } from "../TimerIcon";

describe("icon/TimerIcon", () => {
  it("renders a TimerIcon", () => {
    const result = create(<TimerIcon />);

    expect(result).toMatchSnapshot();
  });
});
