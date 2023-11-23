import { create } from "react-test-renderer";

import { LockIcon } from "../LockIcon";

describe("icon/LockIcon", () => {
  it("renders a LockIcon", () => {
    const result = create(<LockIcon />);

    expect(result).toMatchSnapshot();
  });
});
