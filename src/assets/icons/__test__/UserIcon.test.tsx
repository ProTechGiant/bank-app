import { create } from "react-test-renderer";

import { UserIcon } from "../UserIcon";

describe("icon/UserIcon", () => {
  it("renders a UserIcon", () => {
    const result = create(<UserIcon />);

    expect(result).toMatchSnapshot();
  });
});
