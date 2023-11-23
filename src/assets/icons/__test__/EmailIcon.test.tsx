import { create } from "react-test-renderer";

import { EmailIcon } from "../EmailIcon";

describe("icon/EmailIcon", () => {
  it("renders a EmailIcon", () => {
    const result = create(<EmailIcon />);

    expect(result).toMatchSnapshot();
  });
});
