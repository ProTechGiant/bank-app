import { create } from "react-test-renderer";

import { Mobile } from "../Mobile";

describe("icon/Mobile", () => {
  it("renders a Mobile", () => {
    const result = create(<Mobile />);

    expect(result).toMatchSnapshot();
  });
});
