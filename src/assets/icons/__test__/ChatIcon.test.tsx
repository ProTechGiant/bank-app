import { create } from "react-test-renderer";

import { ChatIcon } from "../ChatIcon";

describe("icon/ChatIcon", () => {
  it("renders a ChatIcon", () => {
    const result = create(<ChatIcon />);

    expect(result).toMatchSnapshot();
  });
});
